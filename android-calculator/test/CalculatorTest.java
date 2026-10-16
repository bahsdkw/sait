package com.example.calculator;

public class CalculatorTest {
    static int failed = 0;

    static void check(String name, String expected, String actual) {
        boolean ok = expected.equals(actual);
        if (!ok) failed++;
        System.out.println((ok ? "OK   " : "FAIL ") + name + " -> " + actual + (ok ? "" : " (ожидалось " + expected + ")"));
    }

    static Calculator press(String keys) {
        Calculator c = new Calculator();
        for (char k : keys.toCharArray()) {
            if (Character.isDigit(k)) c.digit(k);
            else if (k == '.') c.dot();
            else if (k == '=') c.equals();
            else if (k == 'C') c.clear();
            else if (k == '<') c.backspace();
            else if (k == '~') c.negate();
            else c.operator(k);
        }
        return c;
    }

    public static void main(String[] a) {
        check("2+3", "5", press("2+3=").getResult());
        check("0.1+0.2", "0.3", press("0.1+0.2=").getResult());
        check("7−10", "-3", press("7−10=").getResult());
        check("1.5×4", "6", press("1.5×4=").getResult());
        check("10÷4", "2.5", press("10÷4=").getResult());
        check("1÷3", "0.333333333333", press("1÷3=").getResult());
        check("÷0", "Ошибка", press("5÷0=").getResult());
        check("цепочка 2+3×4", "20", press("2+3×4=").getResult());
        check("промежуточный", "5", press("2+3×").getResult());
        check("выражение", "5 ×", press("2+3×").getExpression());
        check("замена оператора", "6", press("3+×2=").getResult());
        check("= повторно не ломает", "5", press("2+3==").getResult());
        check("новое число после =", "7", press("2+3=7").getResult());
        check("одна точка", "1.5", press("1.5.").getResult());
        check("точка первой", "0.5", press(".5").getResult());
        check("ведущий ноль", "5", press("005").getResult());
        check("backspace", "12", press("123<").getResult());
        check("backspace до нуля", "0", press("5<").getResult());
        check("смена знака", "-5", press("5~").getResult());
        check("минус×минус", "6", press("2~×3~=").getResult());
        check("C", "0", press("12+3C").getResult());
        check("после ошибки цифра", "4", press("5÷0=4").getResult());
        check("лимит цифр", "123456789012", press("12345678901234").getResult());
        check("большое (вводится максимум 12 цифр)", "1E+22", press("1000000000000×1000000000000=").getResult());
        System.exit(failed == 0 ? 0 : 1);
    }
}
