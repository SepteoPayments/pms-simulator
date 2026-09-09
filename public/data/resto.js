/* Données de l'univers Restauration — Brasserie du Vieux-Port (Marseille), POS Ulyses. Montants en centimes. */
window.DATA_RST = {
  resto: { name: 'Brasserie du Vieux-Port', address: '32 quai du Port, 13002 Marseille', phone: '04 91 00 00 00', rating: 4.6, reviews: 1980, chef: { name: 'Chef Antoine Ferrandi', role: 'Chef de cuisine · ex-Petit Nice', photo: 'img/rst-chef.jpg', bio: 'Marseillais pur jus, Antoine cuisine le poisson du jour acheté sur le quai à 6 h. Bouillabaisse à la charte, panisses maison, tropézienne de sa grand-mère.' },
    hours: 'Midi 12h – 14h30 · Soir 19h – 22h30 · Fermé le lundi', groupDeposit: 50000, groupMin: 8 },
  categories: [
    { id: 'entrees', name: 'Entrées', sub: 'À partager ou pas' },
    { id: 'mer', name: 'De la mer', sub: 'Poissons du quai, pêche du jour' },
    { id: 'terre', name: 'De la terre', sub: 'Viandes maturées et pâtes fraîches' },
    { id: 'desserts', name: 'Desserts', sub: 'Faits maison, évidemment' },
    { id: 'boissons', name: 'Cave & bar', sub: 'Vins de Provence, cocktails du port' }
  ],
  dishes: [
    { id: 'huitres', cat: 'entrees', name: 'Huîtres de Camargue n° 3 (×6)', price: 1600, img: 'img/rst-huitres.jpg', desc: 'Fines de claire de l’étang de Thau, citron, échalote au vinaigre de Banyuls, pain de seigle beurré.', tags: ['Iodé', 'Sans gluten*'], allergens: ['Mollusques', 'Gluten (pain)'], origin: 'Étang de Thau (34)', pairing: 'Picpoul de Pinet, domaine Félines-Jourdan', time: 5, kcal: 180, spicy: 0, popular: true,
      story: 'Nos huîtres arrivent chaque matin de l’étang de Thau, à 2 h de route. Nous les ouvrons à la commande, jamais avant.' },
    { id: 'panisse', cat: 'entrees', name: 'Panisses maison, aïoli', price: 900, img: 'img/rst-panisse.jpg', desc: 'Frites de farine de pois chiche, croustillantes dehors, fondantes dedans. Aïoli monté à la main.', tags: ['Végétarien', 'Signature'], allergens: ['Œuf (aïoli)'], origin: 'Farine de pois chiche de l’Estaque', pairing: 'Rosé de Provence, Château Léoube', time: 10, kcal: 320, spicy: 0, popular: true,
      story: 'La panisse, c’est l’Estaque, le dimanche, le cornet en papier. Les nôtres sont coupées épaisses et frites deux fois.' },
    { id: 'poulpe', cat: 'entrees', name: 'Poulpe grillé, pommes de terre écrasées', price: 1500, img: 'img/rst-poulpe.jpg', desc: 'Tentacule de poulpe confit puis grillé, écrasé de pommes de terre à l’huile d’olive, citron confit, paprika fumé.', tags: ['Grillé'], allergens: ['Mollusques'], origin: 'Poulpe de Méditerranée', pairing: 'Cassis blanc, Clos Sainte-Magdeleine', time: 12, kcal: 290, spicy: 1, popular: false,
      story: 'Confit 3 heures à basse température, puis saisi à la plancha pour le croustillant. Le paprika fumé, c’est la touche du chef.' },
    { id: 'nicoise', cat: 'entrees', name: 'Salade niçoise, thon mi-cuit', price: 1400, img: 'img/rst-nicoise.jpg', desc: 'Thon rouge mi-cuit, tomates anciennes, œuf mollet, anchois de Collioure, olives de Nyons, fèves, basilic.', tags: ['Frais', 'Sans gluten'], allergens: ['Poisson', 'Œuf'], origin: 'Thon de ligne de Méditerranée', pairing: 'Bandol rosé, Domaine Tempier', time: 8, kcal: 410, spicy: 0, popular: false,
      story: 'Pas de pommes de terre ni de haricots verts, les Niçois y tiennent. Le thon est juste snacké, cœur cru.' },
    { id: 'bouilla', cat: 'mer', name: 'Bouillabaisse du chef (charte)', price: 4200, img: 'img/rst-bouillabaisse.jpg', desc: 'Rascasse, saint-pierre, vive, galinette, congre. Soupe servie d’abord avec croûtons frottés à l’ail et rouille, poissons ensuite. Pour 2 minimum.', tags: ['Signature', 'Charte de la bouillabaisse', 'Pour 2 min.'], allergens: ['Poisson', 'Crustacés', 'Gluten (croûtons)', 'Œuf (rouille)'], origin: 'Pêche du jour, quai des Belges', pairing: 'Cassis blanc, Domaine du Paternel', time: 25, kcal: 620, spicy: 1, popular: true,
      story: 'Nous sommes signataires de la Charte de la bouillabaisse marseillaise (1980) : au moins quatre poissons de roche, servis en deux temps, découpés devant vous.' },
    { id: 'loup', cat: 'mer', name: 'Loup de Méditerranée grillé entier', price: 3400, img: 'img/rst-loup.jpg', desc: 'Loup de ligne grillé au fenouil sauvage, légumes de saison rôtis, huile d’olive de la vallée des Baux.', tags: ['Grillé', 'Sans gluten'], allergens: ['Poisson'], origin: 'Loup de ligne, criée de Marseille', pairing: 'Palette blanc, Château Simone', time: 20, kcal: 480, spicy: 0, popular: false,
      story: 'Pêché à la ligne la nuit, sur le grill à midi. Le fenouil sauvage vient des calanques, ramassé par le second.' },
    { id: 'soupe', cat: 'mer', name: 'Soupe de poissons de roche, rouille', price: 1600, img: 'img/rst-soupe.jpg', desc: 'La soupe de la bouillabaisse, seule : croûtons, rouille safranée, gruyère râpé. Le classique du quai.', tags: ['Classique'], allergens: ['Poisson', 'Gluten', 'Œuf', 'Lait'], origin: 'Poissons de roche de Méditerranée', pairing: 'Côtes-de-Provence rosé', time: 8, kcal: 380, spicy: 1, popular: true,
      story: 'Mijotée 4 heures avec les petits poissons de roche invendables autrement : la vraie cuisine du port.' },
    { id: 'linguine', cat: 'mer', name: 'Linguine aux palourdes & poutargue', price: 2600, img: 'img/rst-linguine.jpg', desc: 'Linguine fraîches, palourdes de l’étang, ail, piment, persil, poutargue de Martigues râpée minute.', tags: ['Pâtes fraîches'], allergens: ['Gluten', 'Mollusques', 'Poisson', 'Œuf'], origin: 'Poutargue de Martigues', pairing: 'Vermentino de Corse, Clos Canarelli', time: 15, kcal: 640, spicy: 2, popular: false,
      story: 'La poutargue, ces œufs de mulet séchés de Martigues, c’est le caviar provençal. Râpée à la dernière seconde.' },
    { id: 'entrecote', cat: 'terre', name: 'Entrecôte maturée 30 jours, frites', price: 2900, img: 'img/rst-entrecote.jpg', desc: 'Bœuf Aubrac maturé 30 jours, 350 g, beurre maître d’hôtel ou sauce au poivre, frites maison à la graisse de bœuf.', tags: ['Maturé', 'Sans gluten'], allergens: ['Lait (beurre)'], origin: 'Aubrac, maison Metzger', pairing: 'Bandol rouge, Château Pradeaux', time: 18, kcal: 890, spicy: 0, popular: true,
      story: 'Trente jours en cave de maturation pour un goût de noisette. Cuisson demandée respectée, promis.' },
    { id: 'tartare', cat: 'terre', name: 'Tartare de bœuf au couteau', price: 2300, img: 'img/rst-tartare.jpg', desc: 'Cœur de rumsteck coupé au couteau, câpres, cornichons, échalote, jaune d’œuf, frites maison. Préparé ou à préparer.', tags: ['Cru', 'Sans gluten'], allergens: ['Œuf', 'Moutarde'], origin: 'Bœuf Aubrac', pairing: 'Coteaux-d’Aix rouge, Château Revelette', time: 10, kcal: 720, spicy: 1, popular: false,
      story: 'Coupé au couteau à la commande, jamais haché. Demandez-le « à préparer » pour le faire vous-même à table.' },
    { id: 'risotto', cat: 'terre', name: 'Risotto aux artichauts violets & parmesan', price: 2100, img: 'img/rst-risotto.jpg', desc: 'Carnaroli, artichauts violets de Provence, parmesan 24 mois, huile de basilic. Végétarien.', tags: ['Végétarien', 'Sans gluten'], allergens: ['Lait'], origin: 'Artichauts de Hyères', pairing: 'Cassis blanc', time: 22, kcal: 560, spicy: 0, popular: false,
      story: 'Le seul plat sans poisson ni viande de la carte, et l’un des plus commandés. L’artichaut violet, c’est le printemps de Hyères.' },
    { id: 'tropez', cat: 'desserts', name: 'Tarte tropézienne', price: 1000, img: 'img/rst-tropezienne.jpg', desc: 'Brioche au sucre perlé, crème mousseline vanille et fleur d’oranger. La recette de la grand-mère du chef.', tags: ['Signature', 'Maison'], allergens: ['Gluten', 'Lait', 'Œuf'], origin: 'Recette familiale, Saint-Tropez', pairing: 'Muscat de Beaumes-de-Venise', time: 5, kcal: 480, spicy: 0, popular: true,
      story: 'La grand-mère d’Antoine tenait une boulangerie à Saint-Tropez. La recette n’a pas bougé depuis 1962.' },
    { id: 'brulee', cat: 'desserts', name: 'Crème brûlée à la lavande', price: 900, img: 'img/rst-brulee.jpg', desc: 'Crème infusée à la lavande de Valensole, caramélisée minute à la cassonade.', tags: ['Maison', 'Sans gluten'], allergens: ['Lait', 'Œuf'], origin: 'Lavande de Valensole', pairing: 'Café ou muscat', time: 5, kcal: 390, spicy: 0, popular: false,
      story: 'Une pointe de lavande seulement, pour ne pas manger un savon. Caramélisée devant vous.' },
    { id: 'tiramisu', cat: 'desserts', name: 'Tiramisu au café du port', price: 900, img: 'img/rst-tiramisu.jpg', desc: 'Mascarpone, biscuits imbibés de café torréfié par la Brûlerie du Port, cacao.', tags: ['Maison'], allergens: ['Gluten', 'Lait', 'Œuf'], origin: 'Café Brûlerie du Port, Marseille', pairing: 'Limoncello maison', time: 5, kcal: 450, spicy: 0, popular: false,
      story: 'Le café vient de la brûlerie d’en face, torréfié le matin même.' },
    { id: 'fromages', cat: 'desserts', name: 'Chèvres de Provence affinés', price: 1100, img: 'img/rst-fromages.jpg', desc: 'Banon, brousse du Rove, picodon. Miel de garrigue, pain aux noix.', tags: ['Fermier'], allergens: ['Lait', 'Gluten', 'Fruits à coque'], origin: 'Chèvreries des Alpilles', pairing: 'Bandol rouge', time: 5, kcal: 420, spicy: 0, popular: false,
      story: 'La brousse du Rove, AOP depuis 2018, vient d’un troupeau de chèvres du Rove qui pâturent sur la Côte Bleue.' },
    { id: 'cafe', cat: 'desserts', name: 'Café gourmand', price: 950, img: 'img/rst-cafe.jpg', desc: 'Espresso et trois mignardises du jour : mini-tropézienne, financier, mousse chocolat.', tags: ['Maison'], allergens: ['Gluten', 'Lait', 'Œuf', 'Fruits à coque'], origin: 'Brûlerie du Port', pairing: '—', time: 5, kcal: 380, spicy: 0, popular: true,
      story: 'Pour ceux qui n’arrivent pas à choisir. C’est-à-dire tout le monde.' },
    { id: 'rose', cat: 'boissons', name: 'Côtes-de-Provence rosé, Château Léoube (75 cl)', price: 3600, img: 'img/rst-rose.jpg', desc: 'Rosé pâle, agrumes et pêche blanche, domaine bio de la presqu’île de Giens.', tags: ['Bio', 'Bouteille'], allergens: ['Sulfites'], origin: 'La Londe-les-Maures (83)', pairing: 'Toute la carte', time: 2, kcal: 0, spicy: 0, popular: true,
      story: 'Le rosé de la maison, servi à 10 °C. Aussi au verre (7 €).' },
    { id: 'cocktail', cat: 'boissons', name: 'Spritz du Port', price: 1100, img: 'img/rst-cocktail.jpg', desc: 'Apéritif maison : vermouth de Marseille, tonic, orange sanguine, romarin.', tags: ['Cocktail', 'Signature'], allergens: [], origin: 'Vermouth La Quintinye, Marseille', pairing: 'Panisses', time: 4, kcal: 180, spicy: 0, popular: true,
      story: 'Notre réponse marseillaise au spritz vénitien : un vermouth local et une branche de romarin des calanques.' },
    { id: 'biere', cat: 'boissons', name: 'Bière de la Plaine blonde (33 cl)', price: 650, img: 'img/rst-biere.jpg', desc: 'Brasserie artisanale marseillaise, blonde légère et citronnée.', tags: ['Artisanal', 'Local'], allergens: ['Gluten'], origin: 'Brasserie de la Plaine, Marseille', pairing: 'Huîtres, panisses', time: 2, kcal: 140, spicy: 0, popular: false,
      story: 'Brassée à la Plaine, à 15 minutes à pied. La pression change chaque mois.' },
    { id: 'eau', cat: 'boissons', name: 'Eau minérale gazeuse (1 l)', price: 550, img: 'img/rst-eau.jpg', desc: 'Eau gazeuse de source, servie fraîche.', tags: [], allergens: [], origin: 'Source des Alpes', pairing: '—', time: 1, kcal: 0, spicy: 0, popular: false, story: '' }
  ],
  // plan de salle : zones et tables (id, places, forme), disponibilité par service
  room: [
    { zone: 'Terrasse · vue Vieux-Port', tables: [['T1', 2, 'round'], ['T2', 2, 'round'], ['T3', 4, 'sq'], ['T4', 4, 'sq'], ['T5', 6, 'rect'], ['T6', 8, 'rect']] },
    { zone: 'Salle · banquettes', tables: [['S1', 2, 'sq'], ['S2', 2, 'sq'], ['S3', 4, 'sq'], ['S4', 4, 'sq'], ['S5', 4, 'sq'], ['S6', 6, 'rect']] },
    { zone: 'Salon privé · groupes', tables: [['P1', 10, 'rect'], ['P2', 12, 'rect']] }
  ],
  reviews: [
    { who: 'Bastien L.', date: 'Août 2026', rating: 5, text: 'La bouillabaisse la plus honnête du port. Addition réglée sur mon téléphone en sortant, sans attendre le serveur.' },
    { who: 'Emma & Théo', date: 'Juillet 2026', rating: 4.5, text: 'Terrasse au coucher du soleil, spritz du port, poulpe grillé parfait. La tropézienne, à tomber.' },
    { who: 'Comité d’entreprise Alto', date: 'Juin 2026', rating: 5, text: 'Salon privé pour 24 personnes. Empreinte de garantie plutôt qu’un acompte, libérée le soir même : très pro.' }
  ]
};
