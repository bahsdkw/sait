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
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
for (const l of leads) {
  const q = encodeURIComponent(l.address);
  const tel = l.phone.replace(/[^+\d]/g,'');
  const tgLink = l.tg ? (l.tg.startsWith('+')?`https://t.me/${l.tg}`:`https://t.me/${l.tg}`) : null;
  const html = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(l.name)} — ${esc(l.tag.split(' · ')[0])} в Москве</title>
<meta name="description" content="${esc(l.lead)}">
<style>
:root{--c:${l.color};--bg:#fafaf8;--tx:#1d1d1b;--mut:#6b6b66;--card:#fff}
@media(prefers-color-scheme:dark){:root{--bg:#161615;--tx:#f1f1ee;--mut:#a3a39d;--card:#222221}}
*{box-sizing:border-box}body{margin:0;font:16px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--tx)}
.w{max-width:760px;margin:0 auto;padding:0 16px}
header.h{background:var(--c);color:#fff;padding:56px 0 48px}
header.h h1{margin:0 0 8px;font-size:clamp(28px,6vw,44px);line-height:1.15}
header.h p{margin:0 0 6px;opacity:.92}.tag{font-size:14px;opacity:.85;margin-bottom:12px!important}
.btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.b{display:inline-block;padding:13px 20px;border-radius:10px;font-weight:600;text-decoration:none;background:#fff;color:#111}
.b.o{background:transparent;color:#fff;border:2px solid #fff}
section{padding:32px 0}h2{margin:0 0 14px;font-size:24px}
.row{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid rgba(128,128,128,.25)}
.row b{white-space:nowrap;color:var(--c)}
ul.x{padding-left:20px;color:var(--mut)}.card{background:var(--card);border-radius:12px;padding:18px;border:1px solid rgba(128,128,128,.2)}
.card p{margin:6px 0}a{color:var(--c)}footer{padding:24px 0 40px;color:var(--mut);font-size:13px}
</style></head><body>
<header class="h"><div class="w">
<p class="tag">${esc(l.tag)}</p><h1>${esc(l.name)}</h1><p>${esc(l.lead)}</p>
<div class="btns"><a class="b" href="tel:${tel}">Позвонить ${esc(l.phone)}</a><a class="b o" href="https://wa.me/${l.wa}">WhatsApp</a>${tgLink?`<a class="b o" href="${tgLink}">Telegram</a>`:''}</div>
</div></header>
<main class="w">
${l.services?`<section><h2>Услуги и цены</h2>${l.services.map(s=>`<div class="row"><span>${esc(s[0])}</span><b>${esc(s[1])}</b></div>`).join('')}
<p style="color:var(--mut);font-size:13px">Цены ориентировочные, уточняйте при записи.</p>${l.extra?`<ul class="x">${l.extra.map(e=>`<li>${esc(e)}</li>`).join('')}</ul>`:''}</section>`:''}
<section><h2>Контакты</h2><div class="card">
<p><b>Адрес:</b> ${esc(l.address)} · <a href="https://yandex.ru/maps/?text=${q}">на карте</a></p>
${l.hours?`<p><b>Режим работы:</b> ${esc(l.hours)}</p>`:''}
<p><b>Телефон:</b> <a href="tel:${tel}">${esc(l.phone)}</a></p>
${l.vk?`<p><b>ВКонтакте:</b> <a href="${l.vk}">${esc(l.vk.replace('https://',''))}</a></p>`:''}
<div class="btns"><a class="b" style="background:var(--c);color:#fff" href="tel:${tel}">${esc(l.cta)}</a></div></div></section>
</main>
<footer><div class="w">Демо-версия сайта. Данные взяты из публичных карточек организации; перед публикацией будут уточнены с владельцем.</div></footer>
</body></html>`;
  fs.mkdirSync(path.join(__dirname,l.slug),{recursive:true});
  fs.writeFileSync(path.join(__dirname,l.slug,'index.html'),html);
}
fs.writeFileSync(path.join(__dirname,'index.html'),`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Демо-сайты</title><body style="font:16px system-ui;max-width:640px;margin:32px auto;padding:0 16px"><h1>Демо-сайты</h1><ul>${leads.map(l=>`<li><a href="${l.slug}/">${esc(l.name)}</a></li>`).join('')}</ul>`);
console.log('built',leads.length);
