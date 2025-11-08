package com.example.expensetracker.testutil;

import org.junit.jupiter.api.BeforeAll;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assumptions.assumeTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
public abstract class AbstractPostgresContainerTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("expense_tracker_test")
            .withUsername("test")
            .withPassword("test")
            .withReuse(true);

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // Ensure container is started before accessing its properties
        // Testcontainers should start it automatically, but we ensure it's running
        if (!postgres.isRunning()) {
            postgres.start();
        }
        
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.enabled", () -> "true");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        
        registry.add("jwt.secret", () -> "test-access-secret-key-for-integration-tests-min-32-chars");
        registry.add("jwt.refresh-secret", () -> "test-refresh-secret-key-for-integration-tests-min-32-chars");
        registry.add("jwt.expiration-ms", () -> "900000"); // 15 minutes
        registry.add("jwt.refresh-expiration-ms", () -> "2592000000"); // 30 days
    }

    @BeforeAll
    static void checkDockerAvailable() {
        assumeTrue(
                DockerClientFactory.instance().isDockerAvailable(),
                "Docker is not available. Skipping integration tests that require Testcontainers."
        );
    }
}

