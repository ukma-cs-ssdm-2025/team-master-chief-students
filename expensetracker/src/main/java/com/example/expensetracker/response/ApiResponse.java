package com.example.expensetracker.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


@Data
@NoArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Map<String, Object> metadata = new HashMap<>();

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        addDefaultMetadata();
    }

    public ApiResponse(boolean success, String message, T data, Map<String, Object> metadata) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.metadata = metadata != null ? metadata : new HashMap<>();
        addDefaultMetadata();
    }

    private void addDefaultMetadata() {
        this.metadata.putIfAbsent("timestamp", LocalDateTime.now());
    }
}