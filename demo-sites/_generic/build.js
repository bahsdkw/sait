// Генератор демо-сайтов: node build.js  -> demo-sites/<slug>/index.html
// Данные только из публичных карточек (Zoon / Яндекс.Карты), ничего не выдумано.
const fs = require('fs'), path = require('path');
const leads = [
 { slug:'molcha', name:'Массажный салон «Молча»', tag:'Массаж по записи · м. Рижская', color:'#4f7d6a',
   lead:'Классический, спортивный, лимфодренажный и антистрессовый массаж. Опытный специалист — 10 лет практики.',
   address:'Москва, Напрудный пер., 8с1', hours:'Ежедневно 10:00–23:00, по предварительной записи',
   phone:'+7 985 884-24-34', wa:'79858842434', tg:'+79858842434', vk:'https://vk.com/molchamassage',
   services:[['Классический массаж','3 500 ₽'],['Спортивный массаж','4 000 ₽'],['Лимфодренажный массаж','3 500 ₽'],['Антицеллюлитный массаж','3 500 ₽'],['Восстановительный массаж','3 500 ₽'],['Медовый массаж','4 000 ₽'],['Антистрессовый массаж','5 000 ₽'],['Массаж спины (40 мин)','3 000 ₽'],['Массаж лица','2 000 ₽']],
   extra:['Скидка 20%','Приведи друга — скидка','Оплата: наличные или перевод на карту'], cta:'Записаться на массаж' },
 { slug:'myshtsy', name:'Массажный кабинет «Мышцы уже записались»', tag:'Массаж · м. Окская', color:'#c4562f',
   lead:'Массажный кабинет в Рязанском районе. Работаем каждый день, запись по телефону.',
   address:'Москва, ул. Михайлова, 31а, 2 этаж, кабинет 10', hours:'Ежедневно 10:00–22:00',
   phone:'+7 951 760-44-92', wa:'79517604492', tg:null, vk:null, services:null, cta:'Записаться по телефону' },
 { slug:'funfit', name:'FunFit', tag:'Студия функционального тренинга · м. Менделеевская', color:'#e0483f',
   lead:'Функциональные тренировки, фитнес для женщин, занятия для беременных, персональные тренировки.',
   address:'Москва, Сущёвская ул., 29', hours:null,
   phone:'+7 916 755-22-22', wa:'79167552222', tg:null, vk:'https://vk.com/funfitme',
   services:[['Персональные тренировки','по запросу'],['Женский фитнес','по запросу'],['Занятия для беременных','по запросу'],['Функциональный тренинг','по запросу']], cta:'Записаться на пробное' },
 { slug:'spa-indiya', name:'СПА Индия', tag:'Массажный салон · м. Улица 1905 года', color:'#b8892b',
   lead:'Массажный салон на Шмитовском проезде. Техника подбирается индивидуально: с учётом типа кожи, противопоказаний и ваших пожеланий.',
   address:'Москва, Шмитовский пр., 3с1', hours:null,
   phone:'+7 961 764-91-51', wa:'79617649151', tg:null, vk:null, services:null, cta:'Записаться на массаж' },
 { slug:'pilates-mitino', name:'Студия пилатеса в Митино', tag:'Индивидуальные занятия · по записи', color:'#6d5aa6',
   lead:'Индивидуальные тренировки по пилатесу с тренером. Есть пандус. Запись по предварительной договорённости.',
   address:'Москва, Муравская ул., 46к3', hours:'Ежедневно 09:00–21:00, по предварительной записи',
   phone:'+7 915 241-87-23', wa:'79152418723', tg:'+79152418723', vk:null,
   services:[['Вводная тренировка','2 000 ₽'],['Стартовая индивидуальная тренировка','3 500 ₽'],['Индивидуальная тренировка с тренером','4 250 ₽'],['Сплит-тренировка','7 000 ₽']],
   extra:['Оплата: наличные или перевод на карту'], cta:'Записаться на вводную' },
 { slug:'m-studio', name:'M_Studio', tag:'Ногтевая студия · м. Preobrazhenskaya pl.'.replace('Preobrazhenskaya pl.','Уральская ул.'), color:'#d1457a',
   lead:'Маникюр и педикюр, наращивание. «Good place 2026» на Яндекс Картах: 4,9 по 1 586 оценкам.',
   address:'Москва, Уральская ул., 6к1', hours:'Работаем до 23:00, запись обязательна',
   phone:'+7 499 288-24-13', wa:'79264682228', tg:null, vk:null,
   services:[['Маникюр с покрытием (быстросохнущий лак)','1 500 ₽'],['Классический маникюр с покрытием','1 500–2 400 ₽'],['SMART-педикюр','2 450 ₽'],['Аппаратный педикюр (комбо «Шальная императрица», BEAUTIX)','2 000 ₽']],
   extra:['Наращивание ногтей','Оплата картой'], cta:'Записаться онлайн' },
 { slug:'minimal', name:'Minimal', tag:'Барбершоп · Мясницкая ул.', color:'#1f2933',
   lead:'Барбершоп в центре Москвы. 5,0 на Яндекс Картах (77 оценок), «Good place 2026».',
   address:'Москва, Мясницкая ул., 22с1', hours:'Работаем до 22:00, запись обязательна',
   phone:'+7 925 601-01-11', wa:'79256010111', tg:'+79096561280', vk:null,
   services:[['Мужская стрижка','от 2 000 ₽'],['Стрижка ПАПА+СЫН (2 ч)','5 400 ₽'],['Моделирование бороды (30 мин)','2 500 ₽'],['Камуфляж седины (1 ч)','2 000 ₽']],
   extra:['−20% новым клиентам по коду «МИНИМАЛ25»','Подарочные сертификаты','Выезд на дом, детские стрижки','Оплата: наличные, карта, QR'], cta:'Записаться' },
 { slug:'nava-avto', name:'Nava-Avto', tag:'Шиномонтаж · развал-схождение · полировка · м. Студёный пр.', color:'#0f6fb3',
   lead:'Развал-схождение, балансировка колёс, шиномонтаж, полировка кузова. Гарантия на работы.',
   address:'Москва, Студёный пр., 7Б', hours:'Работаем до 21:00, запись заранее',
   phone:'+7 903 798-21-32', wa:'79037982132', tg:'NAVA-AUTO', vk:null,
   services:[['Глубокая полировка кузова','от 20 000 ₽'],['Лёгкая полировка кузова','от 10 000 ₽'],['«Детейлинг»: полировка, химчистка салона, керамика','25 000 ₽']],
   extra:['Развал-схождение','Балансировка колёс','Оплата: наличные, карта, перевод, QR'], cta:'Записаться на шиномонтаж' },
 { slug:'run-computer', name:'Run Computer', tag:'Ремонт компьютеров · м. Молодёжная', color:'#2563eb',
   lead:'Сервисный центр по ремонту компьютеров в Кунцево. Рейтинг 4,7 на Zoon по 43 оценкам.',
   address:'Москва, Рублёвское ш., 22к1', hours:null,
   phone:'+7 495 134-82-12', wa:'74951348212', tg:null, vk:null, services:null, cta:'Оставить заявку на ремонт' },
 { slug:'eko-klining', name:'Эко-клининг', tag:'Клининговая компания · Раменки', color:'#16a34a',
   lead:'Клининговая компания в Раменках. Уборка квартир и офисов, заявка по телефону.',
   address:'Москва, ул. Столетова, 7', hours:null,
   phone:'+7 495 223-33-77', wa:'74952233377', tg:null, vk:null, services:null, cta:'Заказать уборку' },
 { slug:'mobilnyj-shinomontazh', name:'Мобильный шиномонтаж', tag:'Выездной шиномонтаж · Пресненский р-н', color:'#ea580c',
   lead:'Выездной шиномонтаж: приедем к вам. Заказ по телефону.',
   address:'Москва, Б. Грузинская ул., 2/12 стр. 1', hours:null,
   phone:'+7 985 741-68-50', wa:'79857416850', tg:null, vk:null, services:null, cta:'Вызвать шиномонтаж' },
 { slug:'shinnyj-otel', name:'Шинный Отель', tag:'Шиномонтаж и хранение шин · м. Серпуховская', color:'#0e7490',
   lead:'Шиномонтаж и сезонное хранение шин у метро Серпуховская. Рейтинг 4,2 на Zoon по 16 оценкам.',
   address:'Москва, Жуков пр., 19', hours:null,
   phone:'+7 967 234-28-97', wa:'79672342897', tg:null, vk:null, services:null, cta:'Записаться на шиномонтаж' },
 { slug:'zamochnaya-sluzhba', name:'Городская замочная служба', tag:'Вскрытие и замена замков · Даниловский р-н', color:'#92400e',
   lead:'Вскрытие замков и замена. 4,9 на Zoon по 177 оценкам, 30 отзывов.',
   address:'Москва, ул. Ленинская Слобода, 19с1', hours:null,
   phone:'+7 495 223-15-58', wa:'79267472375', tg:null, vk:null, services:null, cta:'Вызвать мастера' },
];
const badges = {
 'molcha':['10 лет опыта специалиста','Ежедневно 10:00–23:00','м. Рижская'],
 'myshtsy':['Ежедневно 10:00–22:00','м. Окская'],
 'funfit':['м. Менделеевская','Персональные и групповые форматы'],
 'spa-indiya':['м. Улица 1905 года','Подбор техники индивидуально'],
 'pilates-mitino':['Ежедневно 09:00–21:00','Есть пандус','Индивидуально с тренером'],
 'm-studio':['★ 4,9 · 1 042 отзыва','Good place 2026','Онлайн-запись'],
 'minimal':['★ 5,0 · 68 отзывов','Good place 2026','−20% новым клиентам'],
 'nava-avto':['Гарантия на работы','Работаем до 21:00','Запись заранее'],
 'run-computer':['★ 4,7 · 43 оценки','м. Молодёжная'],
 'eko-klining':['Раменки, ЗАО','Заказ по телефону'],
 'mobilnyj-shinomontazh':['Выезд к вам','Заказ по телефону'],
 'shinnyj-otel':['★ 4,2 · 16 оценок','Хранение шин','м. Серпуховская'],
 'zamochnaya-sluzhba':['★ 4,9 · 177 оценок','30 отзывов','Даниловский р-н'],
};
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const ico = {
 phone:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
 pin:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
 clock:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
 check:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
 chat:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
};
for (const l of leads) {
  const q = encodeURIComponent(l.address);
  const tel = l.phone.replace(/[^+\d]/g,'');
  const tgLink = l.tg ? `https://t.me/${l.tg}` : null;
  const bs = badges[l.slug]||[];
  const pts = l.extra && l.extra.length ? l.extra : null;
  const mapUrl = `https://yandex.ru/maps/?text=${q}`;
  const ld = {"@context":"https://schema.org","@type":"LocalBusiness",name:l.name,telephone:l.phone,
    address:{"@type":"PostalAddress",streetAddress:l.address.replace('Москва, ',''),addressLocality:'Москва',addressCountry:'RU'}};
  const html = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(l.name)} — ${esc(l.tag.split(' · ')[0])}, Москва</title>
