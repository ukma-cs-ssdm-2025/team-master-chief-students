package com.example.expensetracker.response;

public interface IEntity<T> {
    boolean isSuccess();
    String getMessage();
    T getData();
}