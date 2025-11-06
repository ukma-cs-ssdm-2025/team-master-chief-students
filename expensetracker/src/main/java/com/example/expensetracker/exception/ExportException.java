package com.example.expensetracker.exception;

import org.springframework.http.HttpStatus;

public class ExportException extends AppException {
    @Deprecated
    public ExportException(String message) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ExportException(String message, Throwable cause) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
        initCause(cause);
    }
}

