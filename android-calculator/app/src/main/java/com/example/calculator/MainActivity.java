package com.example.calculator;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends Activity {

    private final Calculator calculator = new Calculator();

    private TextView tvExpression;
    private TextView tvResult;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        tvExpression = findViewById(R.id.tvExpression);
        tvResult = findViewById(R.id.tvResult);
    }

    // Обработчики назначены в activity_main.xml через android:onClick

    public void onDigitClick(View v) {
        calculator.digit(((Button) v).getText().charAt(0));
        refresh();
    }

    public void onDotClick(View v) {
        calculator.dot();
        refresh();
    }

    public void onOperatorClick(View v) {
        calculator.operator(((Button) v).getText().charAt(0));
        refresh();
    }

    public void onEqualsClick(View v) {
        calculator.equals();
        refresh();
    }

    public void onClearClick(View v) {
        calculator.clear();
        refresh();
    }

    public void onBackspaceClick(View v) {
        calculator.backspace();
        refresh();
    }

    public void onSignClick(View v) {
        calculator.negate();
        refresh();
    }

    private void refresh() {
        tvResult.setText(calculator.getResult());
        tvExpression.setText(calculator.getExpression());
    }
}
