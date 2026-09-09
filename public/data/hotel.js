/* Données de l'univers Hôtel — Hôtel Le Rivage (Cassis, 4★). Montants en centimes. */
window.DATA_HOTEL = {
  hotel: { name: 'Hôtel Le Rivage', stars: 4, city: 'Cassis', address: '12 quai des Baux, 13260 Cassis', rating: 4.7, reviews: 1284, checkin: '15:00', checkout: '11:00',
    phone: '+33 4 42 01 00 00', pms: 'Asterio · Ulyses' },
  taxeSejour: 250, // par personne et par nuit
  rooms: [
    { id: 'classique', name: 'Chambre Classique', short: 'Classique', tagline: 'L’essentiel du Rivage, côté jardin', night: 14500, weekendPlus: 2500, size: 22, capacity: 2, beds: '1 lit Queen 160 cm', view: 'Vue jardin méditerranéen', floor: '1er & 2e étages', exposure: 'Exposition est · lumière du matin',
      badge: 'Meilleur prix', rating: 4.5, reviewsCount: 412,
      photos: [['img/hotel-classique-1.jpg', 'Chambre Classique — lit Queen et tête de lit en chêne clair'], ['img/hotel-classique-2.jpg', 'Coin lecture et vue sur le jardin'], ['img/hotel-classique-3.jpg', 'Salle de bain avec douche à l’italienne'], ['img/hotel-lobby.jpg', 'Le lobby du Rivage']],
      desc: 'Une chambre douce et lumineuse, habillée de lin et de chêne clair, ouverte sur le jardin de pins et de lauriers-roses. Le silence de l’arrière-hôtel, à deux pas du port.',
      amenities: ['wifi', 'clim', 'tv', 'coffre', 'minibar', 'nespresso', 'sdb', 'insonorisation'],
      perks: ['Annulation gratuite jusqu’à 48 h avant l’arrivée', 'Empreinte de garantie = 1 nuit, rien n’est débité', 'Accès piscine extérieure chauffée inclus', 'Early check-in offert selon disponibilité'],
      reviews: [
        { who: 'Sandrine P.', from: 'Lyon', date: 'Août 2026', rating: 5, tag: 'Séjour en couple', text: 'Chambre impeccable, très calme malgré le centre. Le lit est un nuage. On reviendra hors saison.' },
        { who: 'Marc & Élodie', from: 'Bruxelles', date: 'Juillet 2026', rating: 4, tag: 'Escapade 3 nuits', text: 'Petite mais très bien pensée. Le jardin est un vrai plus le matin. Petit-déjeuner généreux.' },
        { who: 'Théo R.', from: 'Marseille', date: 'Juin 2026', rating: 4.5, tag: 'Voyage d’affaires', text: 'Check-in en deux minutes, empreinte bancaire sans débit, note réglée au départ : simple et fluide.' }
      ] },
    { id: 'superieure', name: 'Chambre Supérieure Vue Mer', short: 'Supérieure', tagline: 'Un balcon sur les calanques', night: 21500, weekendPlus: 3500, size: 30, capacity: 2, beds: '1 lit King 180 cm', view: 'Vue mer & port de Cassis', floor: '2e & 3e étages', exposure: 'Plein sud · balcon 6 m²',
      badge: 'Coup de cœur', rating: 4.8, reviewsCount: 538,
      photos: [['img/hotel-superieure-1.jpg', 'Balcon privé face au port'], ['img/hotel-superieure-2.jpg', 'Lit King et rideaux de lin'], ['img/hotel-superieure-3.jpg', 'La vue depuis la chambre au coucher du soleil'], ['img/hotel-classique-3.jpg', 'Salle de bain en pierre de Cassis'], ['img/hotel-beach.jpg', 'La plage à 200 m']],
      desc: 'Réveillez-vous face à la Méditerranée. Balcon meublé, lit King, salle de bain en pierre blonde de Cassis et une lumière de plein sud du matin au soir.',
      amenities: ['wifi', 'clim', 'tv', 'coffre', 'minibar', 'nespresso', 'sdb', 'balcon', 'peignoirs', 'insonorisation'],
      perks: ['Coupe de champagne d’accueil offerte', 'Empreinte de garantie = 1 nuit, rien n’est débité', 'Late check-out 13 h offert', 'Accès spa & piscine inclus'],
      reviews: [
        { who: 'Camille D.', from: 'Paris', date: 'Septembre 2026', rating: 5, tag: 'Anniversaire', text: 'La vue depuis le balcon est exactement celle des photos. Le champagne à l’arrivée, la petite attention qui change tout.' },
        { who: 'Julien V.', from: 'Genève', date: 'Août 2026', rating: 5, tag: 'Séjour en couple', text: 'Lit énorme, salle de bain magnifique. La note au départ reprenait bien tous les extras, zéro surprise.' },
        { who: 'Anaïs L.', from: 'Nantes', date: 'Mai 2026', rating: 4.5, tag: 'Week-end', text: 'Coucher de soleil depuis le balcon, apéro les pieds sur la rambarde. Le bruit du port le matin fait partie du charme.' }
      ] },
    { id: 'suite', name: 'Suite Prestige Terrasse', short: 'Suite Prestige', tagline: '55 m² et une terrasse privée sur la mer', night: 39000, weekendPlus: 6000, size: 55, capacity: 3, beds: '1 lit King 180 cm + canapé-lit', view: 'Vue mer panoramique', floor: 'Dernier étage', exposure: 'Sud-ouest · terrasse 22 m²',
      badge: 'Signature', rating: 4.9, reviewsCount: 221,
      photos: [['img/hotel-suite-1.jpg', 'Chambre de la suite, lit King et parquet massif'], ['img/hotel-suite-2.jpg', 'Salon privé et coin bureau'], ['img/hotel-suite-3.jpg', 'Terrasse privée avec bains de soleil'], ['img/hotel-suite-4.jpg', 'Baignoire îlot face à la mer'], ['img/hotel-bar.jpg', 'Le bar du Rivage, réservé aux hôtes le soir']],
      desc: 'La plus belle adresse de la maison : un salon, une chambre, une baignoire îlot face à la mer et une terrasse de 22 m² où l’on sert le petit-déjeuner. Majordome sur demande.',
      amenities: ['wifi', 'clim', 'tv', 'coffre', 'minibar', 'nespresso', 'sdb', 'terrasse', 'peignoirs', 'baignoire', 'bureau', 'insonorisation', 'majordome'],
      perks: ['Petit-déjeuner servi en terrasse inclus', 'Transfert gare de Cassis offert', 'Empreinte de garantie = 1 nuit, rien n’est débité', 'Accès spa privatisable 1 h', 'Parking voiturier inclus'],
      reviews: [
        { who: 'Isabelle & Franck', from: 'Bordeaux', date: 'Juillet 2026', rating: 5, tag: 'Lune de miel', text: 'La terrasse au petit matin, le café servi face aux calanques… on a annulé toutes nos excursions pour rester là.' },
        { who: 'Olivier M.', from: 'Londres', date: 'Juin 2026', rating: 5, tag: 'Séjour en famille', text: 'Le canapé-lit pour notre fils, la baignoire pour nous. Le prix est élevé mais tout est parfait, du service à la literie.' },
        { who: 'Nour B.', from: 'Lyon', date: 'Avril 2026', rating: 4.5, tag: 'Anniversaire', text: 'Suite splendide, majordome discret et efficace. Un seul regret : trois nuits, c’est trop court.' }
      ] },
    { id: 'famille', name: 'Chambre Familiale Duplex', short: 'Familiale', tagline: 'Deux niveaux, quatre couchages, zéro compromis', night: 26500, weekendPlus: 4000, size: 42, capacity: 4, beds: '1 lit Queen + 2 lits simples en mezzanine', view: 'Vue jardin & pinède', floor: 'Rez-de-jardin duplex', exposure: 'Ouest · terrasse de plain-pied',
      badge: 'Familles', rating: 4.6, reviewsCount: 113,
      photos: [['img/hotel-famille-1.jpg', 'Chambre parentale en rez-de-jardin'], ['img/hotel-famille-2.jpg', 'Mezzanine des enfants avec deux lits simples'], ['img/hotel-famille-3.jpg', 'Espace de vie lumineux'], ['img/hotel-pool.jpg', 'La piscine extérieure chauffée'], ['img/hotel-breakfast.jpg', 'Le buffet du petit-déjeuner']],
      desc: 'Un duplex pensé pour les tribus : chambre parentale au calme en bas, mezzanine des enfants en haut, terrasse de plain-pied sur le jardin et la piscine à dix mètres.',
      amenities: ['wifi', 'clim', 'tv', 'coffre', 'minibar', 'nespresso', 'sdb', 'terrasse', 'kit-bebe', 'jeux', 'insonorisation'],
      perks: ['Enfants de moins de 12 ans : petit-déjeuner offert', 'Lit bébé et chauffe-biberon sur demande', 'Empreinte de garantie = 1 nuit, rien n’est débité', 'Kit plage prêté (parasol, jeux)'],
      reviews: [
        { who: 'Famille Girard', from: 'Toulouse', date: 'Août 2026', rating: 5, tag: 'Séjour en famille', text: 'Enfin une chambre familiale où les parents dorment vraiment. La mezzanine a été le terrain de jeu de la semaine.' },
        { who: 'Sofia A.', from: 'Milan', date: 'Juillet 2026', rating: 4, tag: 'Séjour en famille', text: 'Très bien équipée, piscine à côté. Un peu de bruit des enfants voisins en journée, normal pour un duplex famille.' },
        { who: 'Rémi T.', from: 'Grenoble', date: 'Juin 2026', rating: 4.5, tag: 'Vacances', text: 'Petit-déjeuner des enfants offert, kit plage prêté : on a senti que les familles sont vraiment attendues ici.' }
      ] }
  ],
  amenityLabels: { wifi: ['📶', 'Wi-Fi fibre gratuit'], clim: ['❄️', 'Climatisation réversible'], tv: ['📺', 'TV 55" & Chromecast'], coffre: ['🔐', 'Coffre-fort'], minibar: ['🍾', 'Minibar garni'], nespresso: ['☕', 'Machine Nespresso'], sdb: ['🚿', 'Douche à l’italienne'], balcon: ['🌅', 'Balcon meublé'], terrasse: ['🏝️', 'Terrasse privée'], peignoirs: ['🧖', 'Peignoirs & chaussons'], baignoire: ['🛁', 'Baignoire îlot'], bureau: ['💻', 'Espace bureau'], insonorisation: ['🔇', 'Insonorisation renforcée'], majordome: ['🎩', 'Service majordome'], 'kit-bebe': ['🍼', 'Kit bébé'], jeux: ['🧸', 'Jeux & livres enfants'] },
  options: [
    { id: 'bfast', ico: '🥐', name: 'Petit-déjeuner buffet', desc: 'Servi de 7 h à 10 h 30, produits locaux', price: 2200, per: 'pers./nuit' },
    { id: 'spa', ico: '💆', name: 'Accès spa & hammam', desc: 'Piscine intérieure, hammam, salle de repos', price: 4500, per: 'pers./séjour' },
    { id: 'upgrade', ico: '⬆️', name: 'Surclassement vue mer', desc: 'Selon disponibilité au check-in', price: 6000, per: 'nuit' },
    { id: 'parking', ico: '🚗', name: 'Parking voiturier', desc: 'Prise en charge devant l’hôtel', price: 2500, per: 'nuit' },
    { id: 'late', ico: '🕑', name: 'Late check-out 15 h', desc: 'Profitez de la piscine jusqu’au dernier moment', price: 4000, per: 'séjour' }
  ],
  services: [
    { ico: '🏊', name: 'Piscine chauffée', desc: 'Extérieure, 28 °C d’avril à octobre', img: 'img/hotel-pool.jpg' },
    { ico: '🍽️', name: 'Restaurant La Calanque', desc: 'Cuisine de la mer, 1 toque Gault&Millau', img: 'img/hotel-restaurant.jpg' },
    { ico: '🍸', name: 'Bar du Rivage', desc: 'Cocktails au coucher du soleil', img: 'img/hotel-bar.jpg' },
    { ico: '🧖', name: 'Spa & hammam', desc: 'Soins signatures en partenariat avec Spa Émeraude', img: 'img/hotel-spa.jpg' },
    { ico: '🥐', name: 'Petit-déjeuner', desc: 'Buffet de producteurs, vue sur le port', img: 'img/hotel-breakfast.jpg' },
    { ico: '🅿️', name: 'Voiturier', desc: 'Parking privé 24 h/24', img: 'img/hotel-parking.jpg' }
  ],
  // Note « au départ » simulée pour l'onglet « Régler la note »
  folio: [
    ['Hébergement — 2 nuits', 43000], ['Taxe de séjour (2 pers. × 2 nuits)', 1000], ['Petit-déjeuner × 4', 8800], ['Bar — 2 cocktails signature', 3200], ['Room service — plateau fromages', 2400]
  ]
};
