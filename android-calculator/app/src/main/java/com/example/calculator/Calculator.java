package com.example.calculator;

import java.math.BigDecimal;
import java.math.MathContext;

/**
 * Логика калькулятора без привязки к Android.
 * Использует BigDecimal, поэтому 0.1 + 0.2 = 0.3 (а не 0.30000000000000004).
 */
public class Calculator {

    private static final int MAX_DIGITS = 12;
    private static final String ERROR = "Ошибка";

    private String input = "0";      // число, которое сейчас вводится
    private BigDecimal accumulator;  // левый операнд
    private char operator = 0;       // ожидающая операция: + − × ÷ (0 - нет)
    private boolean startNew = true; // следующая цифра начинает новое число
    private boolean error = false;

    public String getResult() {
        return input;
    }

    /** Верхняя строка, например "12 ×". */
    public String getExpression() {
        if (error || operator == 0 || accumulator == null) {
            return "";
        }
        return format(accumulator) + " " + operator;
    }

    public void digit(char d) {
        if (error) {
            clear();
        }
        if (startNew || input.equals("0")) {
            input = String.valueOf(d);
            startNew = false;
        } else if (digitCount(input) < MAX_DIGITS) {
            input += d;
        }
    }

    public void dot() {
        if (error) {
            clear();
        }
        if (startNew) {
            input = "0.";
            startNew = false;
        } else if (!input.contains(".")) {
            input += ".";
        }
    }

    public void operator(char op) {
        if (error) {
            return;
        }
        // Цепочка 2 + 3 × ...: сначала досчитываем предыдущую операцию
        if (operator != 0 && !startNew) {
            if (!applyPending()) {
                return;
            }
        } else if (operator == 0) {
            accumulator = new BigDecimal(input);
        }
        operator = op;
        startNew = true;
    }

    public void equals() {
        if (error || operator == 0) {
            return;
        }
        if (applyPending()) {
            operator = 0;
            startNew = true;
        }
    }

    public void clear() {
        input = "0";
        accumulator = null;
        operator = 0;
        startNew = true;
        error = false;
    }

    public void backspace() {
        if (error) {
            clear();
            return;
        }
        if (startNew) {
            return;
        }
        input = input.substring(0, input.length() - 1);
        if (input.isEmpty() || input.equals("-")) {
            input = "0";
            startNew = true;
        }
    }

    public void negate() {
        if (error || input.equals("0")) {
            return;
        }
        input = input.startsWith("-") ? input.substring(1) : "-" + input;
    }

    /** Выполняет accumulator <operator> input, результат кладёт в оба поля. */
    private boolean applyPending() {
        BigDecimal right = new BigDecimal(input);
        BigDecimal result;
        switch (operator) {
            case '+':
                result = accumulator.add(right);
                break;
            case '−':
                result = accumulator.subtract(right);
                break;
            case '×':
                result = accumulator.multiply(right);
                break;
            case '÷':
                if (right.signum() == 0) {
                    fail();
                    return false;
                }
                result = accumulator.divide(right, MathContext.DECIMAL64);
                break;
            default:
                return false;
        }
        accumulator = result;
        input = format(result);
        return true;
    }

    private void fail() {
        input = ERROR;
        accumulator = null;
        operator = 0;
        startNew = true;
        error = true;
    }

    private static int digitCount(String s) {
        int n = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                n++;
            }
        }
        return n;
    }

    /** Округляет до 12 значащих цифр и убирает лишние нули: 2.50 -> 2.5 */
    static String format(BigDecimal value) {
        if (value.signum() == 0) {
            return "0";
        }
        BigDecimal r = value.round(new MathContext(MAX_DIGITS)).stripTrailingZeros();
        String s = r.toPlainString();
        return s.length() > 16 ? r.toString() : s;
    }
}
