/* Общее для главной (index.html) и страницы модели (model.html) */
(function () {
  var M = window.MOOD;
  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  // Прокрутка без плавной анимации (у html стоит scroll-behavior: smooth)
  function jump(y) {
    var root = document.documentElement;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, y);
    root.style.scrollBehavior = '';
  }

  // albumKey — из какого альбома открыли (для «Топ-моделей»: стрелки и «назад» ходят по топу)
  function modelUrl(m, albumKey) {
    return 'model.html?id=' + encodeURIComponent(m.id) + (albumKey && albumKey !== m.album ? '&album=' + albumKey : '');
  }

  // Золотая рамка по краю фото у топ-моделей
  function topFrameHTML(m) {
    return m.top ? '<span class="gold-frame" aria-hidden="true"></span>' : '';
  }

  // Заглушка вместо фото, пока его нет: первая буква имени и «Фото скоро»
  function placeholderHTML(m) {
    return '<span class="ph" role="img" aria-label="' + m.name + ': фото скоро">' +
      '<span class="ph__letter" aria-hidden="true">' + m.name.charAt(0) + '</span>' +
      '<span class="ph__note" aria-hidden="true">Фото скоро</span>' +
    '</span>';
  }

  // Короткая строка параметров под карточкой на телефоне: «Рост 176 · 85–55–90 · Обувь 38»
  function shortParams(m) {
    var parts = [];
    if (m.height) parts.push('Рост ' + m.height);
    if (m.bust && m.waist && m.hips) parts.push(m.bust + '–' + m.waist + '–' + m.hips);
    else [['Грудь', m.bust], ['Талия', m.waist], ['Бёдра', m.hips]].forEach(function (p) {
      if (p[1]) parts.push(p[0] + ' ' + p[1]);
    });
    if (m.shoes) parts.push('Обувь ' + m.shoes);
    return parts.join(' · ');
  }

  // Карточка модели в каталоге — ссылка на её страницу
  function cardHTML(m, i, albumKey) {
    var params = M.params(m);
    var height = params.filter(function (p) { return p[0] === 'Рост'; })[0];
    var short = shortParams(m);
    var cover = M.slides(m)[0]; // главное фото, а если его нет — первое из дополнительных
    return '' +
      '<article class="card" style="animation-delay:' + (i * 50) + 'ms">' +
        '<a class="card__link" href="' + modelUrl(m, albumKey) + '">' +
          '<div class="card__photo">' +
            (cover ? '<img src="' + M.img(cover.photo, 700) + '" alt="' + m.name + '" loading="lazy"' + M.posAttr(cover) + '>' : placeholderHTML(m)) +
            topFrameHTML(m) +
            (params.length ? '<dl class="card__params">' + params.map(function (p) {
              return '<div><dt>' + p[0] + '</dt><dd>' + p[1] + '</dd></div>';
            }).join('') + '</dl>' : '') +
          '</div>' +
          '<div class="card__info">' +
            '<h4 class="card__name">' + m.name + '</h4>' +
            (height ? '<span class="card__height">Рост ' + height[1] + '</span>' : '') +
            (short ? '<p class="card__mobile-params">' + short + '</p>' : '') +
          '</div>' +
        '</a>' +
      '</article>';
  }

  // Шапка: белый фон при прокрутке (или всегда — на внутренних страницах) и мобильное меню
  function initHeader(options) {
    var solid = options && options.solid;
    var header = $('#header');
    var burger = $('.burger');

    function onScroll() {
      header.classList.toggle('is-solid', solid || window.scrollY > 40);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    function setMenu(open) {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    }
    function closeMenu() { setMenu(false); }
    burger.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('menu-open'));
    });
    $$('#mobileMenu a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        closeMenu();
        burger.focus();
      }
    });

    return { closeMenu: closeMenu };
  }

  function initYear() {
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  window.UI = {
    $: $,
    $$: $$,
    pad: pad,
    jump: jump,
    modelUrl: modelUrl,
    topFrameHTML: topFrameHTML,
    placeholderHTML: placeholderHTML,
    cardHTML: cardHTML,
    initHeader: initHeader,
    initYear: initYear
  };
})();
