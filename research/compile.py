#!/usr/bin/env python3
"""Собирает LEADS.md, leads.csv и demo-sites/index.html из research/*.json."""
import json, csv, os, html
R = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(R)
BASE = 'https://bahsdkw.github.io/sait/'
# порядок = порядок обзвона; категория и приоритет — оценка по данным исследования
ORDER = [
 ('m-studio','Ногтевая студия','A','Сильный бренд (сеть, 1 042 отзыва), вместо сайта Taplink'),
 ('minimal','Барбершоп','A','5,0 по 77 оценкам, а сайт — пустой автосайт Яндекса'),
 ('zamochnaya-sluzhba','Замки, вскрытие','A','4,9 по 177 оценкам, круглосуточно, нет сайта'),
 ('molcha','Массаж','A','Самый полный прайс и мессенджеры, но 2 оценки'),
 ('run-computer','Ремонт компьютеров','B','4,7 по 43 оценкам, нет ни одного канала кроме телефона'),
 ('pilates-mitino','Пилатес','B','Мало данных, но поиск «пилатес Митино» пуст'),
 ('nava-avto','Автосервис, детейлинг','B','Детейлинг утоплен среди СТО на автосайте'),
 ('shinnyj-otel','Шиномонтаж, хранение шин','B','Сезон хранения шин, возможен сайт сети'),
 ('funfit','Функциональный тренинг','B','Нужно проверить, что студия жива (VK 2015–2017)'),
 ('spa-indiya','Массаж','C','Самая пустая карточка, но 1 оценка'),
 ('myshtsy','Массаж','C','Нет ни прайса, ни каналов, данных очень мало'),
 ('mobilnyj-shinomontazh','Выездной шиномонтаж','C','Подозрительно: 1 оценка, нереалистичный набор услуг'),
 ('eko-klining','Клининг','C','Признаков живого бизнеса нет, звонить последним'),
]
def L(v): return v if isinstance(v,list) else ([] if v in (None,'') else [v])
def msg(d):
    m=d.get('messengers') or {}; out=[]
    for k,v in m.items():
        if isinstance(v,str) and k!='note' and v.startswith(('http','t.me','wa.me')): out.append(f'{k}: {v}')
    s=d.get('social') or {}
    for k,v in s.items():
        if isinstance(v,str) and v: out.append(f'{k}: {v}')
    return out
def rate(d):
    r=d.get('rating')
    if r is None: return '—'
    return f"{r} · {d.get('ratings_count')} оц. · {d.get('reviews_count')} отз."
def prices(d):
    s=d.get('services') or []
    s=[x for x in s if isinstance(x,dict)]
    if not s: return 'нет данных'
    return f"{len(s)} поз.: "+'; '.join(f"{x['name']} — {x['price']}" for x in s[:3])+(' …' if len(s)>3 else '')
rows=[]
for i,(slug,cat,pr,why) in enumerate(ORDER,1):
    d=json.load(open(os.path.join(R,slug+'.json'),encoding='utf-8'))
    rows.append(dict(n=i,slug=slug,cat=cat,pr=pr,why=why,d=d))
# CSV
with open(os.path.join(ROOT,'leads.csv'),'w',newline='',encoding='utf-8-sig') as f:
    w=csv.writer(f); w.writerow(['№','Название','Категория','Приоритет','Адрес','Метро','Телефоны','Мессенджеры/соцсети','Часы','Рейтинг','Цены','Проверка сайта','Крючок','Риски','Демо-сайт','Источники'])
    for r in rows:
        d=r['d']; w.writerow([r['n'],d['name'],r['cat'],r['pr'],d.get('address'),d.get('metro'),'; '.join(L(d.get('phones'))),'; '.join(msg(d)),d.get('hours'),rate(d),prices(d),(d.get('website_check') or {}).get('result'),d.get('sales_angle'),' | '.join(L(d.get('risks'))),BASE+r['slug']+'/',' | '.join(L(d.get('sources')))])
# MD
md=['# Лиды: малый бизнес Москвы без своего сайта','',
 'Данные из публичных карточек Zoon и Яндекс.Карт на 13.10.2026. Порядок = порядок обзвона. Приоритет: A — звонить первыми, B — потом, C — слабые или сомнительные.','',
 '| # | Бизнес | Кат. | Пр. | Телефон | Рейтинг | Демо | Почему в этом порядке |','|---|---|---|---|---|---|---|---|']
for r in rows:
    d=r['d']; md.append(f"| {r['n']} | {d['name']} | {r['cat']} | {r['pr']} | {'; '.join(L(d.get('phones')))} | {rate(d)} | [сайт]({BASE}{r['slug']}/) | {r['why']} |")
md+=['','## Подробно по каждому','']
for r in rows:
    d=r['d']; wc=d.get('website_check') or {}
    md+=[f"### {r['n']}. {d['name']} (приоритет {r['pr']})",'',
     f"- **Адрес:** {d.get('address')} · {d.get('district')} · метро: {d.get('metro')}",
     f"- **Телефоны:** {'; '.join(L(d.get('phones')))}",
     f"- **Каналы:** {'; '.join(msg(d)) or 'не найдено'}",
     f"- **Часы:** {d.get('hours') or 'нет данных'}",
     f"- **Рейтинг:** {rate(d)}",
     f"- **Цены:** {prices(d)}",
     f"- **Проверка сайта:** {wc.get('result')}",
     f"- **Крючок:** {d.get('sales_angle')}",
     f"- **Риски:** "+'; '.join(L(d.get('risks'))),
     f"- **Демо-сайт:** {BASE}{r['slug']}/",
     f"- **Источники:** "+', '.join(L(d.get('sources'))),'']
open(os.path.join(ROOT,'LEADS.md'),'w',encoding='utf-8').write('\n'.join(md))
# index
e=html.escape
tr=''.join(f"<tr><td>{r['n']}</td><td><a href='{r['slug']}/'>{e(r['d']['name'])}</a><br><small>{e(r['cat'])}</small></td><td>{r['pr']}</td><td><a href='tel:{''.join(c for c in L(r['d'].get('phones'))[0] if c in '+0123456789')}'>{e(L(r['d'].get('phones'))[0])}</a></td><td>{e(rate(r['d']))}</td></tr>" for r in rows)
open(os.path.join(ROOT,'demo-sites','index.html'),'w',encoding='utf-8').write(f"""<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Демо-сайты</title>
<style>body{{font:15px/1.5 system-ui;max-width:860px;margin:24px auto;padding:0 16px}}table{{border-collapse:collapse;width:100%}}td,th{{padding:8px;border-bottom:1px solid #8884;text-align:left;vertical-align:top}}small{{color:#888}}</style>
<h1>Демо-сайты</h1><table><tr><th>#</th><th>Бизнес</th><th>Пр.</th><th>Телефон</th><th>Рейтинг</th></tr>{tr}</table>""")
print('ok',len(rows))
