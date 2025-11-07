package com.example.expensetracker.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {
    private Pagination pagination = new Pagination();

    @Getter
    @Setter
    public static class Pagination {
        private int minLimit = 1;
        private int maxLimit = 100;
    }

    public int getPaginationMinLimit() {
        return pagination.getMinLimit();
    }

    public int getPaginationMaxLimit() {
        return pagination.getMaxLimit();
    }
}

