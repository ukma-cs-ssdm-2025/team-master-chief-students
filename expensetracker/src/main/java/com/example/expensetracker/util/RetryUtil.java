package com.example.expensetracker.util;

import com.example.expensetracker.config.AppProperties;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import java.util.function.Supplier;

@Component
@RequiredArgsConstructor
public class RetryUtil {

    private static final Logger logger = LogManager.getLogger(RetryUtil.class);
    private final AppProperties appProperties;

    public <T> T executeWithRetry(Supplier<T> operation) {
        int maxAttempts = appProperties.getRetryMaxAttempts();
        long delay = appProperties.getRetryInitialDelayMs();
        double multiplier = appProperties.getRetryMultiplier();
        long maxDelay = appProperties.getRetryMaxDelayMs();

        RuntimeException lastException = null;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return operation.get();
            } catch (RuntimeException e) {
                lastException = e;
                logger.warn("Operation failed (attempt {}/{}): {}", attempt, maxAttempts, e.getMessage());

                if (attempt < maxAttempts) {
                    try {
                        Thread.sleep(delay);
                        delay = Math.min((long) (delay * multiplier), maxDelay);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Retry interrupted", ie);
                    }
                }
            }
        }

        logger.error("Operation failed after {} attempts", maxAttempts);
        throw lastException != null ? lastException : new RuntimeException("Operation failed after retries");
    }

    public void executeWithRetry(Runnable operation) {
        executeWithRetry(() -> {
            operation.run();
            return null;
        });
    }
}

