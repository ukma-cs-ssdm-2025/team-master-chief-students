package com.example.expensetracker.repository;

import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.ReceiptEntity;
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

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@DisplayName("ReceiptRepository Tests")
public class ReceiptRepositoryTest {

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
    private ReceiptRepository receiptRepository;

    private UserEntity user;
    private CategoryEntity category;
    private ExpenseEntity expense;

    @BeforeEach
    void setUp() {
        user = TestDataFactory.createUser();
        user = entityManager.persistAndFlush(user);

        category = TestDataFactory.createCategory(user);
        category = entityManager.persistAndFlush(category);

        expense = TestDataFactory.createExpense(user, category);
        expense = entityManager.persistAndFlush(expense);
    }

    @Test
    @DisplayName("Should save and retrieve receipt by expense")
    void testSaveAndRetrieveReceiptByExpense() {
        // Given
        ReceiptEntity receipt = TestDataFactory.createReceipt(expense);
        receipt = entityManager.persistAndFlush(receipt);

        // When
        ReceiptEntity foundReceipt = receiptRepository.findByExpense_Id(expense.getId());

        // Then
        assertThat(foundReceipt).isNotNull();
        assertThat(foundReceipt.getId()).isEqualTo(receipt.getId());
        assertThat(foundReceipt.getFileUrl()).isEqualTo(receipt.getFileUrl());
        assertThat(foundReceipt.getExpense().getId()).isEqualTo(expense.getId());
    }

    @Test
    @DisplayName("Should return null when no receipt found for expense")
    void testReturnNullWhenNoReceiptFoundForExpense() {
        // When
        ReceiptEntity foundReceipt = receiptRepository.findByExpense_Id(expense.getId());

        // Then
        assertThat(foundReceipt).isNull();
    }

    @Test
    @DisplayName("Should save receipt")
    void testSaveReceipt() {
        // Given
        ReceiptEntity receipt = TestDataFactory.createReceipt(expense);

        // When
        ReceiptEntity savedReceipt = receiptRepository.save(receipt);

        // Then
        assertThat(savedReceipt.getId()).isNotNull();
        assertThat(savedReceipt.getFileUrl()).isEqualTo(receipt.getFileUrl());
        assertThat(savedReceipt.getExpense().getId()).isEqualTo(expense.getId());
    }

    @Test
    @DisplayName("Should delete receipt")
    void testDeleteReceipt() {
        // Given
        ReceiptEntity receipt = TestDataFactory.createReceipt(expense);
        receipt = entityManager.persistAndFlush(receipt);

        // When
        receiptRepository.delete(receipt);
        ReceiptEntity foundReceipt = receiptRepository.findByExpense_Id(expense.getId());

        // Then
        assertThat(foundReceipt).isNull();
    }

    @Test
    @DisplayName("Should update receipt")
    void testUpdateReceipt() {
        // Given
        ReceiptEntity receipt = TestDataFactory.createReceipt(expense);
        receipt = entityManager.persistAndFlush(receipt);

        // When
        String newFileUrl = "/uploads/updated_" + receipt.getId() + ".jpg";
        receipt.setFileUrl(newFileUrl);
        ReceiptEntity updatedReceipt = receiptRepository.save(receipt);
        ReceiptEntity foundReceipt = receiptRepository.findByExpense_Id(expense.getId());

        // Then
        assertThat(updatedReceipt.getFileUrl()).isEqualTo(newFileUrl);
        assertThat(foundReceipt.getFileUrl()).isEqualTo(newFileUrl);
    }

    @Test
    @DisplayName("Should find receipt by expense ID")
    void testFindReceiptByExpenseId() {
        // Given
        ReceiptEntity receipt = TestDataFactory.createReceipt(expense);
        receipt = entityManager.persistAndFlush(receipt);

        // When
        ReceiptEntity foundReceipt = receiptRepository.findByExpense_Id(expense.getId());

        // Then
        assertThat(foundReceipt).isNotNull();
        assertThat(foundReceipt.getId()).isEqualTo(receipt.getId());
    }

    @Test
    @DisplayName("Should not find receipt for non-existent expense ID")
    void testNotFindReceiptForNonExistentExpenseId() {
        // When
        ReceiptEntity foundReceipt = receiptRepository.findByExpense_Id(9999L);

        // Then
        assertThat(foundReceipt).isNull();
    }
}
