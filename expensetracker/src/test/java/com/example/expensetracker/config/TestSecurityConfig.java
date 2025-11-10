package com.example.expensetracker.config;

import jakarta.validation.Validator;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

/**
 * Test configuration for WebMvc tests.
 * Provides Validator bean for method parameter validation in @WebMvcTest context.
 */
@TestConfiguration
public class TestSecurityConfig {

    /**
     * Provides Validator bean for method parameter validation in controllers.
     * Required for @Valid annotations on @RequestBody parameters in @WebMvcTest.
     * After adding spring-boot-starter-validation, Hibernate Validator will be available.
     */
    @Bean
    public Validator validator() {
        LocalValidatorFactoryBean factory = new LocalValidatorFactoryBean();
        factory.afterPropertiesSet();
        return factory.getValidator();
    }
}

