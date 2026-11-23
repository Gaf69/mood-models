/* Страница модели: model.html?id=<id модели> */
(function () {
  var M = window.MOOD;
  var UI = window.UI;
  var $ = UI.$, $$ = UI.$$, pad = UI.pad;

  var SLIDE_TIME = 3000; // фото переключаются сами каждые 3 секунды

  UI.initHeader({ solid: true });
  UI.initYear();

  var root = $('#modelPage');
  var id = new URLSearchParams(location.search).get('id');
  var model = id ? M.findModel(id) : null;

  function albumUrl(key) {
    return 'index.html?album=' + key;
  }

  function telegramHandle(url) {
    return url.replace(/^https?:\/\/t\.me\//, '@');
  }

  function initials(name) {
    return name.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
  }

  function notFoundHTML() {
    return '' +
      '<div class="container mp-empty">' +
        '<p class="mp-label">Ошибка 404</p>' +
        '<h1 class="mp-name">Модель не найдена</h1>' +
        '<p class="mp-empty__text">Возможно, ссылка устарела. Посмотрите всех моделей в каталоге.</p>' +
        '<a class="btn btn--dark" href="' + albumUrl('women') + '">Девушки</a> ' +
        '<a class="btn btn--dark" href="' + albumUrl('men') + '">Парни</a>' +
      '</div>';
  }

  function viewerHTML(m, shots) {
    if (!shots.length) {
      return '<div class="mp-photo"><div class="mp-viewer mp-viewer--empty">' + UI.placeholderHTML(m) + UI.topFrameHTML(m) + '</div></div>';
    }
    var many = shots.length > 1;
    return '' +
      '<div class="mp-photo">' +
        '<button type="button" class="mp-viewer" id="mpViewer" aria-label="Открыть фото крупно">' +
          shots.map(function (s, i) {
            return '<img class="mp-viewer__img' + (i === 0 ? ' is-active' : '') + '" src="' + M.img(s.photo, 1200) + '"' +
              ' alt="' + m.name + (many ? ', фото ' + (i + 1) : '') + '"' + M.posAttr(s) + (i ? ' loading="lazy"' : '') + '>';
          }).join('') +
          UI.topFrameHTML(m) +
        '</button>' +
        (many ? '' +
          '<div class="mp-progress" aria-hidden="true"><span id="mpProgress"></span></div>' +
          '<div class="mp-thumbs" id="mpThumbs" role="tablist" aria-label="Фото модели">' + shots.map(function (s, i) {
            return '<button type="button" class="mp-thumb' + (i === 0 ? ' is-active' : '') + '" role="tab" aria-selected="' + (i === 0) + '"' +
              ' data-shot="' + i + '" aria-label="Фото ' + (i + 1) + '">' +
              '<img src="' + M.img(s.photo, 300) + '" alt=""' + M.posAttr(s) + ' loading="lazy">' +
            '</button>';
          }).join('') + '</div>' : '') +
      '</div>';
  }

  function managerHTML(m) {
    var manager = M.managerOf(m);
    var contacts = [];
    if (manager.phone) contacts.push('<li><a href="' + manager.phoneHref + '"><span>Позвонить</span><b>' + manager.phone + '</b></a></li>');
    if (manager.telegram) contacts.push('<li><a href="' + manager.telegram + '" target="_blank" rel="noopener"><span>Telegram</span><b>' + telegramHandle(manager.telegram) + '</b></a></li>');
    if (manager.whatsapp) contacts.push('<li><a href="' + manager.whatsapp + '" target="_blank" rel="noopener"><span>WhatsApp</span><b>Написать</b></a></li>');
    var cta = manager.telegram || manager.whatsapp || manager.phoneHref;
    return '' +
      '<div class="mp-manager">' +
        '<p class="mp-manager__label">Менеджер модели</p>' +
        '<div class="mp-manager__person">' +
          '<span class="mp-manager__avatar" aria-hidden="true">' + initials(manager.name) + '</span>' +
          '<p class="mp-manager__name">' + manager.name + '</p>' +
        '</div>' +
        '<ul class="mp-contacts">' + contacts.join('') + '</ul>' +
        '<a class="btn btn--dark btn--wide" href="' + cta + '"' + (/^https?:/.test(cta) ? ' target="_blank" rel="noopener"' : '') + '>Запросить модель</a>' +
      '</div>';
  }

  // albumKey — альбом, из которого открыли модель: её родной (девушки/парни) или «Топ-модели»
  function modelHTML(m, shots, albumKey) {
    var album = M.albums[albumKey];
    var models = album.models;
    var total = models.length;
    var index = models.indexOf(m);
    var prev = models[(index - 1 + total) % total];
    var next = models[(index + 1) % total];
    var stats = [['Рост', m.height], ['Грудь', m.bust], ['Талия', m.waist], ['Бёдра', m.hips]].filter(function (s) { return s[1]; });
    var rest = M.details(m).filter(function (p) { return !/^(Рост|Грудь|Талия|Бёдра)$/.test(p[0]); });
    var more = [];
    for (var k = 1; k <= Math.min(4, total - 1); k++) more.push(models[(index + k) % total]);

    return '' +
      '<div class="container">' +
        '<div class="mp-bar">' +
          '<a class="mp-back" id="mpBack" href="' + albumUrl(albumKey) + '"><span aria-hidden="true">←</span> Альбом «' + album.title + '»</a>' +
          (total > 1 ? '' +
          '<div class="mp-nav">' +
            '<span class="mp-nav__count">' + pad(index + 1) + ' / ' + pad(total) + '</span>' +
            '<a class="mp-nav__arrow" href="' + UI.modelUrl(prev, albumKey) + '" data-neighbor aria-label="Предыдущая модель: ' + prev.name + '">←</a>' +
            '<a class="mp-nav__arrow" href="' + UI.modelUrl(next, albumKey) + '" data-neighbor aria-label="Следующая модель: ' + next.name + '">→</a>' +
          '</div>' : '') +
        '</div>' +

        '<div class="mp-main">' +
          viewerHTML(m, shots) +

          '<div class="mp-info">' +
            '<p class="mp-label">' + album.title + ' · № ' + pad(index + 1) + '</p>' +
            '<h1 class="mp-name">' + m.name + '</h1>' +

            (stats.length ? '<dl class="mp-stats">' + stats.map(function (s) {
              return '<div><dt>' + s[0] + '</dt><dd>' + s[1] + '<small>см</small></dd></div>';
            }).join('') + '</dl>' : '') +

            (rest.length ? '<dl class="mp-params">' + rest.map(function (p) {
              return '<div><dt>' + p[0] + '</dt><dd>' + p[1] + '</dd></div>';
            }).join('') + '</dl>' : '') +

            // Параметров ещё нет — не оставляем пустую таблицу
            (stats.length || rest.length ? '' :
              '<p class="mp-note">Параметры уточняются — узнайте их у менеджера.</p>') +

            managerHTML(m) +
          '</div>' +
        '</div>' +

        (more.length ? '' +
          '<section class="mp-section">' +
            '<header class="mp-section__head"><h2>Другие модели</h2><a href="' + albumUrl(albumKey) + '">Весь альбом</a></header>' +
            '<div class="gallery__grid">' + more.map(function (other, i) { return UI.cardHTML(other, i, albumKey); }).join('') + '</div>' +
          '</section>' : '') +
      '</div>';
  }

  if (!model) {
    root.innerHTML = notFoundHTML();
    document.title = 'Модель не найдена — MOOD MODELS';
    return;
  }

  var shots = M.slides(model);
  var albumKey = new URLSearchParams(location.search).get('album') === 'top' && model.top ? 'top' : model.album;
  document.title = model.name + ' — MOOD MODELS';
  root.innerHTML = modelHTML(model, shots, albumKey);

  /* ---------- Фото: главное + миниатюры, автопереключение ---------- */
  var viewerImgs = $$('.mp-viewer__img', root);
  var thumbs = $$('.mp-thumb', root);
  var thumbsRow = $('#mpThumbs');
  var bar = $('#mpProgress');
  var active = 0;
  var timer = null;
  var paused = false;
  var autoplay = shots.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function select(i) {
    active = (i + shots.length) % shots.length;
    viewerImgs.forEach(function (img, n) { img.classList.toggle('is-active', n === active); });
    thumbs.forEach(function (t, n) {
      t.classList.toggle('is-active', n === active);
      t.setAttribute('aria-selected', String(n === active));
    });
    // держим активную миниатюру в видимой части ряда, не прокручивая страницу
    var t = thumbs[active];
    if (t && thumbsRow.scrollWidth > thumbsRow.clientWidth) {
      thumbsRow.scrollTo({ left: t.offsetLeft - (thumbsRow.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
    }
    restart();
  }

  function restart() {
    clearTimeout(timer);
    if (!autoplay) return;
    if (bar) {
      bar.style.animation = 'none';
      void bar.offsetWidth;
      bar.style.animation = paused ? 'none' : '';
    }
    if (!paused) timer = setTimeout(function () { select(active + 1); }, SLIDE_TIME);
  }

  function setPaused(value) {
    if (paused === value) return;
    paused = value;
    restart();
  }

  if (bar) {
    bar.style.setProperty('--shot-time', SLIDE_TIME + 'ms');
    if (!autoplay) bar.parentNode.hidden = true;
  }
  if (thumbsRow) {
    thumbsRow.addEventListener('click', function (e) {
      var t = e.target.closest('[data-shot]');
      if (t) select(+t.dataset.shot);
    });
  }
  // пауза, пока курсор над фото или вкладка скрыта
  var photoBox = $('.mp-photo', root);
  photoBox.addEventListener('mouseenter', function () { setPaused(true); });
  photoBox.addEventListener('mouseleave', function () { setPaused(!lightbox.hidden); });
  document.addEventListener('visibilitychange', function () { setPaused(document.hidden || !lightbox.hidden); });
  restart();

  /* ---------- Навигация ---------- */
  // Пришли из каталога на главной — «← Альбом» работает как кнопка «Назад» браузера
  function cameFromCatalog() {
    try {
      var ref = new URL(document.referrer);
      return ref.origin === location.origin && /\/(index\.html)?$/.test(ref.pathname) && history.length > 1;
    } catch (e) { return false; }
  }

  root.addEventListener('click', function (e) {
    if (e.target.closest('#mpBack') && cameFromCatalog()) {
      e.preventDefault();
      history.back();
      return;
    }
    // соседние модели заменяют запись в истории — «Назад» в браузере ведёт сразу в каталог
    var neighbor = e.target.closest('[data-neighbor]');
    if (neighbor) {
      e.preventDefault();
      location.replace(neighbor.getAttribute('href'));
      return;
    }
    if (e.target.closest('#mpViewer')) openLightbox(active);
  });

  /* ---------- Просмотр фото крупно ---------- */
  var lightbox = $('#lightbox');
  var lightboxImg = $('#lightboxImg');
  var lbIndex = 0;
  var lastFocus = null;

  function showShot(i) {
    lbIndex = (i + shots.length) % shots.length;
    lightboxImg.src = M.img(shots[lbIndex].photo, 1600);
    lightboxImg.alt = model.name + ', фото ' + (lbIndex + 1);
    $('#lightboxCount').textContent = shots.length > 1 ? (lbIndex + 1) + ' / ' + shots.length : '';
    lightbox.classList.toggle('is-single', shots.length < 2);
  }

  function openLightbox(i) {
    lastFocus = document.activeElement;
    showShot(i);
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    setPaused(true);
    $('#lightboxClose').focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    if (shots.length > 1) select(lbIndex); // показываем сверху то фото, на котором закрыли
    setPaused(photoBox.matches(':hover'));
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  $('#lightboxClose').addEventListener('click', closeLightbox);
  $('#lightboxPrev').addEventListener('click', function () { showShot(lbIndex - 1); });
  $('#lightboxNext').addEventListener('click', function () { showShot(lbIndex + 1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox__stage')) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showShot(lbIndex - 1);
    if (e.key === 'ArrowRight') showShot(lbIndex + 1);
    // Tab ходит по кнопкам окна по кругу и не уходит на страницу под ним
    if (e.key === 'Tab') {
      var items = $$('button', lightbox).filter(function (b) { return getComputedStyle(b).visibility !== 'hidden'; });
      var first = items[0], last = items[items.length - 1];
      var inside = lightbox.contains(document.activeElement);
      if (!inside || (e.shiftKey && document.activeElement === first)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
