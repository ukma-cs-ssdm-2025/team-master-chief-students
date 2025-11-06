package com.example.expensetracker.exception;

import org.springframework.http.HttpStatus;

public class InternalServerException extends AppException {
    public InternalServerException(String message) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Deprecated
    public InternalServerException(String message, Throwable cause) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
        initCause(cause);
    }
}

