package com.example.expensetracker.specification;

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
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@DisplayName("ExpenseFilterSpecification Tests")
class ExpenseFilterSpecificationTest {

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
    private com.example.expensetracker.repository.ExpenseRepository expenseRepository;

    @Autowired
    private com.example.expensetracker.repository.CategoryRepository categoryRepository;

    @Autowired
    private com.example.expensetracker.repository.UserRepository userRepository;

    private UserEntity user;
    private CategoryEntity category1;
    private CategoryEntity category2;
    private ExpenseEntity expense1;
    private ExpenseEntity expense2;
    private ExpenseEntity expense3;

    @BeforeEach
    void setUp() {
        user = TestDataFactory.createUser();
        user = entityManager.persistAndFlush(user);

        category1 = TestDataFactory.createCategory(user);
        category1.setName("Food");
        category1 = entityManager.persistAndFlush(category1);

        category2 = TestDataFactory.createCategory(user);
        category2.setName("Transport");
        category2 = entityManager.persistAndFlush(category2);

        expense1 = TestDataFactory.createExpense(user, category1);
        expense1.setAmount(BigDecimal.valueOf(50.0));
        expense1.setDate(LocalDate.now().minusDays(5));
        expense1.setDescription("Lunch");
        expense1 = entityManager.persistAndFlush(expense1);

        expense2 = TestDataFactory.createExpense(user, category2);
        expense2.setAmount(BigDecimal.valueOf(100.0));
        expense2.setDate(LocalDate.now().minusDays(3));
        expense2.setDescription("Taxi");
        expense2 = entityManager.persistAndFlush(expense2);

        expense3 = TestDataFactory.createExpense(user, category1);
        expense3.setAmount(BigDecimal.valueOf(25.0));
        expense3.setDate(LocalDate.now().minusDays(1));
        expense3.setDescription("Dinner");
        expense3 = entityManager.persistAndFlush(expense3);

        entityManager.clear();
    }

    @Test
    @DisplayName("Should filter expenses by category ID")
    void shouldFilterExpensesByCategoryId() {
        // Given
        com.example.expensetracker.dto.ExpenseFilterRequest request = new com.example.expensetracker.dto.ExpenseFilterRequest();
        request.setCategoryId(category1.getId());
        Specification<ExpenseEntity> spec = ExpenseFilterSpecification.buildSpecification(
                user.getId(), request, null, null);

        // When
        List<ExpenseEntity> expenses = expenseRepository.findAll(spec);

        // Then
        assertThat(expenses).hasSize(2);
        assertThat(expenses).extracting(ExpenseEntity::getId)
                .containsExactlyInAnyOrder(expense1.getId(), expense3.getId());
    }

    @Test
    @DisplayName("Should filter expenses by amount range")
    void shouldFilterExpensesByAmountRange() {
        // Given
        com.example.expensetracker.dto.ExpenseFilterRequest request = new com.example.expensetracker.dto.ExpenseFilterRequest();
        request.setMinAmount(BigDecimal.valueOf(50.0));
        request.setMaxAmount(BigDecimal.valueOf(100.0));
        Specification<ExpenseEntity> spec = ExpenseFilterSpecification.buildSpecification(
                user.getId(), request, null, null);

        // When
        List<ExpenseEntity> expenses = expenseRepository.findAll(spec);

        // Then
        assertThat(expenses).hasSize(2);
        assertThat(expenses).extracting(ExpenseEntity::getId)
                .containsExactlyInAnyOrder(expense1.getId(), expense2.getId());
    }

    @Test
    @DisplayName("Should filter expenses by date range")
    void shouldFilterExpensesByDateRange() {
        // Given
        com.example.expensetracker.dto.ExpenseFilterRequest request = new com.example.expensetracker.dto.ExpenseFilterRequest();
        request.setFromDate(LocalDate.now().minusDays(4));
        request.setToDate(LocalDate.now());
        Specification<ExpenseEntity> spec = ExpenseFilterSpecification.buildSpecification(
                user.getId(), request, null, null);

        // When
        List<ExpenseEntity> expenses = expenseRepository.findAll(spec);

        // Then
        assertThat(expenses).hasSize(2);
        assertThat(expenses).extracting(ExpenseEntity::getId)
                .containsExactlyInAnyOrder(expense2.getId(), expense3.getId());
    }

    @Test
    @DisplayName("Should filter expenses by search term in description")
    void shouldFilterExpensesBySearchTerm() {
        // Given
        com.example.expensetracker.dto.ExpenseFilterRequest request = new com.example.expensetracker.dto.ExpenseFilterRequest();
        request.setSearch("Lunch");
        Specification<ExpenseEntity> spec = ExpenseFilterSpecification.buildSpecification(
                user.getId(), request, null, null);

        // When
        List<ExpenseEntity> expenses = expenseRepository.findAll(spec);

        // Then
        assertThat(expenses).hasSize(1);
        assertThat(expenses.get(0).getId()).isEqualTo(expense1.getId());
    }

    @Test
    @DisplayName("Should combine multiple filters")
    void shouldCombineMultipleFilters() {
        // Given
        com.example.expensetracker.dto.ExpenseFilterRequest request = new com.example.expensetracker.dto.ExpenseFilterRequest();
        request.setCategoryId(category1.getId());
        request.setMinAmount(BigDecimal.valueOf(30.0));
        Specification<ExpenseEntity> spec = ExpenseFilterSpecification.buildSpecification(
                user.getId(), request, null, null);

        // When
        List<ExpenseEntity> expenses = expenseRepository.findAll(spec);

        // Then
        assertThat(expenses).hasSize(1);
        assertThat(expenses.get(0).getId()).isEqualTo(expense1.getId());
    }
}

