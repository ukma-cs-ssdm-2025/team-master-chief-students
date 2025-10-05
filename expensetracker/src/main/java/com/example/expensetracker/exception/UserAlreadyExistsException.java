package com.example.expensetracker.exception;

import org.springframework.http.HttpStatus;

public class UserAlreadyExistsException extends AppException {
    public UserAlreadyExistsException(String email) {
        super("User with email '" + email + "' already exists", HttpStatus.CONFLICT);
    }
}
