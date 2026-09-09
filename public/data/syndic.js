/* Données de l'univers Syndic — Résidence Le Parc (Lyon 3e), Cabinet Vernet & Associés, SPI Syndic. Montants en centimes. */
(function () {
  var Y = new Date().getFullYear(), Q = Math.floor(new Date().getMonth() / 3) + 1;
  function qLabel(y, q) { return 'T' + q + ' ' + y; }
  var calls = [];
  for (var i = -5; i <= 2; i++) {
    var q = ((Q - 1 + i) % 4 + 4) % 4 + 1, y = Y + Math.floor((Q - 1 + i) / 4);
    calls.push({ id: 'AC-' + y + '-T' + q, label: qLabel(y, q), amount: 61250, status: i < 0 ? 'paid' : i === 0 ? 'due' : 'upcoming', due: y + '-' + (String((q - 1) * 3 + 1).padStart(2, '0')) + '-01', method: i < 0 ? 'Prélèvement SEPA' : null, kind: 'Charges courantes' });
  }
  window.DATA_SYN = {
    copro: { name: 'Résidence Le Parc', address: '24 avenue Lacassagne, 69003 Lyon', lots: 48, buildings: 'Bâtiments A & B · 1996', tantiemes: 10000, syndic: 'Cabinet Vernet & Associés', manager: { name: 'Julien Vernet', role: 'Gestionnaire de copropriété', photo: 'img/syn-gestionnaire.jpg', phone: '04 78 00 00 00', email: 'j.vernet@vernet-syndic.fr' },
      photos: [['img/syn-residence-1.jpg', 'La résidence côté avenue'], ['img/syn-residence-2.jpg', 'Le jardin intérieur'], ['img/syn-hall.jpg', 'Hall du bâtiment A rénové en 2025'], ['img/syn-ascenseur.jpg', 'Ascenseurs remplacés en 2024']] },
    owner: { name: 'Charles Vidal', lot: 'Lot 12 — Bât. A, 3e étage, T3 + cave 12 + parking 27', shares: 412, type: 'Propriétaire occupant', since: '2019' },
    budget: { year: Y, total: 14870000, // budget prévisionnel annuel
      lines: [['Entretien parties communes & ménage', 2860000], ['Ascenseurs (contrat + électricité)', 1420000], ['Chauffage collectif & eau chaude', 4380000], ['Eau froide', 1120000], ['Assurance multirisque immeuble', 890000], ['Honoraires du syndic', 1260000], ['Espaces verts', 640000], ['Électricité communs & interphone', 520000], ['Fonds travaux (loi ALUR, 5 %)', 740000], ['Divers & imprévus', 1040000]] },
    calls: calls,
    works: [
      { id: 'W-ravalement', name: 'Ravalement de la façade sud', desc: 'Voté en AG du 12/03 — 3 appels de fonds', total: 18600000, share: 766000, calls: [{ label: 'Appel n° 1 (30 %)', amount: 229800, status: 'paid' }, { label: 'Appel n° 2 (40 %)', amount: 306400, status: 'due', due: Y + '-10-15' }, { label: 'Appel n° 3 (30 %)', amount: 229800, status: 'upcoming', due: Y + 1 + '-02-15' }], img: 'img/syn-travaux.jpg', progress: 35, contractor: 'Façades Rhône SAS' },
      { id: 'W-toiture', name: 'Réfection de l’étanchéité de toiture', desc: 'Voté en AG du 12/03 — appel unique', total: 4200000, share: 173000, calls: [{ label: 'Appel unique', amount: 173000, status: 'due', due: Y + '-11-01' }], img: 'img/syn-toiture.jpg', progress: 0, contractor: 'Toitures Lyonnaises' }
    ],
    ag: [
      { date: Y + '-03-12', title: 'Assemblée générale ordinaire ' + Y, status: 'PV disponible', items: ['Approbation des comptes ' + (Y - 1), 'Budget prévisionnel ' + Y + ' : 148 700 €', 'Ravalement façade sud : voté (majorité art. 25)', 'Étanchéité toiture : votée', 'Renouvellement du mandat du syndic : 3 ans'] },
      { date: (Y - 1) + '-03-14', title: 'Assemblée générale ordinaire ' + (Y - 1), status: 'PV disponible', items: ['Approbation des comptes', 'Remplacement des ascenseurs : voté', 'Rénovation du hall A : votée'] },
      { date: Y + 1 + '-03-10', title: 'Assemblée générale ordinaire ' + (Y + 1), status: 'Convocation à venir', items: ['Ordre du jour ouvert jusqu’au 15/01 : proposez vos questions'] }
    ],
    documents: [
      { name: 'Procès-verbal AG du 12/03/' + Y, meta: 'PDF · 640 Ko', type: 'PV' },
      { name: 'Budget prévisionnel ' + Y, meta: 'PDF · 210 Ko', type: 'PDF' },
      { name: 'Comptes annuels ' + (Y - 1) + ' approuvés', meta: 'PDF · 1,1 Mo', type: 'PDF' },
      { name: 'Règlement de copropriété', meta: 'PDF · 6,2 Mo · 1996 (modif. 2012)', type: 'PDF' },
      { name: 'Carnet d’entretien de l’immeuble', meta: 'PDF · 2,4 Mo · mis à jour 06/' + Y, type: 'PDF' },
      { name: 'Contrat d’assurance multirisque', meta: 'PDF · 480 Ko', type: 'PDF' },
      { name: 'Devis ravalement — Façades Rhône', meta: 'PDF · 820 Ko', type: 'DEVIS' },
      { name: 'Fiche synthétique de la copropriété', meta: 'PDF · 160 Ko', type: 'PDF' }
    ],
    history: [
      ['15/06/' + Y, 'Appel de charges T2 ' + Y, 61250, 'Prélèvement SEPA'], ['20/04/' + Y, 'Ravalement — appel n° 1', 229800, 'Carte bancaire'], ['15/03/' + Y, 'Appel de charges T1 ' + Y, 61250, 'Prélèvement SEPA'],
      ['15/12/' + (Y - 1), 'Appel de charges T4 ' + (Y - 1), 59800, 'Prélèvement SEPA'], ['15/09/' + (Y - 1), 'Appel de charges T3 ' + (Y - 1), 59800, 'Prélèvement SEPA'], ['02/07/' + (Y - 1), 'Régularisation charges ' + (Y - 2), 14200, 'Carte bancaire']
    ]
  };
})();
