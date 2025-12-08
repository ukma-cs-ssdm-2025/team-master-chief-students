package com.example.expensetracker.repository;

import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.testutil.factory.TestDataFactory;
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
@DisplayName("UserRepository Tests")
public class UserRepositoryTest {

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
    private UserRepository userRepository;

    @Test
    @DisplayName("Test findByEmail returns user when email exists")
    void testFindByEmailExists() {
        UserEntity user = TestDataFactory.createUser();
        entityManager.persistAndFlush(user);

        Optional<UserEntity> foundUser = userRepository.findByEmail(user.getEmail());

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo(user.getEmail());
    }

    @Test
    @DisplayName("Test findByEmail returns empty when email does not exist")
    void testFindByEmailNotExists() {
        Optional<UserEntity> foundUser = userRepository.findByEmail("blabla@mail.com");
        assertThat(foundUser).isNotPresent();
    }

    @Test
    @DisplayName("Test create and retrieve user")
    void testCreateAndRetrieveUser() {
        UserEntity user = TestDataFactory.createUser();
        entityManager.persistAndFlush(user);

        Optional<UserEntity> retrievedUser = userRepository.findById(user.getId());

        assertThat(retrievedUser).isPresent();
        assertThat(retrievedUser.get().getEmail()).isEqualTo(user.getEmail());
    }

    @Test
    @DisplayName("Test delete user")
    void testDeleteUser() {
        UserEntity user = TestDataFactory.createUser();
        entityManager.persistAndFlush(user);

        userRepository.delete(user);
        entityManager.flush();

        Optional<UserEntity> deletedUser = userRepository.findById(user.getId());
        assertThat(deletedUser).isNotPresent();
    }

    @Test
    @DisplayName("Test update user")
    void testUpdateUser() {
        UserEntity user = TestDataFactory.createUser();
        entityManager.persistAndFlush(user);

        user.setEmail("blabla@mail.com");
        userRepository.save(user);
        entityManager.flush();
        Optional<UserEntity> updatedUser = userRepository.findById(user.getId());

        assertThat(updatedUser).isPresent();
        assertThat(updatedUser.get().getEmail()).isEqualTo("blabla@mail.com");
    }
}
