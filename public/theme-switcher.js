/*
 * Sélecteur d'univers in-page : injecte un menu déroulant dans la topbar (.topbar .nav)
 * pour changer de métier sans repasser par l'accueil. Lit window.THEMES et l'univers courant
 * via <body data-theme-key="...">. À inclure après themes.js sur chaque page métier.
 */
(function () {
  var T = window.THEMES || [];
  var nav = document.querySelector('.topbar .nav');
  if (!nav || !T.length) return;

  var curKey = (document.body.dataset && document.body.dataset.themeKey) || '';
  var cur = T.filter(function (t) { return t.key === curKey; })[0];

  var tsw = document.createElement('div');
  tsw.className = 'tsw';

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.innerHTML = "<span class='swdot'></span>" + (cur ? cur.name : 'Changer d’univers') + " <span aria-hidden='true'>▾</span>";

  var menu = document.createElement('div');
  menu.className = 'tsw-menu';
  var html = "<a class='home' href='index.html'>← Tous les univers</a>";
  T.forEach(function (t) {
    html += "<a class='" + (t.key === curKey ? 'cur' : '') + "' href='" + t.page + "'>" +
      "<span class='mdot' style='background:" + t.accent + "'></span>" +
      "<span>" + t.name + "<small>" + t.product + "</small></span></a>";
  });
  menu.innerHTML = html;

  tsw.appendChild(btn);
  tsw.appendChild(menu);
  nav.insertBefore(tsw, nav.firstChild);

  btn.addEventListener('click', function (e) { e.stopPropagation(); tsw.classList.toggle('open'); });
  document.addEventListener('click', function () { tsw.classList.remove('open'); });
})();
