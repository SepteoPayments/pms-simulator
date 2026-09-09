/* Simulateur PMS - runtime front partage : panier, modal Drop-in, appels /api/pay.
   Expose window.PMS.{ pay, pos, addToCart, openCart }. */
(function () {
  function euros(minor, cur) {
    try { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: cur || 'EUR' }).format((minor || 0) / 100); }
    catch (e) { return ((minor || 0) / 100).toFixed(2) + ' ' + (cur || 'EUR'); }
  }

  // ---------------- modal Drop-in ----------------
  var overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML =
    '<div class="modal">' +
      '<button class="close" type="button">Fermer</button>' +
      '<h2 id="pm-title">Paiement</h2>' +
      '<p class="sub" id="pm-sub"></p>' +
      '<div class="amount" id="pm-amount"></div>' +
      '<div id="dropin"></div>' +
      '<div class="status" id="pm-status"></div>' +
      '<div class="testcards">Carte de test : <code>4111 1111 1111 1111</code> &middot; <code>03/30</code> &middot; CVC <code>737</code>.</div>' +
    '</div>';
  document.body.appendChild(overlay);
  var titleEl = overlay.querySelector('#pm-title'), subEl = overlay.querySelector('#pm-sub'),
      amountEl = overlay.querySelector('#pm-amount'), statusEl = overlay.querySelector('#pm-status'),
      dropinEl = overlay.querySelector('#dropin');
  var currentDropin = null;
  function setStatus(k, m) { statusEl.className = 'status show ' + k; statusEl.textContent = m; }
  function clearStatus() { statusEl.className = 'status'; statusEl.textContent = ''; }
  function closeModal() {
    overlay.classList.remove('show');
    if (currentDropin && currentDropin.unmount) { try { currentDropin.unmount(); } catch (e) {} }
    currentDropin = null; dropinEl.innerHTML = ''; clearStatus();
  }
  overlay.querySelector('.close').onclick = closeModal;
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });

  async function pay(opts) {
    opts = opts || {};
    titleEl.textContent = opts.label || 'Paiement'; subEl.textContent = ''; amountEl.textContent = euros(opts.value, opts.currency);
    dropinEl.innerHTML = ''; clearStatus(); overlay.classList.add('show');
    setStatus('warn', 'Ouverture de la session de paiement...');
    var data;
    try {
      var r = await fetch('/api/pay', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: opts.mode || 'immediate', amount: { value: opts.value, currency: opts.currency || 'EUR' }, label: opts.label, shopperReference: opts.shopperReference }) });
      data = await r.json();
      if (!r.ok) throw new Error(data.error || ('HTTP ' + r.status));
    } catch (e) { setStatus('err', 'Echec ouverture session : ' + e.message); return; }

    subEl.textContent = 'Reference : ' + data.reference + (opts.mode === 'caution' ? '  -  pre-autorisation (empreinte)' : opts.mode === 'mandate' ? '  -  enregistrement du moyen de paiement' : '');
    amountEl.textContent = euros(data.amount.value, data.amount.currency);
    var session;
    try { var p = typeof data.clientSession === 'string' ? JSON.parse(data.clientSession) : data.clientSession; session = { id: p.id, sessionData: p.sessionData }; }
    catch (e) { setStatus('err', 'clientSession illisible : ' + e.message); return; }
    if (typeof AdyenCheckout === 'undefined') { setStatus('err', 'SDK Adyen non charge (CDN bloque ?).'); return; }
    try {
      clearStatus();
      var checkout = await AdyenCheckout({
        environment: data.environment, clientKey: data.clientKey, locale: 'fr-FR', session: session,
        onPaymentCompleted: function (res) { setStatus('ok', 'Paiement termine - resultCode : ' + (res.resultCode || '?') + '. Le pspReference arrive par le webhook AUTHORISATION.'); if (window.PMS && window.PMS._onPaid) window.PMS._onPaid(); },
        onError: function (err) { setStatus('err', 'Erreur Drop-in : ' + (err.message || err.name || 'inconnue')); },
      });
      currentDropin = checkout.create('dropin').mount('#dropin');
    } catch (e) { setStatus('err', 'Init Adyen echouee : ' + (e.message || e)); }
  }

  async function pos() {
    titleEl.textContent = 'Paiement au TPE'; subEl.textContent = ''; amountEl.textContent = '';
    dropinEl.innerHTML = ''; clearStatus(); overlay.classList.add('show');
    try {
      var r = await fetch('/api/pos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      var d = await r.json();
      setStatus('warn', (d.error || 'TPE') + ' - ' + (d.detail || ''));
    } catch (e) { setStatus('err', e.message); }
  }

  // ---------------- panier ----------------
  var cart = [];
  var drawer = document.createElement('aside');
  drawer.className = 'drawer';
  drawer.innerHTML =
    '<header><h3>Votre panier</h3><button class="close btn ghost sm" type="button">Fermer</button></header>' +
    '<div class="items" id="cart-items"></div>' +
    '<footer><div class="total"><span>Total</span><span id="cart-total">0,00 &euro;</span></div>' +
    '<button class="btn accent block" id="cart-pay">Payer</button></footer>';
  document.body.appendChild(drawer);
  var itemsEl = drawer.querySelector('#cart-items'), totalEl = drawer.querySelector('#cart-total');
  drawer.querySelector('header .close').onclick = function () { drawer.classList.remove('show'); };
  drawer.querySelector('#cart-pay').onclick = function () {
    var total = cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
    if (!total) return;
    drawer.classList.remove('show');
    var n = cart.reduce(function (s, i) { return s + i.qty; }, 0);
    if (window.PMS && PMS.checkout) {
      var sum = cart.map(function (i) { return [i.name, i.qty + ' × ' + euros(i.price)]; });
      PMS.checkout({ mode: 'immediate', amount: total, itemLabel: 'Commande — ' + n + ' article(s)', summary: sum });
    } else {
      pay({ mode: 'immediate', value: total, label: 'Panier - ' + n + ' article(s)' });
    }
  };
  function renderCart() {
    var count = cart.reduce(function (s, i) { return s + i.qty; }, 0);
    var total = cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
    var badge = document.getElementById('cart-count'); if (badge) badge.textContent = count;
    totalEl.innerHTML = euros(total);
    if (!cart.length) { itemsEl.innerHTML = '<div class="empty">Panier vide</div>'; return; }
    itemsEl.innerHTML = cart.map(function (i, idx) {
      return '<div class="citem">' + (i.img ? '<img src="' + i.img + '" alt="">' : '') +
        '<div class="c-main"><div class="c-name">' + i.name + '</div>' +
        '<div class="c-line">' + i.qty + ' x ' + euros(i.price) + '</div>' +
        '<button class="rm" data-rm="' + idx + '">Retirer</button></div>' +
        '<div>' + euros(i.price * i.qty) + '</div></div>';
    }).join('');
    itemsEl.querySelectorAll('[data-rm]').forEach(function (b) {
      b.onclick = function () { cart.splice(Number(b.getAttribute('data-rm')), 1); renderCart(); };
    });
  }
  function addToCart(item) {
    var ex = cart.find(function (i) { return i.id === item.id; });
    if (ex) ex.qty += 1; else cart.push({ id: item.id, name: item.name, price: item.price, img: item.img, qty: 1 });
    renderCart(); drawer.classList.add('show');
  }
  function openCart() { renderCart(); drawer.classList.add('show'); }
  renderCart();

  // ---------------- cablage data-attributes ----------------
  document.addEventListener('click', function (e) {
    var payBtn = e.target.closest('[data-pay]');
    if (payBtn) { e.preventDefault();
      if (payBtn.hasAttribute('data-pos')) return pos();
      var valAttr = payBtn.getAttribute('data-amount');
      var val = valAttr ? Number(valAttr) : (window.PMS._amountResolver ? window.PMS._amountResolver(payBtn) : 0);
      return pay({ mode: payBtn.getAttribute('data-pay') || 'immediate', value: val, label: payBtn.getAttribute('data-label') || 'Paiement' });
    }
    var addBtn = e.target.closest('[data-add]');
    if (addBtn) { e.preventDefault();
      addToCart({ id: addBtn.getAttribute('data-id'), name: addBtn.getAttribute('data-name'), price: Number(addBtn.getAttribute('data-price')), img: addBtn.getAttribute('data-img') });
    }
    if (e.target.closest('#open-cart')) { e.preventDefault(); openCart(); }
  });

  window.PMS = { pay: pay, pos: pos, addToCart: addToCart, openCart: openCart, euros: euros };
})();
