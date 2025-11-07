package com.example.expensetracker.exception;

import org.springframework.http.HttpStatus;

public class JwtException extends AppException {
    public JwtException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }

    public JwtException(String message, Throwable cause) {
        super(message, HttpStatus.UNAUTHORIZED);
        initCause(cause);
    }
}

