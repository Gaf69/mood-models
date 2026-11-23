(function () {
  var M = window.MOOD;
  var UI = window.UI;
  var $ = UI.$, $$ = UI.$$, pad = UI.pad;

  /* ---------- Навигация ---------- */
  var nav = UI.initHeader();

  /* ---------- Hero: слайдшоу-триптих ---------- */
  var SLIDE_TIME = 6000;
  var slidesRoot = $('#heroSlides');
  var progress = $('#heroProgress');
  var groups = [];
  for (var i = 0; i + 2 < M.hero.length; i += 3) groups.push(M.hero.slice(i, i + 3));

  groups.forEach(function (group, gi) {
    var slide = document.createElement('div');
    slide.className = 'hero__slide';
    slide.innerHTML = group.map(function (item) {
      return '<figure><img src="' + M.img(item.photo, 900) + '" alt=""' + M.posAttr(item) + (gi ? ' loading="lazy"' : '') + '></figure>';
    }).join('');
    slidesRoot.appendChild(slide);

    var bar = document.createElement('button');
    bar.type = 'button';
    bar.setAttribute('aria-label', 'Слайд ' + (gi + 1));
    bar.addEventListener('click', function () { show(gi); });
    progress.appendChild(bar);
  });
  progress.style.setProperty('--slide-time', SLIDE_TIME + 'ms');
  $('#heroTotal').textContent = pad(groups.length);

  var slides = $$('.hero__slide', slidesRoot);
  var bars = $$('button', progress);
  var current = -1;
  var timer;
  // «Уменьшить движение» в настройках системы — слайды не листаются сами (только по полоскам)
  var heroAutoplay = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
    bars.forEach(function (b, i) {
      b.classList.remove('is-active');
      b.classList.toggle('is-done', i < current);
    });
    void progress.offsetWidth; // перезапуск анимации полоски
    bars[current].classList.add('is-active');
    $('#heroCurrent').textContent = pad(current + 1);
    clearTimeout(timer);
    if (heroAutoplay) timer = setTimeout(function () { show(current + 1); }, SLIDE_TIME);
  }
  if (slides.length) show(0);

  /* ---------- Новости ---------- */
  var dateFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  // Новость без url — просто карточка, не ссылка (чтобы не было ссылок «в никуда»)
  function newsHTML(n, featured) {
    var date = dateFmt.format(new Date(n.date + 'T12:00:00')).replace(/\s*г\.$/, '');
    var tag = n.url ? 'a href="' + n.url + '"' : 'div';
    return '' +
      '<article class="news-card ' + (featured ? 'news-card--featured' : 'news-card--row') + (n.url ? '' : ' news-card--static') + '">' +
        '<' + tag + ' class="news-card__link">' +
          '<div class="news-card__img"><img src="' + M.img(n.photo, featured ? 1200 : 400) + '" alt="" loading="lazy"' + M.posAttr(n) + '></div>' +
          '<div class="news-card__body">' +
            '<p class="news-card__meta"><span>' + n.tag + '</span><time datetime="' + n.date + '">' + date + '</time></p>' +
            '<h3 class="news-card__title"><span>' + n.title + '</span></h3>' +
            (featured ? '<p class="news-card__text">' + n.text + '</p>' + (n.url ? '<span class="news-card__more">Подробнее</span>' : '') : '') +
          '</div>' +
        '</' + (n.url ? 'a' : 'div') + '>' +
      '</article>';
  }

  if (M.news && M.news.length) {
    $('#newsGrid').innerHTML =
      newsHTML(M.news[0], true) +
      '<div class="news__list">' + M.news.slice(1, 4).map(function (n) { return newsHTML(n, false); }).join('') + '</div>';
  }

  /* ---------- Альбомы ---------- */
  M.albumOrder.forEach(function (key) {
    var models = M.albums[key].models;
    $('[data-count="' + key + '"]').textContent = M.countLabel(models.length);
    // на обложку альбома — первые три модели, у которых уже есть фото
    $('[data-stack="' + key + '"]').innerHTML = models.map(function (m) { return M.slides(m)[0]; }).filter(Boolean).slice(0, 3).map(function (s) {
      return '<span class="album__page"><img src="' + M.img(s.photo, 600) + '" alt="" loading="lazy"' + M.posAttr(s) + '></span>';
    }).join('');
  });

  var gallery = $('#gallery');
  var grid = $('#galleryGrid');
  var currentAlbum = null;

  function openAlbum(key, scroll) {
    var album = M.albums[key];
    currentAlbum = key;
    $('#galleryTitle').textContent = album.title;
    grid.innerHTML = album.models.map(function (m, i) { return UI.cardHTML(m, i, key); }).join('');
    $$('[data-tab]').forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.tab === key)); });
    $$('.album').forEach(function (a) { a.classList.toggle('is-current', a.dataset.album === key); });

    var wasHidden = gallery.hidden;
    gallery.hidden = false;
    if (wasHidden) {
      gallery.classList.remove('is-entering');
      void gallery.offsetWidth;
      gallery.classList.add('is-entering');
    }
    if (scroll) gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  $$('.album').forEach(function (a) {
    a.addEventListener('click', function () { openAlbum(a.dataset.album, true); });
  });
  $$('[data-tab]').forEach(function (t) {
    t.addEventListener('click', function () { openAlbum(t.dataset.tab, false); });
  });
  $$('[data-open-album]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      nav.closeMenu();
      openAlbum(link.dataset.openAlbum, true);
    });
  });
  $('#galleryClose').addEventListener('click', function () {
    gallery.hidden = true;
    currentAlbum = null;
    $$('.album').forEach(function (a) { a.classList.remove('is-current'); });
    $('#models').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- Возврат со страницы модели в тот же альбом и на то же место ---------- */
  var RETURN_KEY = 'mood:return';

  function saveReturn() {
    try {
      sessionStorage.setItem(RETURN_KEY, JSON.stringify({ album: currentAlbum, scroll: Math.round(window.scrollY) }));
    } catch (e) { /* приватный режим — просто не запоминаем */ }
  }

  function readReturn() {
    try { return JSON.parse(sessionStorage.getItem(RETURN_KEY)); } catch (e) { return null; }
  }

  grid.addEventListener('click', function (e) {
    if (e.target.closest('.card__link')) saveReturn();
  });

  // index.html?album=women — со страницы модели («← Альбом») или из меню на ней;
  // кнопка «Назад» в браузере — восстанавливаем альбом и прокрутку из sessionStorage
  (function restoreAlbum() {
    var albumParam = new URLSearchParams(location.search).get('album');
    var saved = readReturn();
    var navEntry = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
    var isBack = navEntry && navEntry.type === 'back_forward';
    var key = albumParam && M.albums[albumParam] ? albumParam
      : isBack && saved && M.albums[saved.album] ? saved.album : null;
    if (!key) return;

    if (albumParam) history.replaceState(null, '', location.pathname + location.hash);
    openAlbum(key, false);
    var target = saved && saved.album === key ? saved.scroll : null;
    function apply() {
      UI.jump(target !== null ? target : gallery.getBoundingClientRect().top + window.scrollY - 90);
    }
    apply();
    window.addEventListener('load', apply, { once: true });
  })();

  /* ---------- Стать моделью ---------- */
  var castingImg = $('#castingImg');
  castingImg.src = M.img(M.casting.photo, 900);
  castingImg.style.objectPosition = M.casting.pos || '';

  var form = $('#castingForm');
  var upload = $('.upload input', form);
  var hint = $('.upload__hint', form);
  upload.addEventListener('change', function () {
    var n = upload.files.length;
    hint.textContent = n ? 'Выбрано файлов: ' + n : hint.dataset.default;
  });

  // Что не так с полем: '' — всё в порядке, 'empty' — не заполнено, иначе — текст подсказки
  function fieldProblem(input) {
    if (input.type === 'checkbox') return input.checked ? '' : 'empty';
    var v = input.value.trim();
    if (!v) return input.required ? 'empty' : '';
    if (input.type === 'number') {
      var n = Number(v);
      if (!isFinite(n) || (input.min && n < +input.min) || (input.max && n > +input.max)) return 'от ' + input.min + ' до ' + input.max;
    }
    if (input.type === 'tel' && v.replace(/\D/g, '').length < 7) return 'укажите номер полностью';
    return '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var empty = false;
    var hints = [];
    $$('.field input, .check input', form).forEach(function (input) {
      var problem = fieldProblem(input);
      input.closest('.field, .check').classList.toggle('is-invalid', !!problem);
      if (problem === 'empty') empty = true;
      else if (problem) hints.push('«' + $('span', input.closest('.field')).textContent + '» — ' + problem);
    });
    var status = $('.form__status', form);
    if (empty || hints.length) {
      status.className = 'form__status';
      status.textContent = empty ? 'Пожалуйста, заполните обязательные поля.' : 'Проверьте: ' + hints.join('; ') + '.';
      return;
    }
    // Здесь подключается отправка: e-mail, CRM или Telegram-бот
    form.reset();
    hint.textContent = hint.dataset.default;
    status.className = 'form__status is-success';
    status.textContent = 'Спасибо! Анкета отправлена — мы свяжемся с вами в течение 3 дней.';
  });
  form.addEventListener('input', function (e) {
    var box = e.target.closest('.is-invalid');
    if (box) box.classList.remove('is-invalid');
  });

  UI.initYear();
})();
