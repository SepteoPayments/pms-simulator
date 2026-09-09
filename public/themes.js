/*
 * Modèle des univers métier du simulateur. Une seule API de paiement derrière, les métiers sont des habillages.
 * Chaque thème : produit Septeo réel, marque fictive mise en scène, emoji, image hero, accent, page, mode de paiement
 * mis en avant, typographies (Google Fonts) et fiche « détail » associée.
 * Réutilisé par : accueil animé (index.html), sélecteur (theme-switcher.js), parcours de paiement brandé (checkout.js),
 * signature Payments by Septeo (site.js) et page de confirmation.
 */
window.THEMES = [
  { key: 'hotel', emoji: '🏨', name: 'Hôtel', product: 'Asterio · Ulyses', page: 'hotel.html', detail: 'hotel-chambre.html',
    brand: 'Hôtel Le Rivage', brandSub: 'Cassis · 4 étoiles', city: 'Cassis', img: 'img/hotel-hero.jpg', accent: '#b7885a', dark: true,
    tagline: 'Réservation garantie par empreinte, note réglée au départ.', mode: 'Caution → capture au check-out',
    fonts: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap',
    pitch: 'Le PMS Asterio pré-autorise une nuit à la réservation, capture la note au check-out et ajoute les extras.' },
  { key: 'camping', emoji: '⛺', name: 'Camping & plein air', product: 'eSeason · Resalys', page: 'camping.html', detail: 'camping-hebergement.html',
    brand: 'Camping Les Flots Bleus', brandSub: 'Landes · Côte atlantique', city: 'Mimizan', img: 'img/camping-hero.jpg', accent: '#3f8f5a', dark: false,
    tagline: 'Acompte de 30 % au séjour, solde avant l’arrivée, activités à la carte.', mode: 'Acompte + solde fractionné',
    fonts: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700;800&display=swap',
    pitch: 'eSeason encaisse l’acompte à la réservation, le solde à J-30 et les activités sur place.' },
  { key: 'spa', emoji: '💆', name: 'Spa & bien-être', product: 'Nymphea', page: 'spa.html', detail: 'spa-soin.html',
    brand: 'Spa Émeraude', brandSub: 'Bien-être · Aix-en-Provence', city: 'Aix-en-Provence', img: 'img/spa-hero.jpg', accent: '#2f6b53', dark: false,
    tagline: 'Soins réglés en ligne, caution no-show, bons cadeaux.', mode: 'Immédiat · caution no-show',
    fonts: 'https://fonts.googleapis.com/css2?family=Marcellus&family=Mulish:wght@300;400;500;600;700&display=swap',
    pitch: 'Nymphea encaisse les soins et les bons cadeaux, et garantit les créneaux premium par une empreinte.' },
  { key: 'location', emoji: '🏖️', name: 'Location saisonnière', product: 'Resalys', page: 'location.html', detail: 'location-logement.html',
    brand: 'Maisons du Littoral', brandSub: 'Conciergerie · Locations de vacances', city: 'La Rochelle', img: 'img/loc-hero.jpg', accent: '#0e6b74', dark: false,
    tagline: 'Acompte, solde et dépôt de garantie, sans avance de frais.', mode: 'Immédiat + caution',
    fonts: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap',
    pitch: 'Resalys encaisse l’acompte, puis le solde, et pré-autorise le dépôt de garantie à l’arrivée.' },
  { key: 'gestion', emoji: '🏠', name: 'Gestion locative', product: 'SPI Gestion Locative', page: 'immobilier.html', detail: 'immobilier.html',
    brand: 'Bellecour Gestion', brandSub: 'Espace locataire', city: 'Lyon', img: 'img/immo-hero.jpg', accent: '#2f5fd0', dark: false,
    tagline: 'Loyer, dépôt de garantie et prélèvement mensuel par mandat.', mode: 'Mandat SEPA récurrent',
    fonts: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
    pitch: 'SPI Gestion Locative encaisse le loyer, gèle le dépôt et enregistre le mandat pour les prélèvements.' },
  { key: 'syndic', emoji: '🏢', name: 'Syndic de copropriété', product: 'SPI Syndic', page: 'syndic.html', detail: 'syndic.html',
    brand: 'Résidence Le Parc', brandSub: 'Extranet copropriétaires · Cabinet Vernet', city: 'Lyon', img: 'img/syndic-hero.jpg', accent: '#5a6b8c', dark: true,
    tagline: 'Appels de charges prélevés à chaque échéance, travaux réglés à part.', mode: 'Mandat récurrent · ponctuel',
    fonts: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@400;500;600;700&display=swap',
    pitch: 'SPI Syndic prélève les appels de charges par mandat et encaisse les appels de fonds travaux.' },
  { key: 'transaction', emoji: '📄', name: 'Transaction immobilière', product: 'SPI Transaction · Modelo', page: 'transaction.html', detail: 'transaction-bien.html',
    brand: 'Saint-Jean Immobilier', brandSub: 'Agence & étude notariale partenaire', city: 'Lyon', img: 'img/transaction-hero.jpg', accent: '#7a5227', dark: true,
    tagline: 'Séquestre de 5 % versé au compromis, en ligne et tracé.', mode: 'Immédiat (gros montant)',
    fonts: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap',
    pitch: 'SPI Transaction encaisse le séquestre au compromis et le trace jusqu’à la signature de l’acte.' },
  { key: 'resto', emoji: '🍽️', name: 'Restauration', product: 'POS Ulyses · Asterio', page: 'restaurant.html', detail: 'restaurant-plat.html',
    brand: 'Brasserie du Vieux-Port', brandSub: 'Marseille · Cuisine de la mer', city: 'Marseille', img: 'img/resto-hero.jpg', accent: '#8a3b2e', dark: true,
    tagline: 'Addition réglée en salle, empreinte pour les groupes, TPE au comptoir.', mode: 'Immédiat · caution · TPE',
    fonts: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Karla:wght@400;500;600;700&display=swap',
    pitch: 'Le POS Ulyses encaisse l’addition, prend une empreinte pour les grandes tables et pilote le TPE.' },
];
window.THEME_BY_KEY = {};
window.THEMES.forEach(function (t) { window.THEME_BY_KEY[t.key] = t; });
