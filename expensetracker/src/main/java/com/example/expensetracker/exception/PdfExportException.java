package com.example.expensetracker.exception;

public class PdfExportException extends RuntimeException {
    public PdfExportException(String message, Throwable cause) {
        super(message, cause);
    }
}
