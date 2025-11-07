package com.example.expensetracker.controller.v1;

import com.example.expensetracker.exception.AppException;
import com.example.expensetracker.response.ErrorResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.TransientDataAccessException;
import org.springframework.dao.NonTransientDataAccessException;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LogManager.getLogger(GlobalExceptionHandler.class);

    /**
     * Handles all custom application exceptions.
     */
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> handleAppException(AppException ex) {
        logger.debug("Application exception: {}", ex.getMessage());
        return ResponseEntity
                .status(ex.getStatus())
                .body(ErrorResponse.of(ex.getStatus().value(), ex.getMessage()));
    }

    /**
     * Handles Spring validation errors from @Valid annotations.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        String message = "Validation failed: " + errors.entrySet().stream()
                .map(e -> e.getKey() + ": " + e.getValue())
                .collect(Collectors.joining(", "));

        logger.debug("Validation error: {}", message);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), message));
    }

    /**
     * Handles Spring BindException (for @ModelAttribute validation).
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ErrorResponse> handleBindException(BindException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        String message = "Validation failed: " + errors.entrySet().stream()
                .map(e -> e.getKey() + ": " + e.getValue())
                .collect(Collectors.joining(", "));

        logger.debug("Bind error: {}", message);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), message));
    }

    /**
     * Handles ConstraintViolationException (for method-level validation).
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(ConstraintViolationException ex) {
        String message = ex.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(", "));

        logger.debug("Constraint violation: {}", message);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), "Validation failed: " + message));
    }

    /**
     * Handles missing request parameters.
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParameter(MissingServletRequestParameterException ex) {
        String message = "Missing required parameter: " + ex.getParameterName();
        logger.debug("Missing parameter: {}", message);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), message));
    }

    /**
     * Handles type mismatch errors (e.g., passing string instead of number).
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = String.format("Invalid value '%s' for parameter '%s'. Expected type: %s",
                ex.getValue(), ex.getName(), ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown");
        logger.debug("Type mismatch: {}", message);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), message));
    }

    /**
     * Handles HTTP method not supported errors.
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        assert ex.getSupportedMethods() != null;
        String message = "HTTP method '" + ex.getMethod() + "' is not supported for this endpoint. Supported methods: " +
                String.join(", ", ex.getSupportedMethods());
        logger.debug("Method not supported: {}", message);
        return ResponseEntity
                .status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(ErrorResponse.of(HttpStatus.METHOD_NOT_ALLOWED.value(), message));
    }

    /**
     * Handles malformed JSON in request body.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleMessageNotReadable(HttpMessageNotReadableException ex) {
        String message = "Invalid request body format. " + (ex.getMessage() != null ? ex.getMessage() : "Malformed JSON");
        logger.debug("Message not readable: {}", message);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), message));
    }

    /**
     * Handles JWT token expiration.
     */
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ErrorResponse> handleExpiredJwtException(ExpiredJwtException ex) {
        String message = "JWT token expired. Please login again or use refresh token to get a new access token.";
        logger.debug("JWT expired: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(HttpStatus.UNAUTHORIZED.value(), message));
    }

    /**
     * Handles malformed JWT tokens.
     */
    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<ErrorResponse> handleMalformedJwtException(MalformedJwtException ex) {
        String message = "Invalid JWT token format.";
        logger.debug("Malformed JWT: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(HttpStatus.UNAUTHORIZED.value(), message));
    }

    /**
     * Handles JWT signature exceptions.
     */
    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<ErrorResponse> handleSignatureException(SignatureException ex) {
        String message = "Invalid JWT token signature.";
        logger.debug("JWT signature error: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(HttpStatus.UNAUTHORIZED.value(), message));
    }

    /**
     * Handles general JWT library exceptions.
     */
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ErrorResponse> handleJwtLibException(JwtException ex) {
        String message = "JWT token error: " + ex.getMessage();
        logger.debug("JWT error: {}", message);
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(HttpStatus.UNAUTHORIZED.value(), message));
    }

    /**
     * Handles Spring Security access denied errors.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        String message = "Access denied. You don't have permission to perform this action.";
        logger.debug("Access denied: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ErrorResponse.of(HttpStatus.FORBIDDEN.value(), message));
    }

    /**
     * Handles authentication failures.
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex) {
        String message = "Invalid credentials.";
        logger.debug("Bad credentials: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(HttpStatus.UNAUTHORIZED.value(), message));
    }

    /**
     * Handles file upload size exceeded errors.
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException ex) {
        String message = "File size exceeds maximum allowed size.";
        logger.debug("File size exceeded: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), message));
    }

    /**
     * Handles transient database errors (temporary issues that might be resolved by retrying).
     */
    @ExceptionHandler(TransientDataAccessException.class)
    public ResponseEntity<ErrorResponse> handleTransientDataAccessException(TransientDataAccessException ex) {
        logger.warn("Transient database error: ", ex);
        String message = "A temporary database error occurred. Please try again in a moment.";
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ErrorResponse.of(HttpStatus.SERVICE_UNAVAILABLE.value(), message));
    }

    /**
     * Handles non-transient database errors (permanent issues like constraint violations).
     */
    @ExceptionHandler(NonTransientDataAccessException.class)
    public ResponseEntity<ErrorResponse> handleNonTransientDataAccessException(NonTransientDataAccessException ex) {
        logger.error("Non-transient database error: ", ex);
        String message = "A database error occurred. Please check your request and try again.";
        
        String exceptionMessage = ex.getMessage();
        if (exceptionMessage != null) {
            if (exceptionMessage.contains("constraint") || exceptionMessage.contains("unique")) {
                message = "Data integrity violation. The operation conflicts with existing data.";
            } else if (exceptionMessage.contains("foreign key")) {
                message = "Cannot perform this operation due to related data constraints.";
            }
        }
        
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), message));
    }

    /**
     * Handles general database access errors.
     */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDataAccessException(DataAccessException ex) {
        logger.error("Database access error: ", ex);
        String message = "A database error occurred. Please try again later.";
        
        // Check if it's a connection issue
        Throwable rootCause = ex.getRootCause();
        if (rootCause != null) {
            String rootCauseMessage = rootCause.getMessage();
            if (rootCauseMessage != null && (
                    rootCauseMessage.contains("Connection refused") ||
                    rootCauseMessage.contains("timeout") ||
                    rootCauseMessage.contains("could not connect") ||
                    rootCauseMessage.contains("connection closed")
            )) {
                message = "Unable to connect to the database. Please try again later or contact support if the problem persists.";
                return ResponseEntity
                        .status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(ErrorResponse.of(HttpStatus.SERVICE_UNAVAILABLE.value(), message));
            }
        }
        
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of(HttpStatus.INTERNAL_SERVER_ERROR.value(), message));
    }

    /**
     * Handles SQL exceptions (fallback for SQL errors not caught by Spring).
     */
    @ExceptionHandler(SQLException.class)
    public ResponseEntity<ErrorResponse> handleSQLException(SQLException ex) {
        logger.error("SQL error: ", ex);
        String message = "A database error occurred. Please try again later.";
        
        String sqlState = ex.getSQLState();
        String errorMessage = ex.getMessage();
        
        if (errorMessage != null && (
                errorMessage.contains("Connection refused") ||
                errorMessage.contains("timeout") ||
                errorMessage.contains("could not connect") ||
                errorMessage.contains("connection closed") ||
                sqlState != null && sqlState.startsWith("08")
        )) {
            message = "Unable to connect to the database. Please try again later or contact support if the problem persists.";
            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(ErrorResponse.of(HttpStatus.SERVICE_UNAVAILABLE.value(), message));
        }
        
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of(HttpStatus.INTERNAL_SERVER_ERROR.value(), message));
    }

    /**
     * Handles all other unhandled exceptions.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
        logger.error("Unhandled exception: ", ex);
        String message = "An unexpected error occurred. Please try again later.";
        
        if (logger.isDebugEnabled()) {
            message = "Internal server error: " + ex.getMessage();
        }
        
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of(HttpStatus.INTERNAL_SERVER_ERROR.value(), message));
    }
}
