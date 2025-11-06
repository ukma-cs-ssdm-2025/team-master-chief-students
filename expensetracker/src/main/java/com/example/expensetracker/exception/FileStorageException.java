package com.example.expensetracker.exception;

import org.springframework.http.HttpStatus;

public class FileStorageException extends AppException {
    public FileStorageException(String message) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public FileStorageException(String message, Throwable cause) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
        initCause(cause);
    }
}

