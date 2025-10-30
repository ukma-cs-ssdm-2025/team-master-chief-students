package com.example.expensetracker.exception;

import org.springframework.http.HttpStatus;

public class CategoryNotFoundException extends AppException {
    public CategoryNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
