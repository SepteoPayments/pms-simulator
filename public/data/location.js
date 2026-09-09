/* Données de l'univers Location saisonnière — Maisons du Littoral (conciergerie, Resalys). Montants en centimes. */
window.DATA_LOC = {
  agency: { name: 'Maisons du Littoral', city: 'La Rochelle', rating: 4.85, reviews: 3120, host: { name: 'Camille Berthier', role: 'Responsable conciergerie', photo: 'img/tr-agent.jpg', since: '2018', response: 'répond en moins d’une heure' } },
  depositRate: 0.30, // acompte
  properties: [
    { id: 'villa', type: 'Villa', name: 'Villa Les Embruns', where: 'Le Bois-Plage-en-Ré · Île de Ré', region: 'Atlantique', coords: [44, 62], badge: 'Piscine chauffée', rating: 4.9, reviewsCount: 148, superhost: true,
      night: 32000, highSeasonPlus: 12000, cleaning: 18000, deposit: 150000, minNights: 3, guests: 8, bedrooms: 4, beds: 5, baths: 3, size: 180,
      photos: [['img/loc-villa-1.jpg', 'La piscine chauffée et sa plage en bois'], ['img/loc-villa-2.jpg', 'Le jardin fleuri et la terrasse'], ['img/loc-villa-3.jpg', 'La villa côté piscine'], ['img/loc-villa-4.jpg', 'Cuisine ouverte tout équipée'], ['img/loc-villa-5.jpg', 'Chambre parentale'], ['img/loc-hero.jpg', 'Les dunes à 400 m']],
      tagline: 'Une maison rétaise, une piscine, huit couchages et la plage à pied',
      desc: 'Villa rétaise typique aux volets verts, entièrement rénovée en 2024. Grand salon cathédrale ouvert sur la terrasse et la piscine chauffée (mai à septembre), cuisine d’été, quatre chambres dont deux suites parentales. La plage des Gollandières est à 6 minutes à pied par le chemin des dunes, le marché du Bois à vélo.',
      amenities: ['wifi', 'piscine', 'clim', 'cuisine', 'lave-vaisselle', 'lave-linge', 'bbq', 'parking', 'velos', 'tv', 'jardin', 'terrasse', 'linge', 'bebe'],
      rules: ['Arrivée 16h – 20h · Départ avant 10h', 'Non fumeur (terrasse OK)', 'Pas de fête ni d’événement', 'Animaux acceptés sur demande (1 chien max)', 'Piscine non surveillée : enfants sous responsabilité des parents'],
      pois: [['Plage des Gollandières', '6 min à pied', 30, 78], ['Marché du Bois-Plage', '5 min à vélo', 60, 40], ['Boulangerie', '3 min à pied', 52, 70], ['Location de vélos', '4 min à pied', 38, 45]],
      reviews: [
        { who: 'Famille Lemaire', from: 'Paris', date: 'Août 2026', rating: 5, text: 'La villa est encore plus belle qu’en photo. Piscine parfaite pour les enfants, plage à pied. La caution a été libérée deux jours après notre départ, sans rien demander.' },
        { who: 'Ingrid & Sven', from: 'Hambourg', date: 'Juillet 2026', rating: 5, text: 'Wunderbar. Équipement complet, vélos fournis, conciergerie réactive. Le paiement en trois temps (acompte, solde, caution) est très rassurant.' },
        { who: 'Pauline R.', from: 'Bordeaux', date: 'Juin 2026', rating: 4.5, text: 'Séjour entre amis mémorable. La cuisine d’été est le vrai cœur de la maison. Ménage un peu cher mais impeccable.' }
      ] },
    { id: 'mer', type: 'Appartement', name: 'Appartement Vue Océan', where: 'Les Minimes · La Rochelle', region: 'Atlantique', coords: [40, 55], badge: 'Vue mer', rating: 4.8, reviewsCount: 212, superhost: true,
      night: 14500, highSeasonPlus: 5000, cleaning: 7000, deposit: 60000, minNights: 2, guests: 4, bedrooms: 2, beds: 2, baths: 1, size: 62,
      photos: [['img/loc-mer-1.jpg', 'La vue sur l’océan depuis la résidence'], ['img/loc-mer-2.jpg', 'Balcon face au port des Minimes'], ['img/loc-mer-3.jpg', 'Chambre lumineuse'], ['img/loc-mer-4.jpg', 'Cuisine équipée'], ['img/loc-mer-5.jpg', 'La promenade du front de mer']],
      tagline: 'Un balcon sur le plus grand port de plaisance d’Europe',
      desc: 'Au 4e étage avec ascenseur d’une résidence récente, cet appartement de 62 m² s’ouvre sur un balcon filant face à l’océan et au port des Minimes. Deux chambres, cuisine équipée, parking privé. La plage est en bas, le Vieux-Port à 15 minutes en bus de mer.',
      amenities: ['wifi', 'clim', 'cuisine', 'lave-vaisselle', 'lave-linge', 'parking', 'tv', 'balcon', 'ascenseur', 'linge'],
      rules: ['Arrivée 15h – 19h · Départ avant 11h', 'Non fumeur', 'Pas d’animaux', 'Calme après 22h (résidence)'],
      pois: [['Plage des Minimes', '2 min à pied', 30, 80], ['Bus de mer → Vieux-Port', '5 min à pied', 65, 60], ['Aquarium', '12 min à vélo', 70, 25], ['Supermarché', '4 min à pied', 20, 40]],
      reviews: [
        { who: 'Antoine V.', from: 'Nantes', date: 'Septembre 2026', rating: 5, text: 'La vue au réveil… Café sur le balcon en regardant les voiliers sortir. Appartement très propre et très bien équipé.' },
        { who: 'Manon & Lucas', from: 'Lyon', date: 'Juillet 2026', rating: 4.5, text: 'Parfait pour un week-end à deux. La caution pré-autorisée plutôt qu’un chèque, ça change la vie.' },
        { who: 'Mireille D.', from: 'Poitiers', date: 'Mai 2026', rating: 5, text: 'Emplacement idéal, parking privé bien pratique, literie excellente. Je reviens en octobre.' }
      ] },
    { id: 'montagne', type: 'Chalet', name: 'Chalet des Cimes', where: 'Les Praz · Chamonix-Mont-Blanc', region: 'Alpes', coords: [78, 48], badge: 'Jacuzzi extérieur', rating: 4.9, reviewsCount: 96, superhost: false,
      night: 42000, highSeasonPlus: 18000, cleaning: 22000, deposit: 200000, minNights: 4, guests: 10, bedrooms: 5, beds: 7, baths: 4, size: 220,
      photos: [['img/loc-montagne-1.jpg', 'Le chalet sous la neige'], ['img/loc-montagne-2.jpg', 'Salon cathédrale tout en vieux bois'], ['img/loc-montagne-3.jpg', 'La cheminée centrale'], ['img/loc-montagne-4.jpg', 'Vue sur le massif du Mont-Blanc'], ['img/loc-montagne-5.jpg', 'Le chalet au cœur de la forêt, sauna et jacuzzi à l’arrière']],
      tagline: 'Vieux bois, cheminée, jacuzzi sous les étoiles et le Mont-Blanc en face',
      desc: 'Chalet savoyard de 220 m² en vieux bois, rénové avec des matériaux nobles. Salon cathédrale avec cheminée, cuisine de chef, cinq chambres, sauna et jacuzzi extérieur face au massif du Mont-Blanc. Navette gratuite pour les remontées de la Flégère à 200 m.',
      amenities: ['wifi', 'cheminee', 'sauna', 'jacuzzi', 'cuisine', 'lave-vaisselle', 'lave-linge', 'parking', 'tv', 'skiroom', 'terrasse', 'linge', 'bebe'],
      rules: ['Arrivée 17h – 20h · Départ avant 10h', 'Non fumeur', 'Pas de fête', 'Animaux non admis', 'Chaussures de ski interdites à l’étage (ski-room au rez-de-chaussée)'],
      pois: [['Télécabine de la Flégère', '3 min à pied', 62, 30], ['Centre de Chamonix', '8 min en navette', 25, 65], ['Boulangerie des Praz', '4 min à pied', 45, 72], ['Golf de Chamonix', '5 min à pied', 80, 70]],
      reviews: [
        { who: 'The Whitakers', from: 'Londres', date: 'Février 2026', rating: 5, text: 'The best chalet we have rented in ten years of Chamonix trips. Hot tub with that view, unforgettable. Flawless payment process.' },
        { who: 'Groupe Delcourt', from: 'Lille', date: 'Janvier 2026', rating: 5, text: 'Dix amis, cinq chambres, tout le monde a eu sa salle de bain. Le ski-room chauffé, un détail qui compte à 7h du matin.' },
        { who: 'Sabine M.', from: 'Genève', date: 'Août 2026', rating: 4.5, text: 'Magnifique aussi en été. Randonnées au départ du chalet. Le solde prélevé automatiquement à J-30, aucune relance à gérer.' }
      ] },
    { id: 'ville', type: 'Loft', name: 'Loft du Vieux-Lyon', where: 'Saint-Jean · Lyon 5e', region: 'Ville', coords: [62, 42], badge: 'Cœur historique', rating: 4.7, reviewsCount: 331, superhost: true,
      night: 16500, highSeasonPlus: 3000, cleaning: 6000, deposit: 50000, minNights: 2, guests: 4, bedrooms: 1, beds: 2, baths: 1, size: 70,
      photos: [['img/loc-ville-1.jpg', 'Le loft, poutres et pierres dorées'], ['img/loc-ville-2.jpg', 'Vue sur les toits du Vieux-Lyon'], ['img/loc-ville-3.jpg', 'Balcon sur la cour Renaissance'], ['img/loc-ville-4.jpg', 'Salle de bain design'], ['img/loc-ville-5.jpg', 'Les traboules à la porte']],
      tagline: 'Un loft Renaissance dans une traboule, à 3 minutes de la cathédrale',
      desc: 'Au dernier étage d’un immeuble Renaissance classé, ce loft de 70 m² mêle poutres d’époque, pierres dorées et design contemporain. Chambre en mezzanine, canapé-lit dans le séjour, cuisine ouverte et balcon sur la cour intérieure. Idéal pour un week-end gastronomique ou une semaine de télétravail.',
      amenities: ['wifi', 'clim', 'cuisine', 'lave-vaisselle', 'lave-linge', 'tv', 'bureau', 'balcon', 'linge', 'cafe'],
      rules: ['Arrivée 15h – 21h · Départ avant 11h (boîte à clés)', 'Non fumeur', 'Pas de fête', 'Immeuble classé : pas d’ascenseur (4e étage)'],
      pois: [['Cathédrale Saint-Jean', '3 min à pied', 45, 70], ['Bouchons de la rue Saint-Jean', '1 min à pied', 55, 55], ['Funiculaire de Fourvière', '4 min à pied', 30, 30], ['Métro Vieux-Lyon', '3 min à pied', 70, 60]],
      reviews: [
        { who: 'Elena G.', from: 'Madrid', date: 'Septembre 2026', rating: 5, text: 'Un rêve d’appartement. Les poutres, la lumière, la cour. Et les bouchons en bas pour le dîner.' },
        { who: 'Julien P.', from: 'Paris', date: 'Juin 2026', rating: 4.5, text: 'Semaine de télétravail parfaite, fibre rapide, bureau confortable. Quatre étages sans ascenseur, prévoir les mollets.' },
        { who: 'Aurélie T.', from: 'Nantes', date: 'Mars 2026', rating: 4.5, text: 'Charme fou. Les 30 % d’acompte puis le solde, tout est clair dès la réservation, aucune surprise.' }
      ] }
  ],
  amenityLabels: { wifi: ['📶', 'Wi-Fi fibre'], piscine: ['🏊', 'Piscine chauffée privée'], clim: ['❄️', 'Climatisation'], cuisine: ['🍳', 'Cuisine équipée'], 'lave-vaisselle': ['🍽️', 'Lave-vaisselle'], 'lave-linge': ['🧺', 'Lave-linge & sèche-linge'], bbq: ['🔥', 'Barbecue / plancha'], parking: ['🚗', 'Parking privé'], velos: ['🚲', 'Vélos fournis (6)'], tv: ['📺', 'TV & Netflix'], jardin: ['🌳', 'Jardin clos 1 200 m²'], terrasse: ['🪴', 'Terrasse meublée'], linge: ['🛏️', 'Linge de maison fourni'], bebe: ['🍼', 'Équipement bébé'], balcon: ['🌅', 'Balcon'], ascenseur: ['🛗', 'Ascenseur'], cheminee: ['🪵', 'Cheminée (bois fourni)'], sauna: ['🧖', 'Sauna'], jacuzzi: ['♨️', 'Jacuzzi extérieur'], skiroom: ['🎿', 'Ski-room chauffé'], bureau: ['💻', 'Espace bureau'], cafe: ['☕', 'Machine à café & thé'] },
  options: [
    { id: 'linge', ico: '🛏️', name: 'Pack linge & serviettes', desc: 'Lits faits à l’arrivée, serviettes de bain et de plage', price: 2500, per: 'pers.' },
    { id: 'menage', ico: '🧹', name: 'Ménage de mi-séjour', desc: 'Pour les séjours de 7 nuits et plus', price: 9000, per: 'séjour' },
    { id: 'bebe', ico: '🍼', name: 'Kit bébé complet', desc: 'Lit parapluie, chaise haute, baignoire', price: 3000, per: 'séjour' },
    { id: 'panier', ico: '🧺', name: 'Panier de bienvenue', desc: 'Produits locaux, vin, pain frais le 1er matin', price: 4500, per: 'séjour' },
    { id: 'late', ico: '🕑', name: 'Départ tardif 14h', desc: 'Selon disponibilité', price: 5000, per: 'séjour' }
  ]
};
