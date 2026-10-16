package com.example.calculator;

import android.os.Bundle;

import android.app.Activity;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Подключаем разметку activity_main.xml. Логику вычислений добавим позже.
        setContentView(R.layout.activity_main);
    }
}
