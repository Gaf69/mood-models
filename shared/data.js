/*
 * Данные сайта: модели, менеджеры, кадры шапки, фото «Стать моделью», новости.
 *
 * Модель:
 *   name    — имя на карточке; из него же собирается адрес страницы (model.html?id=dilnoza).
 *             Можно задать адрес вручную полем id: 'dilnoza'.
 *   Топ-модели задаются списком TOP ниже (порядок = порядок во вкладке, фото в золотой рамке).
 *   photo   — главное фото (лучше кадр 3:4): own('имя') — личные фото из assets/models,
 *             card('имя') — кадры с показа из assets/cards, или ID фото с Unsplash (заглушка).
 *             Нет фото — вместо него заглушка «Фото скоро».
 *   photos  — дополнительные фото: на странице модели они идут миниатюрами под главным
 *             и листаются сами каждые 3 секунды. Можно не указывать.
 *   pos     — необязательно: какую часть фото показывать при обрезке (CSS object-position),
 *             например '50% 60%' — центр, чуть ниже середины.
 *   height, bust, waist, hips — рост и обхваты в см (можно диапазоном: '175–176');
 *   shoes — размер обуви, size — размер одежды, weight — вес в кг, hair/eyes — цвет волос и глаз;
 *   more  — любые другие параметры списком: [['Плечи', '50 см'], ...].
 *   Не указанные поля просто не показываются.
 */
