# Калькулятор (версия 2) — Практическое задание №3

Android-проект на Java. Откройте папку `android-calculator` в Android Studio
(File → Open) и дождитесь Gradle Sync. Запуск: эмулятор или телефон, API 24+.

## Дизайн: ровно три цвета (`res/values/colors.xml`)

| Цвет | Код | Где используется |
|---|---|---|
| `navy` — тёмно-синий | `#1B1F3B` | фон, текст на светлых и оранжевых кнопках |
| `light` — светлый | `#F2F2F7` | кнопки с цифрами, крупное число на экране |
| `accent` — оранжевый | `#FF9F1C` | кнопки операций и «=», строка выражения |

Текст кнопок — 32sp жирный, число на экране — до 72sp (`autoSizeTextType` само уменьшает,
если число длинное). Контраст navy/light и navy/accent — высокий.

## Возможности
`+ − × ÷`, `=`, `C` (очистка), `⌫` (стереть цифру), `±` (смена знака), `.` (дробные числа).
Цепочки (`2 + 3 × 4 =` → 20), деление на ноль → «Ошибка», вычисления через `BigDecimal`
(0.1 + 0.2 = 0.3).

## Структура
- `app/src/main/res/layout/activity_main.xml` — разметка (тот самый «main_activity.xml»)
- `app/src/main/res/values/colors.xml, themes.xml` — цвета и стили кнопок
- `app/src/main/res/drawable/btn_*.xml` — фоны кнопок (скруглённый прямоугольник + ripple)
- `app/src/main/java/.../MainActivity.java` — обработчики нажатий
- `app/src/main/java/.../Calculator.java` — вся логика без Android
- `test/CalculatorTest.java` — проверка логики без эмулятора

## Как объяснять `activity_main.xml` на защите
- Корень — вертикальный `LinearLayout`: экран (`layout_weight="2"`) + 5 строк кнопок
  (`layout_weight="1"` у каждой) → высота делится 2:1:1:1:1:1.
- Каждая строка — горизонтальный `LinearLayout`; у кнопок `layout_width="0dp"` и
  `layout_weight="1"`, поэтому ширина делится поровну. У кнопки «0» `weight="2"` — она вдвое шире.
- `style="@style/CalcButton.Digit"` подтягивает фон, цвет и размер текста из `themes.xml`.
- `android:onClick="onDigitClick"` вызывает метод с таким именем в `MainActivity`.
- `layout_margin="5dp"` — промежутки между кнопками.

## Как изменить дизайн, не трогая Java (для «Отлично»)
- Другая палитра: поменять три значения в `colors.xml`.
- Круглые кнопки: `android:radius` в `btn_*.xml` → `50dp`.
- Крупнее/мельче текст: `textSize` в стиле `CalcButton`.
- Отступы: `layout_margin` у кнопок.
- Градиент фона: заменить `android:background="@color/navy"` на drawable с `<gradient>`.

## Проверка логики без Android
```
javac -encoding UTF-8 -d out app/src/main/java/com/example/calculator/Calculator.java test/CalculatorTest.java
java -cp out com.example.calculator.CalculatorTest
```
