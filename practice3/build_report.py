# -*- coding: utf-8 -*-
import glob, os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph,
    Spacer, PageBreak, Preformatted, KeepTogether, NextPageTemplate, Table, TableStyle)

F = '/usr/share/fonts/truetype/liberation/'
pdfmetrics.registerFont(TTFont('TNR', F + 'LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('TNR-B', F + 'LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('TNR-I', F + 'LiberationSerif-Italic.ttf'))
pdfmetrics.registerFont(TTFont('Mono', F + 'LiberationMono-Regular.ttf'))
from reportlab.pdfbase.pdfmetrics import registerFontFamily
registerFontFamily('TNR', normal='TNR', bold='TNR-B', italic='TNR-I', boldItalic='TNR-B')

W, H = A4
body = ParagraphStyle('body', fontName='TNR', fontSize=14, leading=21,
                      alignment=TA_JUSTIFY, firstLineIndent=12.5*mm)
plain = ParagraphStyle('plain', parent=body, firstLineIndent=0)
center = ParagraphStyle('center', parent=plain, alignment=TA_CENTER)
centerb = ParagraphStyle('centerb', parent=center, fontName='TNR-B')
h1 = ParagraphStyle('h1', parent=plain, fontName='TNR-B', alignment=TA_CENTER, spaceAfter=14)
h2 = ParagraphStyle('h2', parent=plain, fontName='TNR-B', firstLineIndent=12.5*mm, spaceBefore=10, spaceAfter=8)
caption = ParagraphStyle('cap', parent=center, spaceBefore=4, spaceAfter=10)
code = ParagraphStyle('code', fontName='Mono', fontSize=10, leading=12)
small = ParagraphStyle('small', parent=plain, fontSize=12, leading=16)

def read(p):
    return open(p, encoding='utf-8').read().rstrip('\n')

class Doc(BaseDocTemplate):
    def __init__(self, fn):
        super().__init__(fn, pagesize=A4, leftMargin=30*mm, rightMargin=10*mm,
                         topMargin=20*mm, bottomMargin=20*mm,
                         title='Отчёт по практическому занятию №3',
                         author='Шевырин Александр, ПКС-33')
        fr = Frame(30*mm, 20*mm, W-40*mm, H-40*mm, id='f', leftPadding=0, rightPadding=0,
                   topPadding=0, bottomPadding=0)
        self.addPageTemplates([PageTemplate('title', [fr]),
                               PageTemplate('main', [fr], onPage=self.num)])
    def num(self, c, d):
        c.setFont('TNR', 14)
        c.drawCentredString(W/2 + 10*mm, 10*mm, str(d.page))
    def afterFlowable(self, fl):
        if getattr(fl, '_toc', None):
            self.notify('TOCEntry', (0, fl._toc, self.page))

from reportlab.platypus.tableofcontents import TableOfContents
toc = TableOfContents()
toc.levelStyles = [ParagraphStyle('t0', parent=plain, fontSize=14, leading=21)]
toc.dotsMinLevel = 0

def H1(text, brk=True):
    p = Paragraph(text.upper(), h1); p._toc = text.upper()
    return ([PageBreak()] if brk else []) + [p]

st = []
# ---------- Титульный лист ----------
st += [Paragraph('МИНОБРНАУКИ РОССИИ', centerb),
       Paragraph('Федеральное государственное бюджетное образовательное учреждение высшего образования', center),
       Paragraph('«МИРЭА – Российский технологический университет»', centerb),
       Paragraph('РТУ МИРЭА', centerb), Spacer(1, 8*mm),
       Paragraph('Колледж программирования и кибербезопасности', centerb), Spacer(1, 25*mm),
       Paragraph('ОТЧЁТ', ParagraphStyle('t', parent=centerb, fontSize=18, leading=26)),
       Paragraph('по практическому занятию № 3', centerb),
       Paragraph('«Динамическое выделение памяти»', centerb), Spacer(1, 6*mm),
       Paragraph('по междисциплинарному курсу МДК.01.04 «Системное программирование»', center),
       Paragraph('ПЦК «Программирование»', center), Spacer(1, 22*mm)]
t = Table([[Paragraph('Выполнил:<br/>студент группы ПКС-33<br/>Шевырин Александр', plain), ''],
           [Paragraph('<br/>Проверил:<br/>преподаватель<br/>Мухортова Наталья Николаевна', plain), '']],
          colWidths=[85*mm, 85*mm])
t.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
# выравнивание блока вправо
t2 = Table([['', t]], colWidths=[0*mm, 170*mm]); 
st += [Table([[ '', Paragraph('Выполнил:<br/>студент группы ПКС-33<br/>Шевырин Александр<br/><br/>Проверил:<br/>преподаватель<br/>Мухортова Наталья Николаевна', plain)]],
             colWidths=[80*mm, 90*mm]),
       Spacer(1, 20*mm), Paragraph('Москва, 2026', center),
       NextPageTemplate('main'), PageBreak()]

# ---------- Содержание ----------
st += [Paragraph('СОДЕРЖАНИЕ', h1), toc]

# ---------- Введение/цель/задание ----------
st += H1('Цель и задание')
st += [Paragraph('<b>Цель работы:</b> освоить принципы построения структур с динамическим выделением памяти.', body),
       Paragraph('<b>Задание.</b> Разработать, отладить и продемонстрировать работу двух программ.', body),
       Paragraph('1. В первой программе описать динамическую структуру, которая содержит указатель на статическую структуру Book (с тремя полями на выбор студента). Создать две динамические структуры, заполнить их информацией о книгах, связать между собой и вывести информацию из обеих структур только через первую из них.', body),
       Paragraph('2. Создать динамическую структуру согласно списку задач. Номер индивидуальной задачи вычисляется как остаток от деления на 5 номера студента по списку в журнале группы плюс один.', body),
       Paragraph('Индивидуальные задачи:', body),
       Paragraph('1) стек на односвязном списке: создание, добавление элемента, удаление элемента из середины списка (не первого и не последнего), вывод списка;', body),
       Paragraph('2) двусвязный список: создание, добавление элемента, удаление элемента из конца списка, вывод списка;', body),
       Paragraph('3) двусвязный список: создание, добавление элемента, удаление элемента из начала списка, вывод списка из начала в конец и из конца в начало;', body),
       Paragraph('4) циклический двусвязный список: создание, добавление элемента, удаление элемента из середины списка, вывод списка;', body),
       Paragraph('5) циклический односвязный список: создание, добавление элемента, удаление элемента из середины списка, вывод списка.', body),
       Paragraph('Так как порядковый номер в журнале группы в задании не указан, в работе выполнены все пять вариантов индивидуальной задачи; в отчёте они обозначены как задачи 2.1–2.5.', body)]

# ---------- Теория ----------
st += H1('Теоретические сведения')
st += [Paragraph('Динамическая структура данных – это структура, размер и состав которой изменяются во время выполнения программы. Память под её элементы выделяется в «куче» (heap) функциями <b>malloc()</b>, <b>calloc()</b>, <b>realloc()</b> из заголовочного файла stdlib.h, а освобождается функцией <b>free()</b>. Каждый выделенный блок необходимо освободить ровно один раз, иначе возникает утечка памяти.', body),
       Paragraph('Элемент динамической структуры (узел) содержит информационную часть и один или несколько указателей на соседние элементы:', body),
       Paragraph('– <b>односвязный список</b>: узел хранит указатель на следующий элемент; последний элемент указывает на NULL;', body),
       Paragraph('– <b>двусвязный список</b>: узел хранит указатели на предыдущий и следующий элементы, что позволяет обходить список в обоих направлениях;', body),
       Paragraph('– <b>циклический список</b>: последний элемент ссылается на первый (в двусвязном – ещё и первый на последний), признака конца NULL нет;', body),
       Paragraph('– <b>стек</b> – структура, работающая по принципу LIFO («последним пришёл – первым вышел»); на односвязном списке вершина стека является головой списка.', body),
       Paragraph('Для удаления элемента из середины списка необходимо найти предшествующий ему узел, «перебросить» указатель на следующий за удаляемым узел и только после этого освободить память удаляемого узла.', body)]

# ---------- Ход работы ----------
tasks = [
 ('prog1_book', 'Программа 1. Динамическая структура со ссылкой на структуру Book',
  'Описана статическая структура <b>Book</b> с тремя полями: название (title), автор (author), год издания (year). Динамическая структура <b>Node</b> содержит указатель <i>book</i> на структуру Book и указатель <i>next</i> на следующий узел. Функция create_node() выделяет память под узел и под книгу и заполняет поля. В main() создаются два узла, связываются через поле next, и информация о обеих книгах выводится в цикле, начинающемся только с первого узла. В конце память освобождается.'),
 ('prog2_1_stack', 'Задача 2.1. Стек на односвязном списке',
  'Стек реализован как односвязный список, вершина (top) – голова списка. Функции: create() – создание пустого стека; push() – добавление элемента в вершину; remove_middle() – удаление элемента с номером 2…size–1 (считая от вершины), для первого и последнего элементов возвращается отказ; print() – вывод; destroy() – освобождение памяти.'),
 ('prog2_2_dlist_end', 'Задача 2.2. Двусвязный список, удаление из конца',
  'Список хранит указатели на head и tail. Функции: create(), add() – добавление в конец, remove_last() – удаление последнего элемента (с корректировкой tail), remove_middle() – удаление элемента из середины, print(), destroy().'),
 ('prog2_3_dlist_begin', 'Задача 2.3. Двусвязный список, удаление из начала',
  'Реализованы функции create(), add(), remove_first() – удаление первого элемента (с корректировкой head), remove_middle(), а также два вида вывода: print_forward() – от начала к концу и print_backward() – от конца к началу по указателям prev.'),
 ('prog2_4_cyc_dlist', 'Задача 2.4. Циклический двусвязный список',
  'В списке хранится указатель на голову head; указатель head->prev является хвостом списка, а tail->next возвращает к голове. Функции: create(), add(), remove_middle(), print() (обход до возврата к голове), destroy().'),
 ('prog2_5_cyc_slist', 'Задача 2.5. Циклический односвязный список',
  'В списке хранится указатель на хвост tail; tail->next является головой, что делает добавление в конец и обход за O(1) и O(n) соответственно. Функции: create(), add(), remove_middle(), print(), destroy().'),
]
st += H1('Ход выполнения работы')
fig = 0
for i, (name, title, desc) in enumerate(tasks):
    st += [Paragraph(title, h2), Paragraph(desc, body)]
    st += [Paragraph('Исходный код программы приведён в листинге %d.' % (i+1), body),
           Paragraph('Листинг %d – %s' % (i+1, os.path.basename(name) + '.c'), ParagraphStyle('lc', parent=plain, spaceBefore=6, spaceAfter=4))]
    st += [Preformatted(read(name + '.c'), code)]
    fig += 1
    out = read('out/%s.txt' % name)
    st += [Spacer(1, 6),
           Paragraph('Результат работы программы показан на рисунке %d.' % fig, body)]
    box = Table([[Preformatted(out, code)]], colWidths=[W-40*mm])
    box.setStyle(TableStyle([('BOX', (0,0), (-1,-1), 0.8, (0,0,0)),
                             ('BACKGROUND', (0,0), (-1,-1), (0.95,0.95,0.95)),
                             ('LEFTPADDING', (0,0), (-1,-1), 6), ('TOPPADDING', (0,0), (-1,-1), 6),
                             ('BOTTOMPADDING', (0,0), (-1,-1), 6)]))
    st += [KeepTogether([Spacer(1,4), box, Paragraph('Рисунок %d – Вывод программы «%s»' % (fig, title.split('.',1)[0] + '.' + title.split('.',1)[1].split('.')[0] if False else title), caption)])]
    if i < len(tasks)-1: st += [PageBreak()]

st += H1('Тестирование')
st += [Paragraph('Все программы скомпилированы компилятором GCC с ключами <font name="Mono">-Wall -Wextra -g</font> без предупреждений. Для проверки корректности работы с динамической памятью программы были запущены с санитайзерами <font name="Mono">-fsanitize=address,undefined</font>: ошибок обращения к памяти, неопределённого поведения и утечек памяти не обнаружено (код возврата каждой программы – 0).', body),
       Paragraph('Граничные случаи: удаление первого и последнего элементов в задачах 2.1, 2.4 и 2.5 отклоняется функцией remove_middle() (согласно условию, удаляется только «середина»); вывод пустого списка сообщает «Список пуст»; в задачах 2.2 и 2.3 после удаления последнего элемента указатели head и tail становятся равными NULL.', body)]

st += H1('Заключение')
st += [Paragraph('В ходе практического занятия освоены принципы построения структур с динамическим выделением памяти. Разработаны и отлажены программа со связанными динамическими структурами, содержащими указатели на статическую структуру Book, и программы для пяти видов списков: стека на односвязном списке, двусвязного списка с удалением из конца и из начала, циклического двусвязного и циклического односвязного списков. Для каждой структуры реализованы функции создания, добавления, удаления элементов, вывода и освобождения памяти. Утечек памяти и ошибок доступа при тестировании не выявлено.', body)]

st += H1('Список использованных источников')
srcs = ['Керниган Б., Ритчи Д. Язык программирования Си. – 2-е изд. – М.: Вильямс, 2015. – 304 с.',
        'Прата С. Язык программирования C. Лекции и упражнения. – 6-е изд. – М.: Вильямс, 2015. – 928 с.',
        'Кормен Т., Лейзерсон Ч., Ривест Р., Штайн К. Алгоритмы: построение и анализ. – 3-е изд. – М.: Вильямс, 2013. – 1328 с.',
        'Мухортова Н. Н. Язык Си и динамическое выделение памяти: лекционные материалы по МДК.01.04 «Системное программирование». – М.: РТУ МИРЭА, 2026.',
        'ISO/IEC 9899:2018. Information technology – Programming languages – C. – Geneva: ISO, 2018.']
for i, s in enumerate(srcs, 1):
    st.append(Paragraph('%d. %s' % (i, s), body))

d = Doc('Report_Practice3_Shevyrin_PKS-33.pdf')
d.multiBuild(st)