<meta name="description" content="${esc(l.lead)}">
<meta name="theme-color" content="${l.color}">
<meta property="og:title" content="${esc(l.name)}"><meta property="og:description" content="${esc(l.lead)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>
:root{--c:${l.color};--bg:#f6f5f2;--tx:#17171a;--mut:#62626b;--card:#fff;--line:rgba(20,20,30,.1)}
@media(prefers-color-scheme:dark){:root{--bg:#121214;--tx:#f3f3f1;--mut:#a4a4ad;--card:#1c1c20;--line:rgba(255,255,255,.12)}}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font:16px/1.6 Manrope,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--tx);padding-bottom:76px}
.w{max-width:880px;margin:0 auto;padding:0 20px}
.top{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.top .w{display:flex;align-items:center;justify-content:space-between;height:60px;gap:12px}
.logo{font-weight:800;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.logo i{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--c);margin-right:8px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:13px 20px;border-radius:12px;font-weight:800;text-decoration:none;font-size:15px;border:2px solid transparent;transition:transform .15s,box-shadow .15s}
.btn:hover{transform:translateY(-1px)}
.btn.p{background:var(--c);color:#fff;box-shadow:0 8px 22px -8px var(--c)}
.btn.s{background:transparent;color:inherit;border-color:var(--line)}
.top .btn{padding:9px 14px;font-size:14px}
.hero{position:relative;overflow:hidden;color:#fff;background:linear-gradient(135deg,var(--c),color-mix(in srgb,var(--c) 45%,#0b0b0f));padding:64px 0 56px}
.hero:before,.hero:after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.1)}
.hero:before{width:360px;height:360px;right:-120px;top:-140px}.hero:after{width:220px;height:220px;right:60px;bottom:-130px;background:rgba(255,255,255,.07)}
.hero .w{position:relative}
.kicker{font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;opacity:.85;margin:0 0 14px}
h1{margin:0 0 16px;font-size:clamp(32px,7.5vw,56px);line-height:1.05;letter-spacing:-.03em;font-weight:800;max-width:15em}
.lead{max-width:34em;font-size:18px;opacity:.93;margin:0 0 24px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 28px}
.chip{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.25);padding:6px 12px;border-radius:99px;font-size:14px;font-weight:600}
.hero .btn.p{background:#fff;color:#111;box-shadow:0 10px 30px -10px rgba(0,0,0,.5)}
.hero .btn.s{color:#fff;border-color:rgba(255,255,255,.5)}
.cta{display:flex;flex-wrap:wrap;gap:10px}
section{padding:44px 0 4px}
h2{margin:0 0 6px;font-size:28px;letter-spacing:-.02em;font-weight:800}
.sub{margin:0 0 20px;color:var(--mut)}
.grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px}
.svc{display:flex;flex-direction:column;justify-content:space-between;gap:14px;min-height:112px}
.svc b{font-size:20px;color:var(--c);letter-spacing:-.01em}
.svc span{font-weight:600}
.note{font-size:13px;color:var(--mut);margin-top:12px}
.pts{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));margin-top:14px}
.pt{display:flex;gap:10px;align-items:flex-start;font-weight:600}
.pt svg{flex:none;margin-top:3px;color:#fff;background:var(--c);border-radius:50%;padding:3px;width:22px;height:22px}
.steps{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));counter-reset:s}
.step{counter-increment:s}.step:before{content:counter(s);display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:var(--c);color:#fff;font-weight:800;margin-bottom:12px}
.step b{display:block;margin-bottom:2px}.step span{color:var(--mut);font-size:15px}
.ct{display:grid;gap:14px}.ci{display:flex;gap:12px;align-items:flex-start}.ci svg{flex:none;color:var(--c);margin-top:3px}
.ci small{display:block;color:var(--mut)}a{color:inherit}.ci a{font-weight:700}
.bar{position:fixed;left:0;right:0;bottom:0;z-index:30;display:flex;gap:10px;padding:10px 14px calc(10px + env(safe-area-inset-bottom,0));background:var(--card);border-top:1px solid var(--line)}
.bar .btn{flex:1;justify-content:center}
@media(min-width:760px){.bar{display:none}body{padding-bottom:0}}
footer{padding:44px 0 40px;color:var(--mut);font-size:13px}
.rv{opacity:0;transform:translateY(14px);transition:opacity .5s,transform .5s}.rv.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.rv{opacity:1;transform:none;transition:none}html{scroll-behavior:auto}}
</style></head><body>
<div class="top"><div class="w"><div class="logo"><i></i>${esc(l.name)}</div><a class="btn p" href="tel:${tel}">${ico.phone}${esc(l.phone)}</a></div></div>
<header class="hero"><div class="w">
<p class="kicker">${esc(l.tag)}</p><h1>${esc(l.name)}</h1><p class="lead">${esc(l.lead)}</p>
<div class="chips">${bs.map(b=>`<span class="chip">${esc(b)}</span>`).join('')}</div>
<div class="cta"><a class="btn p" href="tel:${tel}">${ico.phone}${esc(l.cta)}</a><a class="btn s" href="https://wa.me/${l.wa}">${ico.chat}WhatsApp</a>${tgLink?`<a class="btn s" href="${tgLink}">${ico.chat}Telegram</a>`:''}</div>
</div></header>
<main class="w">
${l.services?`<section class="rv"><h2>Услуги и цены</h2><p class="sub">Актуальную стоимость уточним при записи.</p>
<div class="grid">${l.services.map(s=>`<div class="card svc"><span>${esc(s[0])}</span><b>${esc(s[1])}</b></div>`).join('')}</div>
${pts?`<div class="pts">${pts.map(e=>`<div class="pt">${ico.check}<span>${esc(e)}</span></div>`).join('')}</div>`:''}</section>`
:`<section class="rv"><h2>Услуги и цены</h2><p class="sub">Расскажем об услугах и назовём стоимость по телефону или в мессенджере.</p>
<div class="card"><a class="btn p" href="tel:${tel}">${ico.phone}Узнать цену: ${esc(l.phone)}</a></div></section>`}
<section class="rv"><h2>Как записаться</h2><p class="sub">Три простых шага.</p><div class="steps">
<div class="card step"><b>Позвоните или напишите</b><span>Телефон или WhatsApp — как вам удобнее.</span></div>
<div class="card step"><b>Согласуем детали</b><span>Подберём услугу и удобное время.</span></div>
<div class="card step"><b>Приходите</b><span>Ждём вас по адресу: ${esc(l.address.replace('Москва, ',''))}.</span></div></div></section>
<section class="rv" id="contacts"><h2>Контакты</h2><p class="sub">Мы в Москве — приезжайте или напишите заранее.</p><div class="card ct">
<div class="ci">${ico.pin}<div><a href="${mapUrl}">${esc(l.address)}</a><small>Открыть на карте</small></div></div>
${l.hours?`<div class="ci">${ico.clock}<div><b>${esc(l.hours)}</b></div></div>`:''}
<div class="ci">${ico.phone}<div><a href="tel:${tel}">${esc(l.phone)}</a><small>Звонок или WhatsApp</small></div></div>
${l.vk?`<div class="ci">${ico.chat}<div><a href="${l.vk}">ВКонтакте</a><small>${esc(l.vk.replace('https://',''))}</small></div></div>`:''}
<div class="cta"><a class="btn p" href="tel:${tel}">${ico.phone}${esc(l.cta)}</a><a class="btn s" href="${mapUrl}">${ico.pin}Построить маршрут</a></div></div></section>
</main>
<footer><div class="w">Демо-версия сайта. Данные взяты из публичных карточек организации и будут уточнены с владельцем перед публикацией.</div></footer>
<div class="bar"><a class="btn p" href="tel:${tel}">${ico.phone}Позвонить</a><a class="btn s" href="https://wa.me/${l.wa}">${ico.chat}WhatsApp</a></div>
<script>const o=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');o.unobserve(x.target)}}),{threshold:.1});document.querySelectorAll('.rv').forEach(e=>o.observe(e));</script>
</body></html>`;
  fs.mkdirSync(path.join(__dirname,l.slug),{recursive:true});
  fs.writeFileSync(path.join(__dirname,l.slug,'index.html'),html);
}
const idx = `<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Демо-сайты</title><body style="font:16px/1.6 system-ui;max-width:640px;margin:32px auto;padding:0 16px"><h1>Демо-сайты</h1><ul>${leads.map(l=>`<li><a href="${l.slug}/">${esc(l.name)}</a></li>`).join('')}</ul>`;
fs.writeFileSync(path.join(__dirname,'index.html'),idx);
console.log('built',leads.length);
