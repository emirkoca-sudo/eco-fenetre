/* Eco Fenêtre : scripts du site */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ombre de l'en-tête au défilement */
  var header = $('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* menu mobile */
  var btn = $('#menuBtn'), nav = $('#nav');
  if (btn && nav) {
    var closeMenu = function () { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Ouvrir le menu'); };
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* curseurs avant / après */
  $$('[data-ba]').forEach(function (box) {
    var range = $('.ba-range', box);
    function set() { box.style.setProperty('--pos', range.value + '%'); }
    range.addEventListener('input', set); set();
  });

  /* visionneuse de photos */
  var lb = $('#lb');
  if (lb) {
    var lbImg = $('img', lb), lbCap = $('figcaption', lb);
    var thumbs = $$('.thumb'), idx = 0, lastFocus = null;
    var show = function (i) {
      idx = (i + thumbs.length) % thumbs.length;
      var t = thumbs[idx];
      lbImg.src = t.getAttribute('data-full');
      lbImg.alt = $('img', t).alt;
      lbCap.textContent = t.getAttribute('data-cap') || '';
    };
    var openLb = function (i) { lastFocus = document.activeElement; show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; $('.x', lb).focus(); };
    var closeLb = function () { lb.classList.remove('open'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); };
    thumbs.forEach(function (t, i) { t.addEventListener('click', function () { openLb(i); }); });
    $('.x', lb).addEventListener('click', closeLb);
    $('.p', lb).addEventListener('click', function () { show(idx - 1); });
    $('.nx', lb).addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }
})();
