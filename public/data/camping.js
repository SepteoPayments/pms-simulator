/* Données de l'univers Camping — Camping Les Flots Bleus ★★★★ (Mimizan, Landes), logiciel eSeason. Montants en centimes. */
window.DATA_CAMP = {
  camp: { name: 'Camping Les Flots Bleus', stars: 4, city: 'Mimizan-Plage', address: 'Avenue de l’Océan, 40200 Mimizan', rating: 4.6, reviews: 2870, open: 'Ouvert du 5 avril au 28 septembre', pms: 'eSeason · Resalys' },
  depositRate: 0.30,
  taxeSejour: 66, // par adulte et par nuit
  stays: [
    { id: 'mobil', type: 'Mobil-home', name: 'Mobil-home Premium Océan', tagline: '3 chambres, terrasse couverte, à 300 m de la plage', night: 12900, highPlus: 6900, size: 34, terrace: 18, capacity: 6, bedrooms: 3, badge: 'Le plus demandé', rating: 4.7, reviewsCount: 634, zone: 'Zone Océan · allée des Pins', pitchSize: '120 m² · ombragé',
      photos: [['img/camp-mobil-1.jpg', 'Le mobil-home Premium, vu de l’allée des Pins'], ['img/camp-mobil-2.jpg', 'L’intérieur : banquettes, table et cuisine'], ['img/camp-mobil-3.jpg', 'La terrasse en bois, salon de jardin et plancha'], ['img/camp-plage.jpg', 'La plage à 300 m par le chemin des dunes']],
      desc: 'Un mobil-home récent (2024) de 34 m² avec trois vraies chambres, une salle d’eau et des WC séparés, climatisation et TV. La terrasse semi-couverte de 18 m² avec plancha est le vrai salon de l’été. Emplacement ombragé sous les pins, zone calme côté océan.',
      amenities: ['clim', 'tv', 'cuisine', 'lave-vaisselle', 'plancha', 'terrasse', 'sdb', 'wc', 'draps', 'parking', 'wifi', 'coffre'],
      perks: ['Draps et serviettes inclus', 'Kit bébé gratuit sur demande', 'Accès illimité à l’espace aquatique', 'Animaux acceptés (1, en laisse)'],
      reviews: [
        { who: 'Famille Roux', from: 'Toulouse', date: 'Août 2026', rating: 5, text: 'Le mobil-home est nickel, la terrasse immense, et les enfants ont vécu au toboggan. Acompte à la résa, solde en avril : simple.' },
        { who: 'Kevin & Laura', from: 'Nantes', date: 'Juillet 2026', rating: 4.5, text: 'Emplacement bien ombragé, on entend l’océan le soir. La clim, indispensable en juillet.' },
        { who: 'Marta S.', from: 'Bilbao', date: 'Juin 2026', rating: 4.5, text: 'Muy bien equipado. La plancha en la terraza, perfecto. Tout le paiement en ligne, rien à faire à l’arrivée.' }
      ] },
    { id: 'cottage', type: 'Cottage', name: 'Cottage Bois « Les Landes »', tagline: 'Chalet en bois, poêle et grande terrasse plein sud', night: 15900, highPlus: 7900, size: 40, terrace: 25, capacity: 6, bedrooms: 3, badge: 'Nouveau 2026', rating: 4.8, reviewsCount: 127, zone: 'Zone Forêt · clairière des Chênes', pitchSize: '150 m² · plein sud',
      photos: [['img/camp-cottage-1.jpg', 'Le cottage en bois au cœur de la forêt'], ['img/camp-cottage-2.jpg', 'Chambre parentale en bois clair'], ['img/camp-cottage-3.jpg', 'Le cottage à la tombée de la nuit'], ['img/camp-velo.jpg', 'Piste cyclable au départ du camping']],
      desc: 'Nos cottages en bois massif ont ouvert en 2026 dans la clairière des Chênes. 40 m² tout confort : trois chambres, deux salles d’eau, cuisine ouverte, lave-vaisselle, et une terrasse plein sud de 25 m² avec bain nordique en option.',
      amenities: ['clim', 'tv', 'cuisine', 'lave-vaisselle', 'plancha', 'terrasse', 'sdb2', 'wc', 'draps', 'parking', 'wifi', 'coffre', 'poele'],
      perks: ['Bain nordique privatif en option', 'Ménage de fin de séjour inclus', 'Vélos (4) prêtés pour la durée du séjour', 'Corbeille de bienvenue landaise'],
      reviews: [
        { who: 'Les Petit', from: 'Bordeaux', date: 'Juillet 2026', rating: 5, text: 'Le cottage sent encore le bois neuf. Le bain nordique le soir sous les pins, inoubliable.' },
        { who: 'Anne-Laure D.', from: 'Paris', date: 'Juin 2026', rating: 4.5, text: 'Très haut de gamme pour un camping. Les vélos prêtés, parfait pour rejoindre la plage par la forêt.' }
      ] },
    { id: 'lodge', type: 'Tente lodge', name: 'Lodge Toile & Bois « Safari »', tagline: 'Le glamping : lits vrais, cuisine, et le ciel étoilé', night: 9900, highPlus: 4900, size: 35, terrace: 12, capacity: 5, bedrooms: 2, badge: 'Glamping', rating: 4.5, reviewsCount: 298, zone: 'Zone Dunes · sentier des Écureuils', pitchSize: '130 m² · semi-ombragé',
      photos: [['img/camp-lodge-1.jpg', 'Le lodge safari sur pilotis'], ['img/camp-lodge-2.jpg', 'Chambre avec vrai lit 160'], ['img/camp-lodge-3.jpg', 'Feu de camp partagé le soir'], ['img/camp-yoga.jpg', 'Yoga au lever du soleil sur la plage']],
      desc: 'Une tente lodge sur plancher bois, deux chambres avec de vrais lits, une cuisine équipée sur la terrasse et un coin repas. Sans électricité dans les chambres (lampes solaires) mais avec frigo et plaques. L’expérience camping, le confort en plus. Sanitaires privatifs à 20 m.',
      amenities: ['cuisine', 'terrasse', 'draps', 'parking', 'frigo', 'lampes', 'bbq'],
      perks: ['Feu de camp partagé chaque soir', 'Sanitaires premium à 20 m', 'Petit-déjeuner livré en option', 'Zone sans voiture'],
      reviews: [
        { who: 'Chloé & Max', from: 'Lyon', date: 'Août 2026', rating: 5, text: 'Dormir sous la toile en entendant les pins, avec un vrai lit… magique. Et les enfants ont adoré le feu de camp.' },
        { who: 'Rodrigo P.', from: 'Porto', date: 'Juillet 2026', rating: 4, text: 'Great glamping. Hot in the afternoon, plan for the beach. Payment split in two, very convenient.' }
      ] },
    { id: 'emplacement', type: 'Emplacement', name: 'Emplacement Grand Confort', tagline: 'Pour votre tente, caravane ou camping-car, avec eau et électricité', night: 3900, highPlus: 1900, size: 120, terrace: 0, capacity: 6, bedrooms: 0, badge: 'Nature', rating: 4.4, reviewsCount: 812, zone: 'Zones Forêt & Océan', pitchSize: '110 à 140 m² · délimité par haies',
      photos: [['img/camp-empl-1.jpg', 'Emplacement délimité sous les pins'], ['img/camp-empl-2.jpg', 'Emplacement camping-car avec borne'], ['img/camp-kids.jpg', 'Aire de jeux à deux pas'], ['img/camp-resto.jpg', 'Le snack de la plage']],
      desc: 'Des emplacements de 110 à 140 m² délimités par des haies, avec branchement électrique 10 A, point d’eau et évacuation. Sanitaires chauffés avec cabines familiales et espace bébé. Choisissez votre emplacement sur le plan.',
      amenities: ['elec', 'eau', 'parking', 'wifi', 'sanitaires'],
      perks: ['Choix de l’emplacement sur plan', 'Sanitaires chauffés rénovés en 2025', 'Location de frigo possible', 'Prix par nuit pour 2 pers. + emplacement'],
      reviews: [
        { who: 'Gérard & Monique', from: 'Angers', date: 'Septembre 2026', rating: 4.5, text: 'Emplacement 142, ombre parfaite l’après-midi. Sanitaires impeccables. On a choisi notre place sur le plan, très pratique.' },
        { who: 'Jonas F.', from: 'Berlin', date: 'Août 2026', rating: 4, text: 'Nice pitches, good showers. Busy in August but the beach is huge.' }
      ] }
  ],
  amenityLabels: { clim: ['❄️', 'Climatisation'], tv: ['📺', 'TV'], cuisine: ['🍳', 'Cuisine équipée'], 'lave-vaisselle': ['🍽️', 'Lave-vaisselle'], plancha: ['🔥', 'Plancha'], terrasse: ['🪵', 'Terrasse bois'], sdb: ['🚿', 'Salle d’eau'], sdb2: ['🚿', '2 salles d’eau'], wc: ['🚽', 'WC séparés'], draps: ['🛏️', 'Draps & serviettes'], parking: ['🚗', 'Parking à l’emplacement'], wifi: ['📶', 'Wi-Fi'], coffre: ['🔐', 'Coffre-fort'], poele: ['🔥', 'Poêle à bois'], frigo: ['🧊', 'Réfrigérateur'], lampes: ['🔦', 'Lampes solaires'], bbq: ['🍖', 'Barbecue'], elec: ['⚡', 'Électricité 10 A'], eau: ['💧', 'Eau & évacuation'], sanitaires: ['🚿', 'Sanitaires chauffés'] },
  activities: [
    { id: 'aqua', name: 'Espace aquatique', ico: '🌊', desc: 'Piscine chauffée, toboggans, pataugeoire, lagune. Inclus dans le séjour.', price: 0, per: '', img: 'img/camp-piscine.jpg', cat: 'Sur place' },
    { id: 'kayak', name: 'Sortie kayak sur le courant', ico: '🛶', desc: 'Descente encadrée du courant de Mimizan, 2 h, dès 8 ans.', price: 2500, per: 'pers.', img: 'img/camp-kayak.jpg', cat: 'Nature' },
    { id: 'velo', name: 'Location de vélos', ico: '🚲', desc: 'VTC adulte ou enfant, casque et antivol, pistes cyclables au départ du camping.', price: 1200, per: 'jour', img: 'img/camp-velo.jpg', cat: 'Sur place' },
    { id: 'kids', name: 'Club enfants 4-12 ans', ico: '🎨', desc: 'Matinées animées : chasse au trésor, ateliers, mini-disco.', price: 1500, per: 'semaine', img: 'img/camp-kids.jpg', cat: 'Famille' },
    { id: 'surf', name: 'Cours de surf', ico: '🏄', desc: '1 h 30 avec l’école partenaire, combinaison et planche fournies.', price: 3900, per: 'pers.', img: 'img/camp-surf.jpg', cat: 'Océan' },
    { id: 'paddle', name: 'Paddle au coucher du soleil', ico: '🌅', desc: 'Sortie encadrée sur le lac d’Aureilhan, 1 h 30.', price: 2200, per: 'pers.', img: 'img/camp-paddle.jpg', cat: 'Océan' },
    { id: 'minigolf', name: 'Mini-golf 18 trous', ico: '⛳', desc: 'Parcours ombragé, clubs et balles fournis.', price: 600, per: 'pers.', img: 'img/camp-minigolf.jpg', cat: 'Famille' },
    { id: 'yoga', name: 'Yoga sur la plage', ico: '🧘', desc: 'Séance au lever du soleil, tous niveaux, tapis fournis.', price: 1200, per: 'pers.', img: 'img/camp-yoga.jpg', cat: 'Bien-être' },
    { id: 'soiree', name: 'Soirée concert & marché nocturne', ico: '🎶', desc: 'Tous les mercredis, scène et producteurs locaux. Accès libre.', price: 0, per: '', img: 'img/camp-soiree.jpg', cat: 'Sur place' },
    { id: 'petitdej', name: 'Petit-déjeuner livré', ico: '🥐', desc: 'Pain frais, viennoiseries, jus, déposé sur votre terrasse à 8 h.', price: 900, per: 'pers./jour', img: 'img/camp-resto.jpg', cat: 'Sur place' }
  ],
  options: [
    { id: 'menage', ico: '🧹', name: 'Ménage de fin de séjour', desc: 'On s’occupe de tout, partez tranquilles', price: 7500, per: 'séjour' },
    { id: 'bain', ico: '♨️', name: 'Bain nordique privatif', desc: 'Cottage uniquement, chauffé chaque soir', price: 3500, per: 'nuit' },
    { id: 'frigo', ico: '🧊', name: 'Location de frigo', desc: 'Pour les emplacements nus', price: 500, per: 'nuit' },
    { id: 'animal', ico: '🐕', name: 'Animal de compagnie', desc: 'Carnet de vaccination à présenter', price: 500, per: 'nuit' },
    { id: 'late', ico: '🕑', name: 'Départ tardif 17 h', desc: 'Selon disponibilité', price: 3000, per: 'séjour' }
  ],
  // plan du camping : zones et emplacements (x, y en % du plan)
  zones: [
    { id: 'ocean', name: 'Zone Océan', color: '#7fc4d9', x: 6, y: 8, w: 40, h: 36 },
    { id: 'foret', name: 'Zone Forêt', color: '#9fcf9a', x: 52, y: 8, w: 42, h: 42 },
    { id: 'dunes', name: 'Zone Dunes', color: '#f2d59a', x: 6, y: 50, w: 40, h: 36 }
  ],
  pois: [['🏊', 'Espace aquatique', 50, 62], ['🍔', 'Snack & épicerie', 62, 80], ['🎪', 'Scène & bar', 78, 68], ['🚿', 'Sanitaires', 30, 46], ['🚿', 'Sanitaires', 72, 30], ['🎨', 'Club enfants', 88, 84], ['🛟', 'Accueil', 50, 94], ['🏖️', 'Plage → 300 m', 8, 3]]
};
