/*
 * site.js — boîte à outils UI partagée par toutes les vitrines (aucune logique de paiement ici).
 *  - signature co-brandée « propulsé par Payments by Septeo » (topbar + footer) via img/payments-by-septeo.svg inliné
 *  - helpers : query-string, échappement, formats (€, dates), étoiles, onglets, toasts
 *  - composants : galerie + lightbox, calendrier de disponibilité avec sélection de période, apparition au scroll
 * Expose window.SITE.
 */
(function () {
  var S = {};
  var T = window.THEMES || [];
  var key = (document.body.dataset && document.body.dataset.themeKey) || '';
  S.theme = (window.THEME_BY_KEY && window.THEME_BY_KEY[key]) || T.filter(function (t) { return t.key === key; })[0] || null;

  // ---------- helpers ----------
  S.qs = function (name) { var m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search); return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : ''; };
  S.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  S.euros = function (minor, cur) {
    if (window.PMS && PMS.euros) return PMS.euros(minor, cur);
    try { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: cur || 'EUR' }).format((minor || 0) / 100); } catch (e) { return ((minor || 0) / 100).toFixed(2) + ' €'; }
  };
  S.eurosInt = function (minor) { try { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format((minor || 0) / 100); } catch (e) { return Math.round((minor || 0) / 100) + ' €'; } };
  S.pad = function (n) { return (n < 10 ? '0' : '') + n; };
  S.iso = function (d) { return d.getFullYear() + '-' + S.pad(d.getMonth() + 1) + '-' + S.pad(d.getDate()); };
  S.today = function (offsetDays) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + (offsetDays || 0)); return S.iso(d); };
  S.addDays = function (iso, n) { var d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return S.iso(d); };
  S.nights = function (a, b) { return Math.max(0, Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000)); };
  S.fmtDate = function (iso, long) {
    if (!iso) return '—';
    var d = new Date(iso + 'T12:00:00');
    try { return d.toLocaleDateString('fr-FR', long ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } : { weekday: 'short', day: 'numeric', month: 'short' }); } catch (e) { return iso; }
  };
  S.fmtMonth = function (y, m) { try { return new Date(y, m, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }); } catch (e) { return (m + 1) + '/' + y; } };
  S.stars = function (r, n) {
    var full = Math.floor(r), half = r - full >= 0.5, out = '';
    for (var i = 0; i < 5; i++) out += '<span class="star' + (i < full ? ' on' : (i === full && half ? ' half' : '')) + '">★</span>';
    return '<span class="stars" title="' + r + '/5">' + out + '</span>' + (n != null ? '<span class="stars-n">' + r.toFixed(1) + ' · ' + n + ' avis</span>' : '');
  };
  S.rand = function (seed) { var x = Math.sin(seed) * 10000; return x - Math.floor(x); };
  S.toast = function (msg, kind) {
    var t = document.createElement('div'); t.className = 'toast ' + (kind || ''); t.textContent = msg; document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('in'); });
    setTimeout(function () { t.classList.remove('in'); setTimeout(function () { t.remove(); }, 300); }, 2600);
  };

  // ---------- signature Payments by Septeo ----------
  var LOGO_CACHE = null, LOGO_WAIT = [];
  S.logo = function (cb) {
    if (LOGO_CACHE) return cb(LOGO_CACHE);
    LOGO_WAIT.push(cb);
    if (LOGO_WAIT.length > 1) return;
    fetch('img/payments-by-septeo.svg').then(function (r) { return r.text(); }).then(function (svg) {
      LOGO_CACHE = svg.replace(/<\?xml[^>]*>/, '').replace('<svg ', '<svg class="pbs-logo" focusable="false" ');
      LOGO_WAIT.forEach(function (f) { f(LOGO_CACHE); }); LOGO_WAIT = [];
    }).catch(function () {
      LOGO_CACHE = '<img class="pbs-logo" src="img/payments-by-septeo.svg" alt="Payments by Septeo">';
      LOGO_WAIT.forEach(function (f) { f(LOGO_CACHE); }); LOGO_WAIT = [];
    });
  };
  S.signature = function (opts) {
    opts = opts || {};
    var brand = opts.brand || (S.theme && S.theme.brand) || '';
    var el = document.createElement(opts.href === false ? 'span' : 'a');
    el.className = 'pbs' + (opts.compact ? ' compact' : '') + (opts.className ? ' ' + opts.className : '');
    if (opts.href !== false) { el.href = 'https://www.septeo.com'; el.target = '_blank'; el.rel = 'noopener'; el.title = 'Payments by Septeo — la plateforme de paiement des métiers Septeo'; }
    el.innerHTML = (brand && !opts.compact ? '<span class="pbs-brand">' + S.esc(brand) + '</span><span class="pbs-x">×</span>' : '') +
      '<span class="pbs-txt">' + S.esc(opts.text || 'propulsé par') + '</span><span class="pbs-svg"></span>';
    S.logo(function (svg) { var slot = el.querySelector('.pbs-svg'); if (slot) slot.innerHTML = svg; });
    return el;
  };
  S.brand = function () {
    // Topbar : à droite de la marque métier ; Footer : en signature ; Fiches : slot [data-pbs]
    var bar = document.querySelector('.topbar .wrap');
    if (bar && !bar.querySelector('.pbs')) {
      var b = bar.querySelector('.brand');
      var sig = S.signature({ compact: true, text: 'propulsé par' });
      sig.classList.add('pbs-top');
      if (b && b.nextSibling) bar.insertBefore(sig, b.nextSibling); else bar.appendChild(sig);
    }
    var foot = document.querySelector('.footer .wrap');
    if (foot && !foot.querySelector('.pbs')) foot.appendChild(S.signature({}));
    document.querySelectorAll('[data-pbs]').forEach(function (slot) { if (!slot.querySelector('.pbs')) slot.appendChild(S.signature({ compact: slot.getAttribute('data-pbs') === 'compact' })); });
  };

  // ---------- apparition au scroll ----------
  S.reveal = function () {
    var els = document.querySelectorAll('[data-reveal]:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
    // filet de sécurité : tout apparaît au plus tard après 1,5 s (observer paresseux, impression, captures)
    setTimeout(function () { els.forEach(function (e) { if (e.getBoundingClientRect().top < window.innerHeight * 1.2) e.classList.add("in"); }); }, 1500);
  };

  // ---------- onglets ----------
  S.tabs = function (root, onChange) {
    root = typeof root === 'string' ? document.querySelector(root) : root;
    if (!root) return;
    var btns = root.querySelectorAll('[data-tab]');
    function go(name) {
      btns.forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === name); b.setAttribute('aria-selected', b.getAttribute('data-tab') === name); });
      document.querySelectorAll('[data-panel]').forEach(function (p) { if (p.closest('[data-tabs-scope]') && p.closest('[data-tabs-scope]') !== root.closest('[data-tabs-scope]')) return; p.hidden = p.getAttribute('data-panel') !== name; });
      if (onChange) onChange(name);
      try { if (history.replaceState) history.replaceState(null, '', '#' + name); } catch (e) {}
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { go(b.getAttribute('data-tab')); }); });
    var h = location.hash.replace('#', '');
    var first = btns[0] && btns[0].getAttribute('data-tab');
    go(h && root.querySelector('[data-tab="' + h + '"]') ? h : first);
    return go;
  };

  // ---------- galerie + lightbox ----------
  var lb = null, lbImgs = [], lbIdx = 0;
  function ensureLightbox() {
    if (lb) return lb;
    lb = document.createElement('div'); lb.className = 'lightbox';
    lb.innerHTML = '<button class="lb-close" aria-label="Fermer">✕</button><button class="lb-prev" aria-label="Précédente">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-next" aria-label="Suivante">›</button><div class="lb-count"></div>';
    document.body.appendChild(lb);
    lb.querySelector('.lb-close').onclick = closeLb;
    lb.querySelector('.lb-prev').onclick = function (e) { e.stopPropagation(); showLb(lbIdx - 1); };
    lb.querySelector('.lb-next').onclick = function (e) { e.stopPropagation(); showLb(lbIdx + 1); };
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) { if (!lb.classList.contains('show')) return; if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowLeft') showLb(lbIdx - 1); if (e.key === 'ArrowRight') showLb(lbIdx + 1); });
    return lb;
  }
  function showLb(i) { lbIdx = (i + lbImgs.length) % lbImgs.length; var im = lbImgs[lbIdx]; lb.querySelector('img').src = im.src; lb.querySelector('img').alt = im.alt || ''; lb.querySelector('figcaption').textContent = im.alt || ''; lb.querySelector('.lb-count').textContent = (lbIdx + 1) + ' / ' + lbImgs.length; }
  function closeLb() { lb.classList.remove('show'); document.body.classList.remove('noscroll'); }
  S.lightbox = function (images, idx) { ensureLightbox(); lbImgs = images; showLb(idx || 0); lb.classList.add('show'); document.body.classList.add('noscroll'); };
  S.gallery = function (root, images, opts) {
    root = typeof root === 'string' ? document.querySelector(root) : root;
    if (!root || !images || !images.length) return;
    opts = opts || {};
    var cur = 0;
    root.classList.add('gallery');
    root.innerHTML =
      '<div class="g-main"><img src="' + images[0].src + '" alt="' + S.esc(images[0].alt || '') + '">' +
        '<button class="g-open" type="button">🔍 Voir les ' + images.length + ' photos</button>' +
        (images[0].alt ? '<div class="g-cap">' + S.esc(images[0].alt) + '</div>' : '') +
      '</div>' +
      '<div class="g-thumbs">' + images.map(function (im, i) { return '<button type="button" class="' + (i === 0 ? 'on' : '') + '" data-i="' + i + '"><img src="' + im.src + '" alt="' + S.esc(im.alt || '') + '" loading="lazy"></button>'; }).join('') + '</div>';
    var main = root.querySelector('.g-main img'), cap = root.querySelector('.g-cap');
    function go(i) {
      cur = i; main.classList.add('fade'); setTimeout(function () { main.src = images[i].src; main.alt = images[i].alt || ''; main.classList.remove('fade'); }, 120);
      if (cap) cap.textContent = images[i].alt || '';
      root.querySelectorAll('.g-thumbs button').forEach(function (b, k) { b.classList.toggle('on', k === i); });
    }
    root.querySelectorAll('.g-thumbs button').forEach(function (b) { b.onclick = function () { go(Number(b.getAttribute('data-i'))); }; });
    root.querySelector('.g-open').onclick = function () { S.lightbox(images, cur); };
    main.onclick = function () { S.lightbox(images, cur); };
    if (opts.auto) setInterval(function () { if (!document.hidden && !root.matches(':hover')) go((cur + 1) % images.length); }, opts.auto);
  };
  // Mosaïque (1 grande + 4 petites) façon location
  S.mosaic = function (root, images) {
    root = typeof root === 'string' ? document.querySelector(root) : root;
    if (!root || !images || !images.length) return;
    root.classList.add('mosaic');
    var html = '';
    for (var i = 0; i < Math.min(5, images.length); i++) html += '<button type="button" class="m' + i + '" data-i="' + i + '"><img src="' + images[i].src + '" alt="' + S.esc(images[i].alt || '') + '"' + (i ? ' loading="lazy"' : '') + '></button>';
    html += '<button type="button" class="m-all" data-i="0">▦ Toutes les photos (' + images.length + ')</button>';
    root.innerHTML = html;
    root.querySelectorAll('button').forEach(function (b) { b.onclick = function () { S.lightbox(images, Number(b.getAttribute('data-i'))); }; });
  };

  // ---------- calendrier de disponibilité avec sélection de période ----------
  // opts : { months:2, booked:['2026-10-12', ...], start:iso, end:iso, minNights:1, onChange(start,end,nights), prices:{iso:minor} }
  S.calendar = function (root, opts) {
    root = typeof root === 'string' ? document.querySelector(root) : root;
    if (!root) return;
    opts = opts || {};
    var booked = {}; (opts.booked || []).forEach(function (d) { booked[d] = true; });
    var start = opts.start || null, end = opts.end || null, hover = null;
    var base = new Date(); base.setDate(1); base.setHours(12, 0, 0, 0);
    if (start) { var sd = new Date(start + 'T12:00:00'); base = new Date(sd.getFullYear(), sd.getMonth(), 1, 12); }
    var months = opts.months || 2;
    var todayIso = S.today(0);
    root.classList.add('cal');
    function inRange(iso) { var e = end || hover; return start && e && iso > start && iso < e && !(end && iso === end); }
    function render() {
      var html = '<div class="cal-head"><button type="button" class="cal-nav" data-nav="-1">‹</button><span></span><button type="button" class="cal-nav" data-nav="1">›</button></div><div class="cal-months">';
      for (var m = 0; m < months; m++) {
        var y = base.getFullYear(), mo = base.getMonth() + m; var d = new Date(y, mo, 1, 12); y = d.getFullYear(); mo = d.getMonth();
        var first = (d.getDay() + 6) % 7, days = new Date(y, mo + 1, 0).getDate();
        html += '<div class="cal-month"><div class="cal-title">' + S.fmtMonth(y, mo) + '</div><div class="cal-grid"><span class="dow">L</span><span class="dow">M</span><span class="dow">M</span><span class="dow">J</span><span class="dow">V</span><span class="dow">S</span><span class="dow">D</span>';
        for (var b = 0; b < first; b++) html += '<span class="pad"></span>';
        for (var dd = 1; dd <= days; dd++) {
          var iso = y + '-' + S.pad(mo + 1) + '-' + S.pad(dd);
          var cls = 'day';
          if (iso < todayIso) cls += ' past';
          else if (booked[iso]) cls += ' booked';
          if (iso === start) cls += ' start'; if (iso === end) cls += ' end'; if (inRange(iso)) cls += ' in';
          var price = opts.prices && opts.prices(iso);
          html += '<button type="button" class="' + cls + '" data-d="' + iso + '"' + (cls.indexOf('past') > -1 || cls.indexOf('booked') > -1 ? ' disabled' : '') + '><b>' + dd + '</b>' + (price != null ? '<small>' + Math.round(price / 100) + '€</small>' : '') + '</button>';
        }
        html += '</div></div>';
      }
      html += '</div><div class="cal-legend"><span><i class="l-free"></i>Disponible</span><span><i class="l-booked"></i>Réservé</span><span><i class="l-sel"></i>Votre séjour</span></div>';
      root.innerHTML = html;
      root.querySelectorAll('.cal-nav').forEach(function (b) { b.onclick = function () { base.setMonth(base.getMonth() + Number(b.getAttribute('data-nav'))); render(); }; });
      root.querySelectorAll('.day:not([disabled])').forEach(function (b) {
        b.onclick = function () {
          var iso = b.getAttribute('data-d');
          if (!start || (start && end) || iso <= start) { start = iso; end = null; }
          else {
            // pas de nuit réservée dans l'intervalle
            var ok = true; for (var c = S.addDays(start, 1); c < iso; c = S.addDays(c, 1)) if (booked[c]) { ok = false; break; }
            if (!ok) { start = iso; end = null; S.toast('Période indisponible : une date est déjà réservée.', 'warn'); }
            else if (S.nights(start, iso) < (opts.minNights || 1)) { S.toast('Minimum ' + (opts.minNights || 1) + ' nuit(s).', 'warn'); }
            else end = iso;
          }
          render();
          if (opts.onChange) opts.onChange(start, end, start && end ? S.nights(start, end) : 0);
        };
        b.onmouseenter = function () { if (start && !end) { hover = b.getAttribute('data-d'); root.querySelectorAll('.day').forEach(function (x) { var i = x.getAttribute('data-d'); x.classList.toggle('in', !!(start && hover && i > start && i < hover)); }); } };
      });
    }
    render();
    return { get: function () { return { start: start, end: end, nights: start && end ? S.nights(start, end) : 0 }; }, set: function (a, b) { start = a; end = b; render(); } };
  };

  // ---------- compteur animé ----------
  S.countUp = function (el, to, fmt, ms) {
    var t0 = null; ms = ms || 900;
    function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / ms); var e = 1 - Math.pow(1 - p, 3); el.textContent = fmt ? fmt(to * e) : Math.round(to * e); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  };

  // ---------- init ----------
  document.addEventListener('DOMContentLoaded', function () { S.brand(); S.reveal(); });
  window.SITE = S;
})();
