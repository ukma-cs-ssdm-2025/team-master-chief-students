package com.example.expensetracker.repository;

import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@DisplayName("ExpenseRepository Tests")
class ExpenseRepositoryTest {

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
    private ExpenseRepository expenseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    private UserEntity user;
    private CategoryEntity category;

    @BeforeEach
    void setUp() {
        user = TestDataFactory.createUser();
        user = entityManager.persistAndFlush(user);

        category = TestDataFactory.createCategory(user);
        category = entityManager.persistAndFlush(category);
    }

    @Test
    @DisplayName("Should find expense by ID and user ID")
    void shouldFindExpenseByIdAndUserId() {
        // Given
        ExpenseEntity expense = TestDataFactory.createExpense(user, category);
        expense = entityManager.persistAndFlush(expense);

        // When
        Optional<ExpenseEntity> found = expenseRepository.findByIdAndUserId(expense.getId(), user.getId());

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getId()).isEqualTo(expense.getId());
        assertThat(found.get().getUser().getId()).isEqualTo(user.getId());
    }

    @Test
    @DisplayName("Should return empty when expense belongs to different user")
    void shouldReturnEmptyWhenExpenseBelongsToDifferentUser() {
        // Given
        UserEntity otherUser = TestDataFactory.createUser();
        otherUser = entityManager.persistAndFlush(otherUser);

        ExpenseEntity expense = TestDataFactory.createExpense(user, category);
        expense = entityManager.persistAndFlush(expense);

        // When
        Optional<ExpenseEntity> found = expenseRepository.findByIdAndUserId(expense.getId(), otherUser.getId());

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("Should find expenses by user ID ordered by created_at DESC, id DESC")
    void shouldFindExpensesByUserIdOrdered() {
        // Given
        ExpenseEntity expense1 = TestDataFactory.createExpense(user, category);
        expense1.setCreatedAt(Instant.now().minusSeconds(100));
        expense1 = entityManager.persistAndFlush(expense1);

        ExpenseEntity expense2 = TestDataFactory.createExpense(user, category);
        expense2.setCreatedAt(Instant.now().minusSeconds(50));
        expense2 = entityManager.persistAndFlush(expense2);

        ExpenseEntity expense3 = TestDataFactory.createExpense(user, category);
        expense3.setCreatedAt(Instant.now());
        expense3 = entityManager.persistAndFlush(expense3);

        entityManager.clear();

        // When
        List<ExpenseEntity> expenses = expenseRepository.findByUserIdOrdered(
                user.getId(),
                PageRequest.of(0, 10)
        );

        // Then
        assertThat(expenses).hasSize(3);
        assertThat(expenses.get(0).getId()).isEqualTo(expense3.getId());
        assertThat(expenses.get(1).getId()).isEqualTo(expense2.getId());
        assertThat(expenses.get(2).getId()).isEqualTo(expense1.getId());
    }

    @Test
    @DisplayName("Should find expenses with cursor pagination")
    void shouldFindExpensesWithCursor() {
        // Given
        Instant baseTime = Instant.now();
        
        ExpenseEntity expense1 = TestDataFactory.createExpense(user, category);
        expense1.setCreatedAt(baseTime.minusSeconds(100));
        expense1 = entityManager.persistAndFlush(expense1);

        ExpenseEntity expense2 = TestDataFactory.createExpense(user, category);
        expense2.setCreatedAt(baseTime.minusSeconds(50));
        expense2 = entityManager.persistAndFlush(expense2);

        ExpenseEntity expense3 = TestDataFactory.createExpense(user, category);
        expense3.setCreatedAt(baseTime);
        expense3 = entityManager.persistAndFlush(expense3);

        entityManager.clear();

        // When
        List<ExpenseEntity> expenses = expenseRepository.findByUserIdWithCursor(
                user.getId(),
                expense3.getCreatedAt(),
                expense3.getId(),
                PageRequest.of(0, 10)
        );

        // Then
        assertThat(expenses).hasSize(2);
        assertThat(expenses.get(0).getId()).isEqualTo(expense2.getId());
        assertThat(expenses.get(1).getId()).isEqualTo(expense1.getId());
    }

    @Test
    @DisplayName("Should check if expense exists by ID and user ID")
    void shouldCheckIfExpenseExistsByIdAndUserId() {
        // Given
        ExpenseEntity expense = TestDataFactory.createExpense(user, category);
        expense = entityManager.persistAndFlush(expense);

        // When
        boolean exists = expenseRepository.existsByIdAndUserId(expense.getId(), user.getId());
        boolean notExists = expenseRepository.existsByIdAndUserId(999L, user.getId());

        // Then
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    @DisplayName("Should fetch category and user with JOIN FETCH")
    void shouldFetchCategoryAndUserWithJoinFetch() {
        // Given
        ExpenseEntity expense = TestDataFactory.createExpense(user, category);
        expense = entityManager.persistAndFlush(expense);
        entityManager.clear();

        // When
        Optional<ExpenseEntity> found = expenseRepository.findByIdAndUserId(expense.getId(), user.getId());

        // Then
        assertThat(found).isPresent();
        ExpenseEntity expenseEntity = found.get();
        
        assertThat(expenseEntity.getCategory()).isNotNull();
        assertThat(expenseEntity.getCategory().getName()).isEqualTo(category.getName());
        assertThat(expenseEntity.getCategory().getId()).isEqualTo(category.getId());
        
        assertThat(expenseEntity.getUser()).isNotNull();
        assertThat(expenseEntity.getUser().getEmail()).isEqualTo(user.getEmail());
        assertThat(expenseEntity.getUser().getId()).isEqualTo(user.getId());
        
        assertThat(expenseEntity.getCategory().getClass().getSimpleName())
                .isEqualTo("CategoryEntity");
        assertThat(expenseEntity.getUser().getClass().getSimpleName())
                .isEqualTo("UserEntity");
    }
}

