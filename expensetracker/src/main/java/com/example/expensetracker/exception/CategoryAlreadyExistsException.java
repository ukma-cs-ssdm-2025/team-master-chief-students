package com.example.expensetracker.exception;

import org.springframework.http.HttpStatus;

public class CategoryAlreadyExistsException extends AppException {
    public CategoryAlreadyExistsException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}