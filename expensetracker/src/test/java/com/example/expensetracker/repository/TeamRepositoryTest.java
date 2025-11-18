package com.example.expensetracker.repository;

import com.example.expensetracker.entity.TeamEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@DisplayName("ExpenseRepository Tests")
public class TeamRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("expense_tracker_test")
            .withUsername("test")
            .withPassword("test")
            .withReuse(true);

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.enabled", () -> "true");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
    }

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TeamRepository teamRepository;

    private UserEntity user;

    @BeforeEach
    void setUp() {
        user = TestDataFactory.createUser();
        entityManager.persistAndFlush(user);
    }

    @Test
    @DisplayName("Test create and retrieve team")
    void testCreateAndRetrieveTeam() {
        TeamEntity team = TestDataFactory.createTeam(user);
        entityManager.persistAndFlush(team);

        Optional<TeamEntity> foundTeam = teamRepository.findById(team.getId());

        assertThat(foundTeam).isPresent();
        assertThat(foundTeam.get().getName()).isEqualTo(team.getName());
    }

    @Test
    @DisplayName("Test delete team")
    void testDeleteTeam() {
        TeamEntity team = TestDataFactory.createTeam(user);
        entityManager.persistAndFlush(team);

        teamRepository.delete(team);
        entityManager.flush();

        Optional<TeamEntity> foundTeam = teamRepository.findById(team.getId());
        assertThat(foundTeam).isNotPresent();
    }

    @Test
    @DisplayName("Test update team")
    void testUpdateTeam() {
        TeamEntity team = TestDataFactory.createTeam(user);
        entityManager.persistAndFlush(team);

        team.setName("Updated Team Name");
        teamRepository.save(team);
        entityManager.flush();

        Optional<TeamEntity> foundTeam = teamRepository.findById(team.getId());
        assertThat(foundTeam).isPresent();
        assertThat(foundTeam.get().getName()).isEqualTo("Updated Team Name");
    }
}
