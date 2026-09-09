/* Données de l'univers Gestion locative — Bellecour Gestion (Lyon), SPI Gestion Locative. Montants en centimes. */
(function () {
  var now = new Date(); var Y = now.getFullYear(), M = now.getMonth(); // mois courant
  function ym(offset) { var d = new Date(Y, M + offset, 1); return d.getFullYear() + '-' + (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1); }
  function label(offset) { var d = new Date(Y, M + offset, 1); var s = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }); return s.charAt(0).toUpperCase() + s.slice(1); }
  var RENT = 89000, CHARGES = 12500;
  var schedule = [];
  for (var i = -8; i <= 3; i++) {
    var status = i < 0 ? 'paid' : i === 0 ? 'due' : 'upcoming';
    if (i === -3) status = 'late-paid';
    schedule.push({ ym: ym(i), label: label(i), rent: RENT, charges: CHARGES, total: RENT + CHARGES, status: status, paidAt: i < 0 ? ym(i) + (i === -3 ? '-14' : '-05') : null, method: i < 0 ? (i % 2 ? 'Prélèvement SEPA' : 'Carte bancaire') : null, ref: 'Q-' + ym(i).replace('-', '') + '-012' });
  }
  window.DATA_GL = {
    agency: { name: 'Bellecour Gestion', address: '18 place Bellecour, 69002 Lyon', phone: '04 72 00 00 00', manager: { name: 'Sophie Marchand', role: 'Gestionnaire de votre bail', photo: 'img/gl-gestionnaire.jpg', email: 's.marchand@bellecour-gestion.fr', hours: 'Lun–Ven 9h–18h' } },
    tenant: { name: 'Charles Vidal', since: '2025-01-01', ref: 'LOC-2025-0412' },
    lease: { ref: 'BAIL-2026-012', type: 'Bail d’habitation vide · 3 ans', start: '2025-01-01', end: '2027-12-31', rent: RENT, charges: CHARGES, deposit: 89000, depositStatus: 'Pré-autorisé · gelé', paymentDay: 5, indexation: 'IRL T3 · +3,26 % au 01/01/2026', insurance: 'Attestation MRH valide jusqu’au 31/12/2026', mandate: null },
    property: { name: 'Appartement T3 — 12 rue des Lilas', address: '12 rue des Lilas, 69006 Lyon', floor: '3e étage avec ascenseur', size: 75, rooms: 3, bedrooms: 2, dpe: 'C', built: '1998', heating: 'Individuel gaz', parking: 'Box n° 14 en sous-sol', extras: ['Balcon 6 m²', 'Cave 8 m²', 'Cuisine équipée', 'Double vitrage', 'Fibre'],
      photos: [['img/gl-appart-1.jpg', 'Séjour lumineux, parquet chêne'], ['img/gl-appart-2.jpg', 'Cuisine équipée ouverte'], ['img/gl-appart-3.jpg', 'Chambre principale'], ['img/gl-appart-4.jpg', 'La résidence, façade sur rue']] },
    schedule: schedule,
    documents: [
      { name: 'Contrat de bail signé', meta: 'PDF · 1,2 Mo · 20/12/2024', type: 'PDF' },
      { name: 'État des lieux d’entrée', meta: 'PDF · 4,8 Mo · 01/01/2025 · 42 photos', type: 'PDF' },
      { name: 'Attestation d’assurance habitation', meta: 'PDF · 240 Ko · valable jusqu’au 31/12/2026', type: 'PDF' },
      { name: 'Diagnostic de performance énergétique (C)', meta: 'PDF · 860 Ko · 12/11/2024', type: 'DPE' },
      { name: 'Avis d’indexation du loyer (IRL)', meta: 'PDF · 120 Ko · 15/12/2025', type: 'PDF' },
      { name: 'Règlement de copropriété (extrait)', meta: 'PDF · 3,1 Mo', type: 'PDF' },
      { name: 'Mandat de prélèvement SEPA', meta: 'À signer · généré après enregistrement du moyen de paiement', type: 'SEPA' }
    ],
    tickets: [
      { title: 'Fuite robinet cuisine', status: 'Résolu', date: '12/06/2026', by: 'Plombier Durand' },
      { title: 'Remplacement interphone', status: 'En cours', date: '28/08/2026', by: 'Syndic — devis validé' }
    ],
    listings: [
      { id: 'maison-ecully', name: 'Maison 4 pièces — Écully', meta: '110 m² · jardin 300 m² · garage', rent: 145000, charges: 8000, deposit: 145000, dpe: 'D', img: 'img/immo-maison.jpg', avail: 'Disponible le 1er novembre', tags: ['Jardin', 'Garage', 'Calme'] },
      { id: 't2-villeurbanne', name: 'T2 lumineux — Villeurbanne Gratte-Ciel', meta: '44 m² · balcon · 5e étage', rent: 69000, charges: 6000, deposit: 69000, dpe: 'C', img: 'img/immo-t2.jpg', avail: 'Disponible immédiatement', tags: ['Balcon', 'Métro A', 'Ascenseur'] },
      { id: 'studio-presquile', name: 'Studio meublé — Presqu’île', meta: '26 m² · meublé · 2e étage', rent: 59000, charges: 5000, deposit: 118000, dpe: 'C', img: 'img/immo-studio.jpg', avail: 'Disponible le 15 octobre', tags: ['Meublé', 'Hyper-centre', 'Étudiants'] }
    ]
  };
})();
