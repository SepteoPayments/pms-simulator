Simulateur PMS - demo locale (sandbox)
======================================

But : montrer que plusieurs metiers (immobilier, spa, location) tapent la MEME API
publique Septeo Payments. Chaque bouton ouvre une vraie session et monte un vrai
Drop-in Adyen (environnement de TEST). Les paiements sont reels cote Adyen test.

PREREQUIS
  - Node.js (>= 16). Aucune dependance a installer (modules natifs uniquement).

LANCER
  1. Ouvrir un terminal dans ce dossier.
  2. node server.js
  3. Ouvrir http://localhost:3000
  (Le port 3000 est obligatoire : c'est l'origine autorisee par le clientKey Adyen.)

CARTE DE TEST
  4111 1111 1111 1111  -  03/30  -  CVC 737

CE QUE FAIT LE BACKEND (server.js)
  - signe un token OAuth private_key_jwt (private.pem, sandbox)
  - appelle POST /api/public/v1/sessions avec les params du scenario choisi
  - renvoie le clientSession au navigateur, qui monte le Drop-in

SECURITE
  - private.pem est une cle de TEST (sandbox). Ne jamais la partager, ne jamais
    mettre ce dossier dans le repo Septeo-Payments.
  - Aucun secret de prod ici.

SCENARIOS (voir config.js)
  Immobilier : loyer (immediat) / depot de garantie (pre-auth) / prelevement mensuel (tokenisation)
  Spa        : seance (immediat) / caution no-show (pre-auth) / TPE (Terminal API, si terminal dispo)
  Location   : reservation (pre-auth caution) / solde (immediat)

NOTES
  - TPE : appel reel /payments/pos, mais necessite un terminal (POIID) enregistre. Non branche par defaut.
  - SEPA mandat : le consentement s'affiche mais le mandat stocke ne remonte qu'en live (limite Adyen test).
