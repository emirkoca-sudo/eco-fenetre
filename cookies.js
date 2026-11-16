/* Eco Fenêtre : gestion du choix sur les cookies
   Aucun cookie n'est déposé tant que le visiteur n'a pas accepté.
   Seule la carte Google Maps est concernée. Le choix est conservé 6 mois. */
(function () {
  'use strict';
  var KEY = 'ef_cookies_v1', DAYS = 180, bar = null;

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (v && v.t && (Date.now() - v.t) < DAYS * 864e5) return v.c;
    } catch (e) {}
    return null;
  }
  function write(c) { try { localStorage.setItem(KEY, JSON.stringify({ c: c, t: Date.now() })); } catch (e) {} }

  function loadMap() {
    var box = document.getElementById('mapBox');
    if (!box || box.querySelector('iframe')) return;
    var f = document.createElement('iframe');
    f.src = box.getAttribute('data-src');
    f.title = 'Carte : Eco Fenêtre, 18 Rue Gaston Darley, Nemours';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    box.innerHTML = '';
    box.appendChild(f);
  }

  function updateState() {
    var s = document.getElementById('cookieState');
    if (!s) return;
    var c = read();
    s.textContent = c === 'accepted' ? 'Votre choix actuel : cookies acceptés.' : (c === 'refused' ? 'Votre choix actuel : cookies refusés.' : 'Vous n\'avez pas encore fait de choix.');
  }

  function hide() { if (bar) { bar.remove(); bar = null; } }
  function choose(c) {
    write(c); hide(); updateState();
    if (c === 'accepted') loadMap();
  }

  function show() {
    if (bar) return;
    bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Choix sur les cookies');
    bar.innerHTML =
      '<strong>Cookies</strong>' +
      '<p>Ce site n\'utilise ni publicité ni mesure d\'audience. La carte Google Maps du plan d\'accès peut déposer des cookies : vous pouvez les accepter ou les refuser. <a href="cookies.html">En savoir plus</a></p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn btn-ghost btn-sm" data-c="refused">Refuser</button>' +
      '<button type="button" class="btn btn-ghost btn-sm" data-c="accepted">Accepter</button>' +
      '</div>';
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-c]');
      if (b) choose(b.getAttribute('data-c'));
    });
    document.body.appendChild(bar);
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); show(); }
    if (e.target.closest('[data-map-load]')) { choose('accepted'); }
  });

  var c = read();
  if (c === 'accepted') loadMap();
  if (c === null) show();
  updateState();
})();
