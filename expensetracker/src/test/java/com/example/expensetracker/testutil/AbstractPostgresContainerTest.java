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
        boolean dockerAvailable = DockerClientFactory.instance().isDockerAvailable();
        
        if (dockerAvailable) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl);
            registry.add("spring.datasource.username", postgres::getUsername);
            registry.add("spring.datasource.password", postgres::getPassword);
            registry.add("spring.flyway.enabled", () -> "true");
            registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        } else {
            registry.add("spring.datasource.url", () -> "jdbc:h2:mem:testdb");
            registry.add("spring.datasource.username", () -> "sa");
            registry.add("spring.datasource.password", () -> "");
            registry.add("spring.datasource.driver-class-name", () -> "org.h2.Driver");
            registry.add("spring.flyway.enabled", () -> "false");
            registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        }
        
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

