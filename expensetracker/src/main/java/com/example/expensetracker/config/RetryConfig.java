package com.example.expensetracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;

/**
 * Enables Spring Retry with exponential backoff support.
 */
@Configuration
@EnableRetry
public class RetryConfig {
}