(function () {
  function img(src, w) {
    if (!src) return '';
    if (/^(\.|\/|https?:)/.test(src)) return src;
    return 'https://images.unsplash.com/photo-' + src + '?auto=format&fit=crop&q=75&w=' + (w || 800);
  }

  // Атрибут style с точкой фокуса для <img> (пусто, если pos не задан)
  function posAttr(item) {
    return item && item.pos ? ' style="object-position:' + item.pos + '"' : '';
  }

  function asset(name) { return '../assets/' + name; }
  function card(name) { return '../assets/cards/' + name + '.jpg'; }
  // Личные фото моделей (студийные съёмки) — папка assets/models
  function own(name) { return '../assets/models/' + name + '.jpg'; }
  function tfw(n) { return asset('photo_' + n + '_2026-10-10_14-46-' + (n < 4 ? '47' : '48') + '.jpg'); }

  // Фото с показа (первая партия): photo — полный кадр, card — кадрированная копия 3:4
  function runway(n, pos) {
    return {
      photo: asset('photo_' + n + '_2026-10-10_14-12-23.jpg'),
      pos: pos,
      card: card('runway-' + n)
    };
  }
  var RUNWAY = {
    1: runway(1, '58% 60%'),
    2: runway(2, '56% 55%'),
    3: runway(3, '45% 70%'),
    4: runway(4, '50% 55%'),
    5: runway(5, '56% 55%'),
    6: runway(6, '40% 72%')
  };

  // Менеджер моделей. У модели можно указать своего: manager: { name: ..., phone: ..., ... }
  var manager = {
    name: 'Гафуров Аминджон',
    phone: '+992 93 353 4040',
    phoneHref: 'tel:+992933534040',
    telegram: 'https://t.me/Fashiongrouptz',
    whatsapp: 'https://wa.me/992933534040'
  };

  // Модели и их параметры — от агентства. Личные фото (own) — настоящие, от агентства;
  // у моделей с card()/tfw()/RUNWAY фото пока подобраны наугад — замените, когда будут свои.
  // Без photo вместо фото показывается заглушка «Фото скоро».
  var women = [
    { name: 'Дилноза',          photo: card('tfw-27'), photos: [tfw(27)],        height: 176, bust: 85, waist: 55, hips: 90 },
    { name: 'Муродова Мастура', photo: own('mastura-gold'), photos: [own('mastura-veil'), own('mastura-t23')], height: 180, bust: 95, waist: 75, hips: 104 },
    { name: 'Фатима Эльфадил',  photo: own('fatima-runway'), photos: [own('fatima-studio'), own('fatima-smile'), own('fatima-t14'), own('fatima-t35')], height: '175–176', bust: 87, waist: 67, hips: 106 },
    { name: 'Инара',            photo: own('inara-white'), photos: [own('inara-coat'), own('inara-t24'), own('inara-t16')], height: 175, bust: 85, waist: 75, hips: 95 },
    { name: 'Фарануш',          height: 183, size: 'L–XL', more: [['Размер джинсов', '34']] },
    { name: 'Ciella (Cici)',    photo: own('cici-studio'), photos: [own('cici-wall'), own('cici-t11')], height: 175, bust: 91, waist: 67, hips: 107, shoes: '40–41' },
    { name: 'София',            photo: card('tfw-25'), photos: [tfw(25)],        bust: 85, waist: 64, hips: 90, more: [
      ['До груди', '24 см'], ['До талии', '40 см'], ['Сзади до талии', '38 см'], ['Юбка', '106 см'],
      ['Плечи', '33 см'], ['Сзади', '35 см'], ['Вверх плеча', '11 см'], ['Длина рукава', '59 см']
    ] },
    { name: 'Минира',           photo: own('minira-1'), photos: [own('minira-2')], height: 175, bust: 90, waist: 74, hips: 98 },
    { name: 'Бону Саиди',       photo: own('bonu-1'), photos: [own('bonu-2'), own('bonu-3')], height: 176, bust: 90, waist: 68, hips: 95 },
    { name: 'Ясмина',           photo: own('yasmina-1'), photos: [own('yasmina-2'), own('yasmina-3'), own('yasmina-t40')], height: 170, bust: 81, waist: 67, hips: 95 },
    { name: 'Азиза',            photo: own('aziza-1'), photos: [own('aziza-2'), own('aziza-3')], height: 170, bust: 78, waist: 60, hips: 85 },
    { name: 'Мавзуна',          photo: RUNWAY[2].card, photos: [RUNWAY[2]],      height: '170–172', bust: 85, waist: 61, hips: 90, shoes: 38, weight: 50 },
    { name: 'Аиша',             photo: own('aisha-1'), photos: [own('aisha-2'), own('aisha-3'), own('aisha-t6'), own('aisha-s4512')], height: 170, bust: 85, waist: 63, hips: 97 },
    { name: 'Малика',           photo: own('malika-1'), photos: [own('malika-2'), own('malika-3'), own('malika-t29')], height: 176, bust: 80, waist: 59, hips: 85 },
    // Параметры этих моделей агентство ещё не прислало
    { name: 'Фарангиз',         photo: own('farangiz-1'), photos: [own('farangiz-2'), own('farangiz-3')] },
    { name: 'Аразия',           photo: own('arazia-1'),   photos: [own('arazia-2'), own('arazia-3'), own('arazia-t5'), own('arazia-t31')] },
    { name: 'Шабнам',           photo: own('shabnam-1'),  photos: [own('shabnam-2'), own('shabnam-3')] },
    { name: 'Фируза',           photo: own('firuza-1'),   photos: [own('firuza-2'), own('firuza-3')] },
    { name: 'Паймона',          photo: own('paymona-1'),  photos: [own('paymona-2')] },
    { name: 'Нигина',           photo: own('nigina-1'),   photos: [own('nigina-2')] },
    { name: 'Нилгуна',          photo: own('nilguna-1'),  photos: [own('nilguna-2'), own('nilguna-3')] },
    { name: 'Мусавира',         photo: own('musavira-1'), photos: [own('musavira-2')] },
    { name: 'Оиша',             photo: own('oisha-1'),    photos: [own('oisha-2'), own('oisha-3'), own('oisha-t18')] },
    { name: 'Самира' }
  ];

  var men = [
    { name: 'Сиёвуш',   photo: own('siyovush-portrait'),
      photos: [{ photo: own('siyovush-color'), pos: '50% 15%' }, { photo: own('siyovush-full'), pos: '50% 18%' }], height: 198, bust: 111, waist: 97, hips: 120 },
    { name: 'Мухаммад', photo: RUNWAY[4].card, photos: [RUNWAY[6].card], height: 184, weight: 79 },
    { name: 'Дилшод',   photo: own('dilshod-1'), photos: [own('dilshod-2')], height: 192, weight: 74, size: '54–56', shoes: 45 },
    { name: 'Фариз',    photo: RUNWAY[3].card, photos: [RUNWAY[3]],      height: 189, weight: 82, bust: 97, waist: 77, hips: 100, more: [['Обхват плеч', '114 см']] }
  ];

  // Кадры для фона шапки — ч/б копии из assets/hero. Слайдшоу показывает их тройками.
  function heroFrame(n) {
    return '../assets/hero/hero-' + (n < 10 ? '0' : '') + n + '.jpg';
  }
  var hero = [
    { photo: heroFrame(1) },
    { photo: heroFrame(2) },
    { photo: heroFrame(3) },
    { photo: heroFrame(4) },
    { photo: heroFrame(5), pos: RUNWAY[1].pos },
    { photo: heroFrame(6) },
    { photo: heroFrame(7) },
    { photo: heroFrame(8), pos: RUNWAY[5].pos },
    { photo: heroFrame(9) },
    { photo: heroFrame(10), pos: '35% 30%' },
    { photo: heroFrame(11), pos: RUNWAY[4].pos },
    { photo: heroFrame(12) }
  ];

  // Фото для секции «Стать моделью»
  var casting = RUNWAY[6];

  // Новости. Первая новость — крупная. date — в формате ГГГГ-ММ-ДД.
  // url — куда ведёт карточка (раздел сайта или статья); без url карточка просто показывается.
  var news = [
    {
      date: '2026-10-09',
      tag: 'Анонс',
      title: 'Tajikistan Fashion Week: 16‑й сезон — 27, 28 и 29 ноября',
      text: 'Готовимся к главной неделе моды Таджикистана. Три дня показов, новые коллекции дизайнеров — скоро расскажем, на каких показах выйдут модели MOOD MODELS.',
      photo: tfw(1),
      pos: '30% 50%'
    },
    {
      date: '2026-10-05',
      tag: 'Кастинг',
      title: 'Открытый кастинг: ищем новые лица',
      text: 'Ждём девушек от 172 см и парней от 183 см. Опыт не обязателен.',
      photo: RUNWAY[3].card,
      url: '#casting'
    },
    {
      date: '2026-09-30',
      tag: 'Показы',
      title: 'Лучшие кадры с подиума Tajikistan Fashion Week',
      text: 'Собрали самые яркие образы наших моделей с недели моды.',
      photo: tfw(27),
      pos: '45% 20%'
    },
    {
      date: '2026-09-21',
      tag: 'Агентство',
      title: 'Новые лица в альбоме агентства',
      text: 'Знакомьтесь с моделями, которые присоединились к MOOD MODELS этой осенью.',
      photo: RUNWAY[2].card,
      url: '#models'
    }
  ];

  function filled(p) { return p[1] !== undefined && p[1] !== null && p[1] !== ''; }

  // Короткие параметры для карточек (только заполненные)
  function params(m) {
    return [
      ['Рост', m.height],
      ['Грудь', m.bust],
      ['Талия', m.waist],
      ['Бёдра', m.hips],
      ['Обувь', m.shoes]
    ].filter(filled);
  }

  // Развёрнутые параметры для страницы модели (пустые поля пропускаются)
  function details(m) {
    var cm = function (v) { return filled([0, v]) ? v + ' см' : ''; };
    return [
      ['Рост', cm(m.height)],
      ['Грудь', cm(m.bust)],
      ['Талия', cm(m.waist)],
      ['Бёдра', cm(m.hips)],
      ['Размер обуви', filled([0, m.shoes]) ? m.shoes + ' EU' : ''],
      ['Размер одежды', m.size],
      ['Вес', filled([0, m.weight]) ? m.weight + ' кг' : ''],
      ['Цвет волос', m.hair],
      ['Цвет глаз', m.eyes]
    ].concat(m.more || []).filter(filled);
  }

  // 1 модель, 2 модели, 5 моделей
  function plural(n, forms) {
    var a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return forms[0];
    if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return forms[1];
    return forms[2];
  }

  function countLabel(n) {
    return n + ' ' + plural(n, ['модель', 'модели', 'моделей']);
  }

  // Адрес страницы модели из имени: «Алиса К.» -> alisa-k
  var TRANSLIT = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l',
    м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh',
    щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
  };
  function slugify(text) {
    return text.toLowerCase().split('').map(function (ch) {
      return TRANSLIT.hasOwnProperty(ch) ? TRANSLIT[ch] : ch;
    }).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // «Топ-модели» — подборка из девушек и парней с top: true (заполняется ниже)
  var albums = {
    top: { key: 'top', title: 'Топ-модели', models: [], manager: manager },
    women: { key: 'women', title: 'Девушки', models: women, manager: manager },
    men: { key: 'men', title: 'Парни', models: men, manager: manager }
  };
  var ALBUM_ORDER = ['top', 'women', 'men'];

  // Каждой модели — уникальный id, родной альбом (девушки/парни) и порядковый номер в нём
  var byId = {};
  ['women', 'men'].forEach(function (key) {
    albums[key].models.forEach(function (m, i) {
      var base = m.id || slugify(m.name) || key + '-' + (i + 1);
      var id = base, n = 2;
      while (byId[id]) id = base + '-' + n++;
      m.id = id;
      m.album = key;
      m.index = i;
      byId[id] = m;
    });
  });
  // «Топ-модели» — в этом порядке (имена как в списках выше). У них золотая рамка на фото.
  var TOP = ['Мавзуна', 'Дилноза', 'Оиша', 'Муродова Мастура', 'Паймона', 'София', 'Самира', 'Фариз', 'Фарануш', 'Инара'];
  TOP.forEach(function (name) {
    var m = women.concat(men).filter(function (x) { return x.name === name; })[0];
    if (!m) { if (window.console) console.warn('MOOD: в топе есть «' + name + '», но такой модели нет в списках'); return; }
    m.top = true;
    albums.top.models.push(m);
  });

  // Все фото модели по порядку: главное + дополнительные, в виде { photo, pos } (пусто — если фото нет)
  function slides(m) {
    return [{ photo: m.photo, pos: m.pos }].concat((m.photos || []).map(function (p) {
      return typeof p === 'string' ? { photo: p } : { photo: p.photo, pos: p.pos };
    })).filter(function (s) { return s.photo; });
  }

  window.MOOD = {
    img: img,
    posAttr: posAttr,
    params: params,
    details: details,
    slides: slides,
    countLabel: countLabel,
    albums: albums,
    albumOrder: ALBUM_ORDER,
    findModel: function (id) { return byId.hasOwnProperty(id) ? byId[id] : null; },
    managerOf: function (m) { return m.manager || albums[m.album].manager; },
    hero: hero,
    casting: casting,
    news: news
  };
})();
