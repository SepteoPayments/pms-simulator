/*
 * Simulateur PMS - configuration locale (sandbox uniquement).
 * Tout pointe l'environnement de TEST Adyen via NOTRE API publique.
 * Ne jamais mettre de secret de prod ici, ne jamais partager private.pem.
 */
module.exports = {
  // --- Notre API publique (sandbox) ---
  baseUrl: 'https://septeo-payments-public-api-sandbox.septeo.fr',
  tokenUrl: 'https://septeo-payments-public-api-sandbox.septeo.fr/oauth2/token',

  // --- OAuth private_key_jwt (client de test "Marc Resort Group 2") ---
  clientId: '516e19cb-2198-4639-ad2e-7434ebb436f3',
  kid: 'key-bb655bd0-c75f-46ba-8403-cb4987d04edf',
  privateKeyFile: './private.pem',
  aud: 'https://oauth.api.septeo-payments.fr/oauth2/token',
  scope: 'payments:read payments:write',
  tokenAudience: 'septeo-payments-public-api',

  // --- Boutique de test (Marc Spa & Massage). En sandbox il n'y en a qu'une :
  //     tous les metiers tapent la meme -> une seule API agnostique, les metiers sont des habillages. ---
  publicStoreId: '7fd1d1b5-89eb-4318-aa13-f6f51dc14ac2',

  // --- Adyen Drop-in (cote navigateur) ---
  clientKey: 'test_K3LXZTKIBNFUPHWO75L5PGBM6YAKWBGE',
  adyenEnvironment: 'test',

  port: 3000, // origine autorisee Adyen : http://localhost:3000

  /*
   * Modes de paiement = traduction "intention metier" -> parametres de session /sessions.
   * Le front envoie { mode, amount } ; le backend applique le mode ci-dessous.
   *  - immediate : capture immediate (auto)
   *  - caution   : pre-autorisation (empreinte gelee), capture manuelle plus tard
   *  - mandate   : enregistre le moyen de paiement (mandat / carte sur fichier) + capture immediate.
   *                consentMode = ASK_FOR_CONSENT -> Adyen affiche la case de consentement (le client peut refuser) ;
   *                FORCED -> stockage impose sans case (#2793). Le front peut surcharger ce defaut.
   */
  paymentModes: {
    immediate: { capture: { mode: 'IMMEDIATE' }, preAuth: false, tokenization: null },
    caution:   { capture: { mode: 'MANUAL' },    preAuth: true,  tokenization: null },
    mandate:   { capture: { mode: 'IMMEDIATE' }, preAuth: false, tokenization: { recurringModel: 'SUBSCRIPTION', consentMode: 'ASK_FOR_CONSENT' } },
  },
};
