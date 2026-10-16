package com.example.calculator;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Подключаем разметку activity_main.xml. Логику вычислений добавим позже.
        setContentView(R.layout.activity_main);
    }
}
