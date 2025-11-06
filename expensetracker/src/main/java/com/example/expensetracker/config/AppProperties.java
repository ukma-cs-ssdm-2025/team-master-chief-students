package com.example.expensetracker.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Application properties configuration.
 * Centralizes all magic numbers and configuration values.
 */
@Configuration
@Getter
public class AppProperties {

    // Pagination
    @Value("${app.pagination.default-limit:20}")
    private int paginationDefaultLimit;

    @Value("${app.pagination.max-limit:100}")
    private int paginationMaxLimit;

    @Value("${app.pagination.min-limit:1}")
    private int paginationMinLimit;

    // Retry Configuration
    @Value("${app.retry.max-attempts:3}")
    private int retryMaxAttempts;

    @Value("${app.retry.initial-delay-ms:1000}")
    private long retryInitialDelayMs;

    @Value("${app.retry.max-delay-ms:10000}")
    private long retryMaxDelayMs;

    @Value("${app.retry.multiplier:2.0}")
    private double retryMultiplier;
}

