/* Console d'operations - construit les formulaires, annote chaque champ avec sa source webhook,
   appelle /api/op et affiche la reponse brute de l'API. */
(function () {
  var FIELDS = {
    pspReference: { label: 'pspReference (paiement d\'origine)', ph: 'W72759K9BDSGWJ75',
      hook: 'Webhook <b>AUTHORISATION</b> &rarr; champ <b>pspReference</b> (racine du webhook).' },
    amount: { label: 'Montant (en centimes)', type: 'number', ph: '8000',
      hook: 'Partiel autorise. Le montant d\'origine est dans <b>amount.value</b> du webhook AUTHORISATION.' },
    reason: { label: 'Raison (optionnel)', ph: '',
      hook: 'Enum ExtensionReason <b>(a confirmer)</b>. Laisser vide en cas de doute.' },
    token: { label: 'Token (moyen enregistre)', ph: 'FF9JFCS6TVJL3J65',
      hook: 'Webhook AUTHORISATION &rarr; <b>additionalData.tokenization.storedPaymentMethodId</b> (= recurring.recurringDetailReference).' },
    shopperReference: { label: 'shopperReference (client)', ph: 'sim-mandate-...',
      hook: 'Webhook AUTHORISATION &rarr; <b>additionalData.recurring.shopperReference</b> (ou shopperReference racine).' },
    recurringModel: { label: 'Modele de recurrence', type: 'select', options: ['UNSCHEDULED', 'SUBSCRIPTION', 'CARD_ON_FILE'],
      hook: 'Doit correspondre au modele utilise lors de la tokenisation.' },
    orderPspReference: { label: 'orderPspReference (order composite)', ph: '883612345678ORDR',
      hook: 'Webhook <b>ORDER_CLOSED</b> &rarr; champ <b>pspReference</b> (racine). Relie les jambes ANCV + carte d\'un meme achat.' },
  };

  var OPS = [
    { op: 'get', label: 'Consulter', fields: ['pspReference'],
      desc: 'GET /payments/{pspReference} - etat courant, jambes (captures / remboursements) et montants agreges.' },
    { op: 'capture', label: 'Capturer', fields: ['pspReference', 'amount'],
      desc: 'POST /payments/{pspReference}/captures - capture totale ou partielle d\'une autorisation. Reponse RECEIVED ; resultat definitif par webhook <b>CAPTURE</b> (success=true, originalReference = pspReference d\'origine) - a confirmer.' },
    { op: 'cancel', label: 'Annuler', fields: ['pspReference'],
      desc: 'POST /payments/{pspReference}/cancels - annule une autorisation NON encore capturee (avant capture). Webhook <b>CANCELLATION</b>.' },
    { op: 'reversal', label: 'Reversal', fields: ['pspReference'],
      desc: 'POST /payments/{pspReference}/reversals - undo intelligent : annule si pas capture, sinon rembourse.' },
    { op: 'order-reversal', label: 'Annuler un order (ANCV+CB)', fields: ['orderPspReference'],
      desc: 'POST /orders/{orderPspReference}/reversals - annule un order <b>composite</b> (ex. ANCV + carte) en inversant CHAQUE jambe. Reponse <b>par jambe</b> (voir <code>legs</code>) : <code>status</code> global RECEIVED / PARTIAL / FAILED. La jambe ANCV n\'est reversable que dans les 4h ; sinon elle ressort REFUSED pendant que la carte est bien inversee.' },
    { op: 'refund', label: 'Rembourser', fields: ['pspReference', 'amount'],
      desc: 'POST /payments/{pspReference}/refunds - remboursement total ou partiel d\'un paiement capture. Webhook <b>REFUND</b>.' },
    { op: 'adjust', label: 'Ajuster le montant', fields: ['pspReference', 'amount'],
      desc: 'POST /payments/{pspReference}/amount - ajuste le montant d\'une autorisation avant capture (ex : caution finale). Webhook <b>AUTHORISATION_ADJUSTMENT</b>.' },
    { op: 'extend', label: 'Prolonger la validite', fields: ['pspReference', 'amount', 'reason'],
      desc: 'POST /payments/{pspReference}/extend - prolonge la validite d\'une autorisation non capturee (caution longue).' },
    { op: 'mit', label: 'Rejouer (MIT)', fields: ['token', 'shopperReference', 'amount', 'recurringModel'],
      desc: 'POST /payments - paiement recurrent avec un moyen stocke (Merchant Initiated Transaction), ex : loyer mensuel.' },
    { op: 'tokens', label: 'Moyens enregistres', fields: ['shopperReference'],
      desc: 'GET /stored-payment-methods - liste les moyens de paiement enregistres d\'un client.' },
    { op: 'token-del', label: 'Supprimer un token', fields: ['token', 'shopperReference'],
      desc: 'DELETE /stored-payment-methods/{token} - supprime un moyen enregistre.' },
  ];

  var opsEl = document.getElementById('ops');
  var fieldsEl = document.getElementById('fields');
  var descEl = document.getElementById('op-desc');
  var current = OPS[0];

  OPS.forEach(function (o) {
    var b = document.createElement('button');
    b.className = 'op-tab' + (o === current ? ' active' : '');
    b.textContent = o.label; b.dataset.op = o.op;
    b.onclick = function () { current = o; select(); };
    opsEl.appendChild(b);
  });

  function select() {
    Array.prototype.forEach.call(opsEl.children, function (c) { c.classList.toggle('active', c.dataset.op === current.op); });
    descEl.innerHTML = current.desc;
    fieldsEl.innerHTML = current.fields.map(function (key) {
      var f = FIELDS[key];
      var input;
      if (f.type === 'select') {
        input = '<select id="f-' + key + '">' + f.options.map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select>';
      } else {
        input = '<input id="f-' + key + '" type="' + (f.type || 'text') + '" placeholder="' + (f.ph || '') + '" />';
      }
      return '<div class="field"><label>' + f.label + '</label>' + input + '<span class="hook">' + f.hook + '</span></div>';
    }).join('');
  }

  function val(key) { var el = document.getElementById('f-' + key); return el ? el.value.trim() : ''; }

  document.getElementById('run').onclick = async function () {
    var payload = { op: current.op };
    current.fields.forEach(function (k) { payload[k] = val(k); });
    // validations minimales
    if (current.fields.indexOf('pspReference') >= 0 && !payload.pspReference) return show(0, { error: 'pspReference requis (voir webhook AUTHORISATION).' });
    if (current.fields.indexOf('orderPspReference') >= 0 && !payload.orderPspReference) return show(0, { error: 'orderPspReference requis (voir webhook ORDER_CLOSED).' });
    if (current.fields.indexOf('amount') >= 0 && !payload.amount) return show(0, { error: 'Montant requis (en centimes).' });

    var bar = document.getElementById('result-bar'); bar.style.display = 'none';
    document.getElementById('result-json').textContent = 'Appel en cours...';
    try {
      var r = await fetch('/api/op', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      var d = await r.json();
      if (d && typeof d.httpStatus !== 'undefined') show(d.httpStatus, d.body);
      else show(r.status, d);
    } catch (e) { show(0, { error: String(e.message || e) }); }
  };

  function show(status, body) {
    var bar = document.getElementById('result-bar');
    var chip = document.getElementById('result-chip');
    var meta = document.getElementById('result-meta');
    bar.style.display = 'flex';
    var ok = status >= 200 && status < 300;
    chip.className = 'chip ' + (ok ? 'ok' : 'err');
    chip.textContent = ok ? ('HTTP ' + status + ' OK') : ('HTTP ' + (status || 'ERR'));
    meta.textContent = ok ? 'Reponse synchrone - le definitif arrive par webhook.' : 'Echec - voir le detail.';
    document.getElementById('result-json').textContent = JSON.stringify(body, null, 2);
  }

  select();
})();
