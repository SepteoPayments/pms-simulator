# Simulateur PMS — démo locale (sandbox)

Mini-app **locale** qui met en scène l'API **Payments by Septeo** sous huit métiers Septeo, chacun avec sa marque fictive,
sa direction artistique et ses fiches produit détaillées. Toutes les vitrines tapent la **même API publique** (sandbox) :
elles ouvrent une vraie session et montent un vrai **Drop-in Adyen** (paiements de **test**).
But : montrer qu'une seule API agnostique porte tous les métiers — et que les données client « voyagent » avec le paiement.

> **Hors du repo Septeo-Payments** (c'est une démo, pas du code produit). Ne jamais y committer.
> `private.pem` est une clé de **test** (sandbox) — ne jamais la partager.

## Secret — la clé privée (avant le 1er lancement)

Dépose le fichier **`private.pem`** (clé privée **sandbox** du client de test) à la **racine** du repo.
Il est **gitignoré** : chaque personne qui clone doit le placer (demande-le à l'équipe, jamais par un canal public).
`config.js` pointe dessus (`privateKeyFile: './private.pem'`) et `server.js` le lit pour signer le token `private_key_jwt`.
Sans ce fichier, le serveur ne démarre pas.

## Lancer

Node ≥ 16 requis. Aucune dépendance à installer (modules natifs uniquement).

```powershell
cd C:\Users\DYL.SENASSON\documents\pms-simulator
node server.js
```

Puis ouvrir **http://localhost:3000**. Le serveur sert `public/` à chaud : pas besoin de redémarrer, on rafraîchit.
Le port **3000 est obligatoire** : c'est l'origine autorisée par le clientKey Adyen.

Carte de test : **4111 1111 1111 1111** · 03/30 · CVC 737.

## Les huit univers

| Univers | Marque mise en scène | Produit Septeo | Page catalogue | Fiche détaillée | Paiement mis en avant |
|---|---|---|---|---|---|
| 🏨 Hôtel | Hôtel Le Rivage (Cassis) | Asterio · Ulyses | `hotel.html` | `hotel-chambre.html?id=` | caution 1 nuit → note au départ |
| ⛺ Camping | Les Flots Bleus (Mimizan) | eSeason · Resalys | `camping.html` (plan interactif, activités) | `camping-hebergement.html?id=` | acompte 30 % + solde + activités |
| 💆 Spa | Spa Émeraude (Aix) | Nymphea | `spa.html` (panier, cures, bons cadeaux) | `spa-soin.html?id=` | immédiat, caution no-show, bon cadeau |
| 🏖️ Location | Maisons du Littoral | Resalys | `location.html` | `location-logement.html?id=` | acompte, solde, dépôt (caution) |
| 🏠 Gestion locative | Bellecour Gestion | SPI Gestion Locative | `immobilier.html` (espace locataire à onglets) | — | loyer, dépôt, mandat SEPA |
| 🏢 Syndic | Résidence Le Parc · Cabinet Vernet | SPI Syndic | `syndic.html` (extranet copro) | — | charges par mandat, travaux ponctuels |
| 📄 Transaction | Saint-Jean Immobilier | SPI Transaction · Modelo | `transaction.html` | `transaction-bien.html?id=` | séquestre 5 % (gros montant) |
| 🍽️ Restauration | Brasserie du Vieux-Port | POS Ulyses | `restaurant.html` (carte, plan de salle, addition) | `restaurant-plat.html?id=` | addition, empreinte groupe, TPE |

- **Accueil** `index.html` : scène animée + sélecteur des univers + les 3 modes de paiement.
- **Confirmation** `confirmation.html` : récap brandé, segment client (data travel), e-mail simulé.
- **Console d'opérations** `operations.html` + `ops.js` : capture / annulation / reversal / remboursement / ajustement / extension / MIT / moyens enregistrés.

Chaque page porte la signature co-brandée « *[marque] × propulsé par Payments by Septeo* » (`img/payments-by-septeo.svg`, inliné par `site.js`).

## Architecture front

```
public/
  themes.js            modèle des 8 univers (marque, produit, accent, polices, pages)  ← source de vérité
  theme-switcher.js    menu déroulant « changer d'univers » dans la barre du haut
  site.js              helpers UI partagés : signature Payments by Septeo, galerie/lightbox, calendrier, onglets, toasts…
  common.js            runtime paiement : PMS.pay / PMS.pos / panier / PMS.euros            (mécanique intouchable)
  checkout.js          parcours brandé : récap → formulaire client + champs métier → Drop-in → confirmation.html
  styles.css           base + checkout + confirmation + console
  ui.css               composants (fiches, cartes, galeries, calendriers, tableaux, timelines, badges…)
  skins.css            une personnalité par métier (.theme-hotel, .theme-camping, …)
  data/*.js            données par métier (chambres, soins, logements, hébergements, bail, copro, biens, carte)
  img/                 ~160 photos distinctes (LoremFlickr, locales) + payments-by-septeo.svg
server.js / config.js / private.pem   backend Node natif (token private_key_jwt → API Septeo Payments)
```

Flux : le front clique → `PMS.checkout({amount, currency, mode, itemLabel, summary, prefill})` → formulaire (personas Charles/Juliette)
→ `POST /api/pay {mode, amount}` → notre `POST /sessions` → `clientSession` → Drop-in Adyen → `sessionStorage.pms_reservation` → `confirmation.html`.

Contrats à conserver : `PMS.checkout(...)`, `PMS.pay`, `PMS.pos`, boutons `[data-checkout]` (`data-mode/amount/label/summary/prefill`),
`[data-add]` (panier), `[data-pay data-pos]` (TPE). Montants en **centimes**.

## Modes de paiement (config.js)

| Mode | Effet | Usage métier |
|------|-------|--------------|
| `immediate` | capture immédiate | loyer, solde, soin, addition, séquestre, acompte |
| `caution` | pré-autorisation (empreinte gelée), capture manuelle ensuite | garantie hôtel, dépôt de garantie, no-show, groupe |
| `mandate` | enregistre le moyen de paiement (tokenisation SUBSCRIPTION) | loyer mensuel, charges trimestrielles |

## Limites connues

- **TPE** : appelle réellement `/payments/pos`, mais nécessite un terminal (POIID) enregistré → renvoie 501 par défaut.
- **SEPA mandat** : le consentement s'affiche mais le mandat stocké ne remonte qu'en **live** (limite Adyen test).
- Les données client / métier collectées (shopper, metadata) sont affichées en confirmation ; l'API publique les ignore tant que le contrat shopper/metadata n'est pas livré.
- Console d'ops : les champs marqués **(à confirmer)** dépendent des webhooks CAPTURE/REFUND/CANCELLATION à valider.

## Identifiants sandbox utilisés

Client de test **Marc Resort Group 2** (`clientId 516e19cb-…`), boutique **Marc Spa & Massage**
(`publicStoreId 7fd1d1b5-…`), env Adyen **test**. Détails dans `config.js`.

**La clé est calibrée sur un main-customer.** Le trio `private.pem` + `clientId` + `kid` identifie **un** main-customer (Marc Resort Group 2). Elle autorise **tout son périmètre** :

- ✅ tu peux changer `publicStoreId` (dans `config.js`) pour **n'importe quelle boutique de CE main-customer** → ça marche.
- ❌ elle **ne fonctionne pas** pour une boutique d'un **autre** main-customer → refus (cloisonnement, 403/404). Il faudrait la clé (clientId/kid + clé privée) **de cet autre main-customer**.

Une clé = un main-customer, tous ses stores ; jamais les stores d'un autre.
