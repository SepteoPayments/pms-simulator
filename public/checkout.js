/*
 * Parcours de paiement brandé, partagé par tous les univers :
 *   récap commande  →  formulaire client (+ personas Charles/Juliette)  →  Drop-in Adyen brandé  →  redirection confirmation.
 * Piloté par window.THEMES + <body data-theme-key>. Les infos client (shopper) et les champs métier (metadata)
 * sont collectés et stockés dans la réservation (cf. artifact « Data Travel ») ; ici on les affiche en confirmation
 * (l'API publique les ignore tant que le contrat shopper/metadata n'est pas livré).
 * API : PMS.checkout({ amount, currency, mode, itemLabel, summary:[[label,val],...], prefill:{champ:valeur} }) + boutons [data-checkout].
 *
 * ⚠ Mécanique de paiement (fetch /api/pay, AdyenCheckout + create('dropin').mount, sessionStorage + redirection) inchangée.
 *   Le corps /api/pay porte en plus shopperCountryCode (pays du payeur) : c'est lui qui pilote les moyens proposés
 *   par le Drop-in (ex. Bancontact n'apparaît qu'en BE). Le reste de l'habillage (formulaire, personas, bandeau) enrichi.
 */
(function () {
  var T = window.THEMES || [];
  var key = (document.body.dataset && document.body.dataset.themeKey) || '';
  var theme = T.filter(function (t) { return t.key === key; })[0] || { name: 'Paiement', accent: '#14324f', emoji: '💳', product: 'Septeo Payments' };
  var euros = (window.PMS && PMS.euros) || function (m, c) { return ((m || 0) / 100).toFixed(2) + ' ' + (c || 'EUR'); };

  // ---- personas de démo (remplissage 1 clic) ----
  var PERSONAS = {
    charles: { label: 'Charles', avatar: '👨🏻‍💼', segment: 'Affaires · 41 ans · Lyon', firstName: 'Charles', lastName: 'Vidal', email: 'charles.vidal@example.fr', phone: '+33612345678', dob: '1985-04-12', street: '10 rue des Lilas', postalCode: '69006', city: 'Lyon' },
    juliette: { label: 'Juliette', avatar: '👩🏽', segment: 'Loisir · 33 ans · Lyon', firstName: 'Juliette', lastName: 'Moreau', email: 'juliette.moreau@example.fr', phone: '+33698765432', dob: '1992-09-27', street: '5 place Bellecour', postalCode: '69002', city: 'Lyon' }
  };
  // valeurs métier propres à chaque persona (par univers) — rendent la démo crédible et segmentable
  var PERSONA_EXTRA = {
    hotel: { charles: { purpose: 'Affaires', loyalty: 'Gold', arrival: '18h – 20h', requests: 'Chambre calme, étage élevé' }, juliette: { purpose: 'Loisir', loyalty: 'Aucun', arrival: '15h – 18h', requests: 'Lit king, oreillers fermes' } },
    camping: { charles: { pets: 'Non', vehicle: 'AB-123-CD', children: '2', acsi: 'Non' }, juliette: { pets: 'Oui (1 chien)', vehicle: 'EF-456-GH', children: '0', acsi: 'Oui' } },
    spa: { charles: { health: 'Aucune', gift: 'Pour moi', time: '18h30' }, juliette: { health: 'Grossesse', gift: 'Pour moi', time: '11h00' } },
    location: { charles: { purpose: 'Télétravail', arrival: '17h – 19h', linen: 'Oui' }, juliette: { purpose: 'Vacances', arrival: '15h – 17h', linen: 'Non' } },
    gestion: { charles: { tenantType: 'Locataire', paymentDay: 'Le 5 du mois', iban: 'FR76 3000 6000 0112 3456 7890 189' }, juliette: { tenantType: 'Colocataire', paymentDay: 'Le 1er du mois', iban: 'FR76 1027 8060 4000 0203 4567 891' } },
    syndic: { charles: { ownerType: 'Propriétaire occupant', paymentDay: 'Le 5 du mois', iban: 'FR76 3000 6000 0112 3456 7890 189' }, juliette: { ownerType: 'Propriétaire bailleur', paymentDay: 'Le 10 du mois', iban: 'FR76 1027 8060 4000 0203 4567 891' } },
    transaction: { charles: { buyerType: 'Particulier', financing: 'Prêt bancaire (80 %)', coBuyer: 'Aucun' }, juliette: { buyerType: 'SCI familiale', financing: 'Comptant', coBuyer: 'Thomas Moreau' } },
    resto: { charles: { occasion: 'Repas d’affaires', allergies: 'Aucune' }, juliette: { occasion: 'Anniversaire', allergies: 'Fruits à coque' } }
  };

  var COMMON = [
    { name: 'firstName', label: 'Prénom', req: true }, { name: 'lastName', label: 'Nom', req: true },
    { name: 'email', label: 'E-mail', type: 'email', req: true }, { name: 'phone', label: 'Téléphone', type: 'tel' },
    { name: 'dob', label: 'Date de naissance', type: 'date' },
    { name: 'street', label: 'Adresse', wide: true },
    { name: 'postalCode', label: 'Code postal' }, { name: 'city', label: 'Ville' },
    // Pays du payeur → shopperCountryCode : pilote les moyens proposés par le Drop-in.
    // FR = cartes/SEPA/Klarna ; BE = Bancontact ; etc. (Adyen n'affiche un moyen national que pour son pays).
    { name: 'country', label: 'Pays du payeur', type: 'select', options: ['FR', 'BE', 'DE', 'NL', 'ES', 'IT', 'PT'] }
  ];
  // ---- champs métier par univers (metadata) ----
  var FIELDS = {
    hotel: [
      { name: 'room', label: 'Chambre', val: 'Supérieure Vue Mer' },
      { name: 'checkIn', label: 'Arrivée', type: 'date' }, { name: 'checkOut', label: 'Départ', type: 'date' },
      { name: 'guests', label: 'Voyageurs', type: 'number', val: '2' },
      { name: 'purpose', label: 'Motif du séjour', type: 'select', options: ['Loisir', 'Affaires', 'Événement', 'Lune de miel'] },
      { name: 'arrival', label: 'Heure d’arrivée', type: 'select', options: ['15h – 18h', '18h – 20h', 'Après 20h'] },
      { name: 'loyalty', label: 'Programme fidélité', type: 'select', options: ['Aucun', 'Silver', 'Gold', 'Platinum'] },
      { name: 'requests', label: 'Demandes spéciales', wide: true, val: '' }
    ],
    camping: [
      { name: 'stay', label: 'Hébergement', val: 'Mobil-home Premium' },
      { name: 'checkIn', label: 'Arrivée', type: 'date' }, { name: 'nights', label: 'Nuits', type: 'number', val: '7' },
      { name: 'adults', label: 'Adultes', type: 'number', val: '2' }, { name: 'children', label: 'Enfants (-12 ans)', type: 'number', val: '2' },
      { name: 'pets', label: 'Animaux', type: 'select', options: ['Non', 'Oui (1 chien)', 'Oui (2 animaux)'] },
      { name: 'vehicle', label: 'Immatriculation', val: '' },
      { name: 'acsi', label: 'Carte ACSI / ANWB', type: 'select', options: ['Non', 'Oui'] }
    ],
    spa: [
      { name: 'treatment', label: 'Soin', val: 'Massage signature 60 min' },
      { name: 'slot', label: 'Date souhaitée', type: 'date' },
      { name: 'time', label: 'Heure', type: 'select', options: ['10h00', '11h00', '14h00', '15h30', '17h00', '18h30'] },
      { name: 'practitioner', label: 'Praticien(ne)', type: 'select', options: ['Sans préférence', 'Léa Fontaine', 'Karim Bensaïd', 'Maëlle Roux', 'Inès Carvalho'] },
      { name: 'health', label: 'Contre-indications', type: 'select', options: ['Aucune', 'Grossesse', 'Problèmes circulatoires', 'Allergies (huiles)'] },
      { name: 'gift', label: 'Destinataire', type: 'select', options: ['Pour moi', 'Bon cadeau (offrir)'] }
    ],
    location: [
      { name: 'property', label: 'Logement', val: 'Villa Les Embruns' },
      { name: 'checkIn', label: 'Arrivée', type: 'date' }, { name: 'checkOut', label: 'Départ', type: 'date' },
      { name: 'guests', label: 'Voyageurs', type: 'number', val: '4' },
      { name: 'purpose', label: 'Motif', type: 'select', options: ['Vacances', 'Télétravail', 'Événement familial'] },
      { name: 'arrival', label: 'Heure d’arrivée', type: 'select', options: ['15h – 17h', '17h – 19h', 'Après 19h (boîte à clés)'] },
      { name: 'linen', label: 'Linge de maison', type: 'select', options: ['Oui', 'Non'] }
    ],
    gestion: [
      { name: 'leaseRef', label: 'Référence bail', val: 'BAIL-2026-012' },
      { name: 'property', label: 'Logement', val: 'T3 — 12 rue des Lilas, Lyon 6e' },
      { name: 'period', label: 'Période', type: 'month', val: '' },
      { name: 'tenantType', label: 'Qualité', type: 'select', options: ['Locataire', 'Colocataire', 'Garant'] },
      { name: 'paymentDay', label: 'Jour de prélèvement', type: 'select', options: ['Le 1er du mois', 'Le 5 du mois', 'Le 10 du mois'] },
      { name: 'iban', label: 'IBAN (mandat SEPA)', wide: true, val: '' }
    ],
    syndic: [
      { name: 'lotRef', label: 'Lot', val: 'Lot 12 — Bât. A, 3e étage' },
      { name: 'coproRef', label: 'Copropriété', val: 'Résidence Le Parc — Lyon 3e' },
      { name: 'period', label: 'Échéance', val: 'T4 2026' },
      { name: 'ownerType', label: 'Qualité', type: 'select', options: ['Propriétaire occupant', 'Propriétaire bailleur', 'Usufruitier'] },
      { name: 'shares', label: 'Tantièmes', type: 'number', val: '412' },
      { name: 'paymentDay', label: 'Jour de prélèvement', type: 'select', options: ['Le 1er du mois', 'Le 5 du mois', 'Le 10 du mois'] },
      { name: 'iban', label: 'IBAN (mandat SEPA)', wide: true, val: '' }
    ],
    transaction: [
      { name: 'propertyRef', label: 'Référence mandat', val: 'MAND-2026-045' },
      { name: 'notaryRef', label: 'Étude notariale', val: 'Me Dubois & Associés — Lyon' },
      { name: 'buyerType', label: 'Acquéreur', type: 'select', options: ['Particulier', 'Couple / indivision', 'SCI familiale'] },
      { name: 'financing', label: 'Financement', type: 'select', options: ['Prêt bancaire (80 %)', 'Prêt bancaire (100 %)', 'Comptant'] },
      { name: 'coBuyer', label: 'Co-acquéreur', val: '' },
      { name: 'signingDate', label: 'Signature du compromis', type: 'date' }
    ],
    resto: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'service', label: 'Service', type: 'select', options: ['Midi', 'Soir'] },
      { name: 'time', label: 'Heure', type: 'select', options: ['12h00', '12h30', '13h00', '19h30', '20h00', '20h30', '21h00'] },
      { name: 'covers', label: 'Couverts', type: 'number', val: '2' },
      { name: 'table', label: 'Table', val: '' },
      { name: 'occasion', label: 'Occasion', type: 'select', options: ['Sans occasion', 'Anniversaire', 'Repas d’affaires', 'Fête de famille'] },
      { name: 'allergies', label: 'Allergies / régimes', wide: true, val: '' }
    ]
  };
  var NOUN = { hotel: 'Réservation', camping: 'Réservation', spa: 'Réservation', location: 'Réservation', gestion: 'Paiement', syndic: 'Paiement', transaction: 'Versement', resto: 'Réservation' };
  var MODE_LABEL = { immediate: ['Paiement immédiat', 'Le montant est capturé tout de suite.'], caution: ['Empreinte de garantie', 'Pré-autorisation : rien n’est débité, le montant est gelé puis capturé ou libéré.'], mandate: ['Mandat de prélèvement', 'Le moyen de paiement est enregistré pour les échéances à venir (paiement initial de référence).'] };

  var PBS_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 78" role="img" aria-label="Payments by Septeo" class="pbs-logo"><g fill="#ef6a44"><path d="M18 14 L30 14 L14 58 L2 58 Z"/><path d="M36 14 L48 14 L32 58 L20 58 Z"/><path d="M54 14 L66 14 L50 58 L38 58 Z"/></g><text x="78" y="55" font-family="\'Trebuchet MS\',\'Segoe UI\',Verdana,sans-serif" font-size="46" font-weight="700" letter-spacing="-1" fill="currentColor">payments</text><text x="284" y="70" font-family="\'Trebuchet MS\',\'Segoe UI\',Verdana,sans-serif" font-size="15" font-weight="600" fill="currentColor" opacity=".85">by <tspan font-weight="800" fill="#ef6a44" opacity="1">SEPTEO</tspan></text></svg>';

  // ---- overlay ----
  var ov = document.createElement('div');
  ov.className = 'overlay co-overlay';
  ov.innerHTML =
    '<div class="modal co-modal">' +
      '<div class="co-brand" style="--accent:' + theme.accent + '"><span class="co-logo">' + (theme.emoji || '💳') + '</span>' +
        '<span><b>' + (theme.brand || theme.name) + '</b><small>' + (theme.product || '') + '</small></span>' +
        '<span class="co-pbs"><span class="pbs-txt">propulsé par</span>' + PBS_SVG + '</span>' +
        '<button class="close co-close" type="button" aria-label="Fermer">✕</button></div>' +
      '<ol class="co-steps"><li class="on" data-s="1"><b>1</b> Récapitulatif</li><li data-s="2"><b>2</b> Vos informations</li><li data-s="3"><b>3</b> Paiement sécurisé</li></ol>' +
      '<div class="co-body"></div>' +
    '</div>';
  document.body.appendChild(ov);
  var bodyEl = ov.querySelector('.co-body');
  var closeBtn = ov.querySelector('.co-close');
  var curDropin = null;
  function setStep(n) { ov.querySelectorAll('.co-steps li').forEach(function (li) { var s = Number(li.getAttribute('data-s')); li.classList.toggle('on', s === n); li.classList.toggle('done', s < n); }); }
  function close() { ov.classList.remove('show'); if (curDropin && curDropin.unmount) { try { curDropin.unmount(); } catch (e) {} } curDropin = null; bodyEl.innerHTML = ''; }
  closeBtn.onclick = close;
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function open(opts) {
    opts = opts || {};
    var amount = Number(opts.amount) || 0, currency = opts.currency || 'EUR';
    var mode = opts.mode || 'immediate';
    var itemLabel = opts.itemLabel || 'Paiement';
    var summary = opts.summary || [];
    var prefill = opts.prefill || {};
    var extra = FIELDS[key] || [];
    var ml = MODE_LABEL[mode] || MODE_LABEL.immediate;

    function field(f) {
      var id = 'co-' + f.name;
      var val = prefill[f.name] != null ? prefill[f.name] : (f.val || '');
      var lbl = '<label for="' + id + '">' + esc(f.label) + (f.req ? ' <i>*</i>' : '') + '</label>';
      var inp;
      if (f.type === 'select') {
        var opts2 = (f.options || []).slice(); if (val && opts2.indexOf(val) < 0) opts2.unshift(val);
        inp = '<select id="' + id + '" data-f="' + f.name + '">' + opts2.map(function (o) { return '<option' + (o === val ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>';
      } else {
        inp = '<input id="' + id + '" data-f="' + f.name + '" type="' + (f.type || 'text') + '" value="' + esc(val) + '"' + (f.type === 'number' ? ' min="0"' : '') + '>';
      }
      return '<div class="co-field' + (f.wide ? ' wide' : '') + '">' + lbl + inp + '</div>';
    }

    setStep(2);
    bodyEl.innerHTML =
      '<div class="co-summary"><div class="co-sum-head"><span>' + esc(itemLabel) + '</span><span class="co-amt">' + euros(amount, currency) + '</span></div>' +
        '<div class="co-mode"><span class="co-mode-dot"></span><b>' + ml[0] + '</b> — ' + ml[1] + '</div>' +
        (summary.length ? '<ul class="co-sum-list">' + summary.map(function (s) { return '<li><span>' + esc(s[0]) + '</span><span>' + esc(s[1]) + '</span></li>'; }).join('') + '</ul>' : '') +
      '</div>' +
      '<div class="co-personas"><span class="co-hint">Remplissage rapide (démo) :</span>' +
        Object.keys(PERSONAS).map(function (p) { var P = PERSONAS[p]; return '<button type="button" class="co-persona" data-persona="' + p + '"><span class="cp-av">' + P.avatar + '</span><span><b>' + P.label + ' ' + P.lastName + '</b><small>' + P.segment + '</small></span></button>'; }).join('') + '</div>' +
      '<form class="co-form" novalidate>' +
        '<div class="co-sub">Vos informations</div>' +
        '<div class="co-grid">' + COMMON.map(field).join('') + '</div>' +
        (extra.length ? '<div class="co-sub">Détails ' + esc((NOUN[key] || 'Paiement').toLowerCase()) + ' <span class="co-sub-hint">· données métier transmises avec le paiement</span></div><div class="co-grid">' + extra.map(field).join('') + '</div>' : '') +
        (mode === 'mandate' ?
          '<div class="co-sub">Mandat de prélèvement <span class="co-sub-hint">· consentement transmis à la session (#2793)</span></div>' +
          '<div class="co-consent">' +
            '<div class="co-field"><label for="co-consentMode">Consentement du client</label>' +
              '<select id="co-consentMode" data-f="consentMode">' +
                '<option value="ASK_FOR_CONSENT">Demander (case à cocher affichée dans le paiement)</option>' +
                '<option value="FORCED">Imposé (mandat métier, sans case)</option>' +
              '</select></div>' +
            '<p class="co-consent-note">ℹ️ Étape paramétrable par l’API (<code>consentMode</code>). En <b>Imposé</b> la case disparaît : vous pouvez la désactiver et gérer les mandats vous-même côté PMS (envoi, signature, archivage). Le texte du mandat SEPA reste affiché par le prestataire dans tous les cas.</p>' +
          '</div>' : '') +
        '<details class="co-travel"><summary>👁️ Aperçu des données qui voyagent avec le paiement</summary><pre class="co-json"></pre></details>' +
        '<div class="co-err" hidden></div>' +
        '<button type="submit" class="btn block co-pay" style="background:' + theme.accent + '">Procéder au paiement — ' + euros(amount, currency) + '</button>' +
        '<p class="co-legal">Démo sandbox — aucune donnée réelle. Les infos client « voyagent » avec le paiement (voir Data Travel) et alimentent les statistiques par type de client.</p>' +
      '</form>';

    ov.classList.add('show');
    ov.querySelector('.co-modal').scrollTop = 0;

    function collect() { var data = {}; bodyEl.querySelectorAll('[data-f]').forEach(function (el) { data[el.getAttribute('data-f')] = el.value.trim(); }); return data; }
    function buildPayload(data) {
      var shopper = { firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone, dateOfBirth: data.dob, billingAddress: { street: data.street, postalCode: data.postalCode, city: data.city, country: data.country || 'FR' } };
      var metadata = { vertical: key }; extra.forEach(function (f) { metadata[f.name] = data[f.name]; });
      return { shopper: shopper, metadata: metadata };
    }
    function refreshJson() {
      var pre = bodyEl.querySelector('.co-json'); if (!pre) return;
      var data = collect();
      var p = buildPayload(data);
      var preview = { amount: { value: amount, currency: currency }, mode: mode, shopper: p.shopper, metadata: p.metadata };
      if (mode === 'mandate') preview.consentMode = data.consentMode || 'ASK_FOR_CONSENT';
      pre.innerHTML = JSON.stringify(preview, null, 2)
        .replace(/"([^"]+)":/g, '<span class="k">"$1"</span>:').replace(/: "([^"]*)"/g, ': <span class="s">"$1"</span>').replace(/: (\d+)/g, ': <span class="n">$1</span>');
    }
    bodyEl.addEventListener('input', refreshJson); bodyEl.addEventListener('change', refreshJson); refreshJson();

    bodyEl.querySelectorAll('[data-persona]').forEach(function (b) {
      b.onclick = function () {
        var pk = b.getAttribute('data-persona'), p = PERSONAS[pk];
        Object.keys(p).forEach(function (k) { var el = bodyEl.querySelector('[data-f="' + k + '"]'); if (el) el.value = p[k]; });
        var ex = (PERSONA_EXTRA[key] || {})[pk] || {};
        Object.keys(ex).forEach(function (k) { var el = bodyEl.querySelector('[data-f="' + k + '"]'); if (!el) return; if (el.tagName === 'SELECT' && !Array.prototype.some.call(el.options, function (o) { return o.value === ex[k]; })) { var o = document.createElement('option'); o.textContent = ex[k]; el.appendChild(o); } el.value = ex[k]; });
        bodyEl.querySelectorAll('.co-persona').forEach(function (x) { x.classList.toggle('on', x === b); });
        refreshJson();
      };
    });

    bodyEl.querySelector('.co-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var data = collect();
      var errEl = bodyEl.querySelector('.co-err');
      if (!data.firstName || !data.lastName || !data.email) {
        errEl.hidden = false; errEl.textContent = 'Prénom, nom et e-mail sont requis.'; return;
      }
      var p = buildPayload(data);
      goPay({ amount: amount, currency: currency, mode: mode, itemLabel: itemLabel, summary: summary, shopper: p.shopper, metadata: p.metadata, shopperCountryCode: data.country || 'FR', consentMode: mode === 'mandate' ? (data.consentMode || 'ASK_FOR_CONSENT') : undefined });
    });
  }

  // ---- bandeau informatif « moyens de paiement » (détection navigateur ; Adyen reste seul maître du filtrage réel) ----
  function payMethods(mode) {
    var ua = navigator.userAgent || "";
    var apple = false; try { apple = !!(window.ApplePaySession && typeof ApplePaySession.canMakePayments === "function" && ApplePaySession.canMakePayments()); } catch (e) { apple = false; }
    var chromeLike = /Chrome|Chromium|Edg/.test(ua) && !/OPR|SamsungBrowser/.test(ua);
    var later = mode === "mandate" ? "selon votre pays et votre mandat" : "selon votre pays et votre commande";
    return [
      { id: "card", name: "Carte bancaire", sub: "Visa · Mastercard · CB", state: "ok", note: "Toujours disponible", logo: "<span class=\"pm-logo pm-visa\">VISA</span><span class=\"pm-logo pm-mc\"><i></i><i></i></span><span class=\"pm-logo pm-cb\">CB</span>" },
      { id: "applepay", name: "Apple Pay", sub: apple ? "Touch ID / Face ID" : "Safari sur Mac ou iPhone requis", state: apple ? "ok" : "off", note: apple ? "Disponible sur cet appareil" : "Indisponible ici : Safari sur Mac ou iPhone requis", logo: "<span class=\"pm-logo pm-apple\">&#63743; Pay</span>" },
      { id: "gpay", name: "Google Pay", sub: chromeLike ? "selon votre compte Google" : "Navigateur Chrome ou Edge requis", state: chromeLike ? "ok" : "off", note: chromeLike ? "Disponible sur ce navigateur, selon votre compte Google" : "Indisponible ici : Chrome ou Edge requis", logo: "<span class=\"pm-logo pm-gpay\"><b>G</b> Pay</span>" },
      { id: "sepa", name: "Prélèvement SEPA", sub: later, state: "maybe", note: "Proposé si éligible — " + later, logo: "<span class=\"pm-logo pm-sepa\">SEPA</span>" },
      { id: "klarna", name: "Klarna · paiement en plusieurs fois", sub: later, state: "maybe", note: "Proposé si éligible — " + later, logo: "<span class=\"pm-logo pm-klarna\">Klarna.</span>" },
      { id: "ancv", name: "Chèques-Vacances ANCV", sub: "selon votre commande", state: "maybe", note: "Proposé si éligible — séjours et loisirs", logo: "<span class=\"pm-logo pm-ancv\">ANCV</span>" },
      { id: "bank", name: "Virement instantané", sub: later, state: "maybe", note: "Proposé si éligible — " + later, logo: "<span class=\"pm-logo pm-bank\">&#8646;</span>" }
    ];
  }
  function payMethodsBanner(mode) {
    var list = payMethods(mode), ok = list.filter(function (m) { return m.state === "ok"; }).length;
    var LAB = { ok: "Disponible", maybe: "Si éligible", off: "Indisponible" };
    return "<div class=\"pm-band\" style=\"--accent:" + theme.accent + "\">" +
      "<div class=\"pm-head\"><span class=\"pm-ico\">&#128179;</span><div><b>Vos moyens de paiement</b><small>" + ok + " disponible" + (ok > 1 ? "s" : "") + " sur cet appareil · les autres sont proposés si éligibles</small></div></div>" +
      "<div class=\"pm-grid\">" + list.map(function (m) {
        return "<div class=\"pm " + m.state + "\" title=\"" + esc(m.note) + "\">" +
          "<span class=\"pm-state\">" + (m.state === "ok" ? "&#10003;" : m.state === "maybe" ? "&#9711;" : "&#10005;") + "</span>" +
          "<div class=\"pm-logos\">" + m.logo + "</div>" +
          "<div class=\"pm-main\"><div class=\"pm-name\">" + esc(m.name) + "</div><div class=\"pm-sub\">" + esc(m.sub) + "</div></div>" +
          "<span class=\"pm-tag\">" + LAB[m.state] + "</span></div>";
      }).join("") + "</div>" +
      "<div class=\"pm-legend\"><span class=\"l ok\">&#10003; disponible sur votre appareil</span><span class=\"l maybe\">&#9711; proposé si éligible</span><span class=\"l off\">&#10005; indisponible ici</span></div>" +
      "<p class=\"pm-foot\">Liste indicative détectée par votre navigateur : la liste définitive s’affiche ci-dessous, c’est la plateforme de paiement qui vérifie l’éligibilité.</p>" +
    "</div>";
  }

  // ---- panneau "donnees de test & conditions" (copie 1 clic) ----
  function testDataPanel() {
    var cards = [
      ['Visa', '4111 1111 1111 1111', '4111111111111111', 'exp 03/30 · CVC 737'],
      ['Mastercard', '5555 5555 5555 4444', '5555555555554444', 'exp 03/30 · CVC 737'],
      ['American Express', '3700 0000 0000 002', '370000000000002', 'exp 03/30 · CID 7373'],
      ['Bancontact (BE)', '5127 8809 9999 9990', '5127880999999990', 'exp 03/30 · CVC 737 · pays = BE']
    ];
    function copyBtn(v) { return '<button type="button" class="td-copy" data-copy="' + v + '" title="Copier">📋</button>'; }
    var rows = cards.map(function (c) {
      return '<div class="td-row"><span class="td-name">' + esc(c[0]) + '</span>' +
        '<code class="td-val">' + esc(c[1]) + '</code>' + copyBtn(c[2]) +
        '<span class="td-meta">' + esc(c[3]) + '</span></div>';
    }).join('');
    rows += '<div class="td-row"><span class="td-name">SEPA</span>' +
      '<code class="td-val">FR14 2004 1010 0505 0001 3M02 606</code>' + copyBtn('FR1420041010050500013M02606') +
      '<span class="td-meta">titulaire <b>A. Grand</b> · <b class="td-warn">&lt; 500 €</b> (au-delà = refusé)</span></div>';
    rows += '<div class="td-row"><span class="td-name">Klarna</span><span class="td-meta">pays <b>FR/DE</b> + panier (lineItems) · sandbox auto-approuvé (code OTP de test si demandé)</span></div>';
    rows += '<div class="td-row"><span class="td-name">ANCV</span><span class="td-meta">activé sur la boutique côté Adyen · <b>FR / EUR</b> — sinon invisible</span></div>';
    return '<details class="td-panel" open><summary>🧪 Données de test &amp; conditions — clique 📋 pour copier</summary>' +
      '<div class="td-list">' + rows + '</div>' +
      '<p class="td-foot">Sandbox uniquement. Un moyen n\'apparaît que selon le <b>pays du payeur</b>, la devise, les lineItems et son activation côté PSP.</p></details>';
  }

  function goPay(ctx) {
    setStep(3);
    var ml = MODE_LABEL[ctx.mode] || MODE_LABEL.immediate;
    bodyEl.innerHTML =
      '<div class="co-summary"><div class="co-sum-head"><span>' + esc(ctx.itemLabel) + '</span><span class="co-amt">' + euros(ctx.amount, ctx.currency) + '</span></div>' +
        '<div class="co-mode"><span class="co-mode-dot"></span><b>' + ml[0] + '</b></div>' +
        '<div class="co-payer">👤 ' + esc(ctx.shopper.firstName + ' ' + ctx.shopper.lastName) + ' · ' + esc(ctx.shopper.email) + (ctx.shopper.billingAddress && ctx.shopper.billingAddress.city ? ' · ' + esc(ctx.shopper.billingAddress.city) : '') + '</div></div>' +
      payMethodsBanner(ctx.mode) +
      '<div class="status show warn" id="co-status">Ouverture de la session de paiement…</div>' +
      '<div id="co-dropin"></div>' +
      '<div class="testcards">🔒 Paiement sécurisé par <b>Payments by Septeo</b> (Adyen, environnement de test).</div>' +
      testDataPanel();
    var statusEl = bodyEl.querySelector('#co-status');
    function st(k, m) { statusEl.className = 'status show ' + k; statusEl.textContent = m; }

    fetch('/api/pay', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: ctx.mode, amount: { value: ctx.amount, currency: ctx.currency }, label: ctx.itemLabel, shopperReference: 'cust-' + (ctx.shopper.email || 'demo'), shopperCountryCode: ctx.shopperCountryCode || 'FR', consentMode: ctx.consentMode })
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.d.error || 'Échec ouverture session');
        var d = res.d;
        var p; try { p = typeof d.clientSession === 'string' ? JSON.parse(d.clientSession) : d.clientSession; } catch (e) { throw new Error('clientSession illisible'); }
        if (typeof AdyenCheckout === 'undefined') throw new Error('SDK Adyen non chargé');
        statusEl.className = 'status';
        return AdyenCheckout({
          environment: d.environment, clientKey: d.clientKey, locale: 'fr-FR', session: { id: p.id, sessionData: p.sessionData },
          // Garde-fou SEPA : plafond sandbox 500 €. On bloque le submit AU MOMENT du choix du moyen
          // (le moyen n'est connu qu'ici, pas a l'ouverture de session). >= 500 € => rejet net + message.
          beforeSubmit: function (data, component, actions) {
            var type = (data && data.paymentMethod && data.paymentMethod.type) || '';
            if (/sepa/i.test(type) && ctx.amount >= 50000) {
              st('err', 'SEPA bloqué : plafond sandbox 500 € (montant ' + euros(ctx.amount, ctx.currency) + '). Passe le montant sous 500 € pour tester le prélèvement SEPA.');
              actions.reject();
              return;
            }
            actions.resolve(data);
          },
          onPaymentCompleted: function (result) {
            var reservation = {
              theme: key, themeName: theme.name, themeProduct: theme.product, emoji: theme.emoji, accent: theme.accent,
              noun: NOUN[key] || 'Paiement', itemLabel: ctx.itemLabel, amount: ctx.amount, currency: ctx.currency,
              reference: d.reference, resultCode: (result && result.resultCode) || 'Authorised',
              shopper: ctx.shopper, metadata: ctx.metadata, at: new Date().toISOString()
            };
            try { sessionStorage.setItem('pms_reservation', JSON.stringify(reservation)); } catch (e) {}
            window.location.href = 'confirmation.html';
          },
          onError: function (err) { st('err', 'Erreur Drop-in : ' + (err.message || err.name || 'inconnue')); }
        });
      })
      .then(function (checkout) { if (checkout) curDropin = checkout.create('dropin').mount('#co-dropin'); })
      .catch(function (e) { st('err', e.message || String(e)); });
  }

  // délégation : boutons [data-checkout]
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-checkout]');
    if (!b) return;
    e.preventDefault();
    var sum = [], pre = {};
    if (b.getAttribute('data-summary')) { try { sum = JSON.parse(b.getAttribute('data-summary')); } catch (x) {} }
    if (b.getAttribute('data-prefill')) { try { pre = JSON.parse(b.getAttribute('data-prefill')); } catch (x) {} }
    open({ amount: Number(b.getAttribute('data-amount')) || 0, mode: b.getAttribute('data-mode') || 'immediate', itemLabel: b.getAttribute('data-label') || 'Paiement', summary: sum, prefill: pre });
  });

  // ---- copie 1 clic (donnees de test + payload), delegue ----
  document.addEventListener('click', function (e) {
    var c = e.target.closest && e.target.closest('[data-copy]');
    if (!c) return;
    e.preventDefault();
    var v = c.getAttribute('data-copy') || '';
    try { if (navigator.clipboard) navigator.clipboard.writeText(v); } catch (x) {}
    var old = c.textContent; c.textContent = '✓'; setTimeout(function () { c.textContent = old; }, 1000);
  });

  // ---- "Voir le payload de session" sous chaque bouton [data-checkout] ----
  function hlJson(s) {
    return esc(s)
      .replace(/&quot;([^&]+?)&quot;:/g, '<span class="k">"$1"</span>:')
      .replace(/: &quot;([^&]*?)&quot;/g, ': <span class="s">"$1"</span>')
      .replace(/: (-?\d+)/g, ': <span class="n">$1</span>')
      .replace(/: (true|false|null)/g, ': <span class="n">$1</span>');
  }
  var peekOv = document.createElement('div');
  peekOv.className = 'overlay peek-overlay';
  peekOv.innerHTML =
    '<div class="modal peek-modal">' +
      '<div class="peek-head"><b>👁 Payload de session</b><small>POST /api/public/v1/sessions — ce qui serait envoyé, sans déclencher le paiement</small>' +
        '<button class="close peek-close" type="button" aria-label="Fermer">✕</button></div>' +
      '<pre class="peek-json"></pre>' +
      '<div class="peek-foot"><button type="button" class="td-copy peek-copy" data-copy="">📋 Copier le payload</button></div>' +
    '</div>';
  document.body.appendChild(peekOv);
  var peekJson = peekOv.querySelector('.peek-json');
  var peekCopy = peekOv.querySelector('.peek-copy');
  function closePeek() { peekOv.classList.remove('show'); }
  peekOv.querySelector('.peek-close').onclick = closePeek;
  peekOv.addEventListener('click', function (e) { if (e.target === peekOv) closePeek(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePeek(); });

  function showPeek(btn) {
    var mode = btn.getAttribute('data-mode') || 'immediate';
    var amount = Number(btn.getAttribute('data-amount')) || 0;
    var label = btn.getAttribute('data-label') || 'Paiement';
    peekJson.textContent = 'Chargement…'; peekCopy.setAttribute('data-copy', '');
    peekOv.classList.add('show');
    fetch('/api/session-preview', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: mode, amount: { value: amount, currency: 'EUR' }, label: label }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var text = JSON.stringify((d && d.body) || d, null, 2);
        peekCopy.setAttribute('data-copy', text);
        peekJson.innerHTML = hlJson(text);
      })
      .catch(function (e) { peekJson.textContent = 'Erreur : ' + (e.message || e); });
  }

  function addPeek(btn) {
    var n = btn.nextElementSibling;
    if (n && n.classList && n.classList.contains('co-peek')) return;
    var pk = document.createElement('button');
    pk.type = 'button'; pk.className = 'co-peek'; pk.setAttribute('data-peek', '');
    pk.title = 'Voir le payload de session (sans payer)'; pk.textContent = '👁 payload';
    pk.setAttribute('data-mode', btn.getAttribute('data-mode') || 'immediate');
    pk.setAttribute('data-amount', btn.getAttribute('data-amount') || '0');
    pk.setAttribute('data-label', btn.getAttribute('data-label') || 'Paiement');
    btn.insertAdjacentElement('afterend', pk);
  }
  function scanPeek(root) { if (root && root.querySelectorAll) root.querySelectorAll('[data-checkout]').forEach(addPeek); }
  scanPeek(document);
  try {
    new MutationObserver(function (muts) {
      muts.forEach(function (m) { if (m.addedNodes) m.addedNodes.forEach(function (nd) { if (nd.nodeType === 1) { if (nd.matches && nd.matches('[data-checkout]')) addPeek(nd); scanPeek(nd); } }); });
    }).observe(document.body, { childList: true, subtree: true });
  } catch (x) {}
  document.addEventListener('click', function (e) {
    var pk = e.target.closest && e.target.closest('[data-peek]');
    if (!pk) return;
    e.preventDefault(); e.stopPropagation();
    showPeek(pk);
  });

  window.PMS = window.PMS || {};
  window.PMS.checkout = open;
  window.PMS.checkoutFields = FIELDS;
})();
