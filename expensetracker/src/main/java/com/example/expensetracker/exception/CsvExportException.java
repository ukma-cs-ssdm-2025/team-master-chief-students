package com.example.expensetracker.exception;

public class CsvExportException extends RuntimeException {
    public CsvExportException(String message, Throwable cause) {
        super(message, cause);
    }
}
