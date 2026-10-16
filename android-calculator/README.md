# Калькулятор (Практическое задание №3) — интерфейс

Только внешний вид, логики вычислений пока нет.

## Как подключить в Android Studio
1. New Project → **Empty Views Activity**, Language: **Java**, имя `Calculator`, пакет `com.example.calculator`.
   (Если пакет другой — поменяйте `package` в `MainActivity.java`.)
2. Скопируйте файлы из `app/src/main/res/` в `res/` вашего проекта (layout, drawable, values) с заменой `activity_main.xml`.
   Цвета из `colors.xml` (имена `calc_*`) можно заменить файл целиком или добавить строки в ваш `res/values/colors.xml`.
3. Откройте `activity_main.xml` → вкладка **Design**/**Split**.

## Что где
- `layout/activity_main.xml` — вся разметка (экран + 5 строк кнопок, вес `layout_weight`).
- `values/colors.xml` — 3 основных цвета: тёмный, оранжевый, белый (+ их оттенки).
- `values/calc_styles.xml` — стили кнопок (размер текста 34sp, жирный, белый).
- `drawable/bg_gradient.xml` — градиентный фон; `btn_*.xml` — скруглённые кнопки с ripple.
