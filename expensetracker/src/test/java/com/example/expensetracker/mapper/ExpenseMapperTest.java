package com.example.expensetracker.mapper;

import com.example.expensetracker.dto.CreateExpenseRequest;
import com.example.expensetracker.dto.ExpenseResponse;
import com.example.expensetracker.dto.UpdateExpenseRequest;
import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("ExpenseMapper Tests")
class ExpenseMapperTest {

    private final ExpenseMapper mapper = new ExpenseMapper();

    @Test
    @DisplayName("Should map ExpenseEntity to ExpenseResponse correctly")
    void shouldMapExpenseEntityToResponse() {
        // Given
        UserEntity user = TestDataFactory.createUser(1L);
        CategoryEntity category = TestDataFactory.createCategory(1L, user);
        category.setName("Food");
        ExpenseEntity expense = TestDataFactory.createExpense(1L, user, category);
        expense.setAmount(BigDecimal.valueOf(100.50));
        expense.setDescription("Lunch");
        expense.setDate(LocalDate.of(2024, 1, 15));

        // When
        ExpenseResponse response = mapper.toResponse(expense);

        // Then
        assertThat(response)
                .extracting(
                        ExpenseResponse::getId,
                        ExpenseResponse::getCategoryId,
                        ExpenseResponse::getCategoryName,
                        ExpenseResponse::getAmount,
                        ExpenseResponse::getDescription,
                        ExpenseResponse::getDate
                )
                .containsExactly(
                        1L,
                        1L,
                        "Food",
                        BigDecimal.valueOf(100.50),
                        "Lunch",
                        LocalDate.of(2024, 1, 15)
                );
    }

    @Test
    @DisplayName("Should map CreateExpenseRequest to ExpenseEntity correctly")
    void shouldMapCreateRequestToEntity() {
        // Given
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setCategoryId(1L);
        request.setAmount(BigDecimal.valueOf(50.25));
        request.setDescription("Test expense");
        request.setDate(LocalDate.of(2024, 1, 20));

        // When
        ExpenseEntity entity = mapper.toEntity(request);

        // Then
        assertThat(entity)
                .extracting(
                        ExpenseEntity::getAmount,
                        ExpenseEntity::getDescription,
                        ExpenseEntity::getDate
                )
                .containsExactly(
                        BigDecimal.valueOf(50.25),
                        "Test expense",
                        LocalDate.of(2024, 1, 20)
                );
    }

    @Test
    @DisplayName("Should use current date when date is null in CreateExpenseRequest")
    void shouldUseCurrentDateWhenDateIsNull() {
        // Given
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setCategoryId(1L);
        request.setAmount(BigDecimal.valueOf(50.25));
        request.setDescription("Test expense");
        request.setDate(null);

        // When
        ExpenseEntity entity = mapper.toEntity(request);

        // Then
        assertThat(entity.getDate()).isEqualTo(LocalDate.now());
    }

    @Test
    @DisplayName("Should update ExpenseEntity from UpdateExpenseRequest correctly")
    void shouldUpdateEntityFromUpdateRequest() {
        // Given
        ExpenseEntity entity = TestDataFactory.createExpense(1L, 
                TestDataFactory.createUser(1L), 
                TestDataFactory.createCategory(1L, TestDataFactory.createUser(1L)));
        entity.setAmount(BigDecimal.valueOf(100.0));
        entity.setDescription("Old description");
        entity.setDate(LocalDate.of(2024, 1, 1));

        UpdateExpenseRequest request = new UpdateExpenseRequest();
        request.setCategoryId(2L);
        request.setAmount(BigDecimal.valueOf(200.0));
        request.setDescription("New description");
        request.setDate(LocalDate.of(2024, 2, 1));

        // When
        mapper.updateEntity(entity, request);

        // Then
        assertThat(entity)
                .extracting(
                        ExpenseEntity::getAmount,
                        ExpenseEntity::getDescription,
                        ExpenseEntity::getDate
                )
                .containsExactly(
                        BigDecimal.valueOf(200.0),
                        "New description",
                        LocalDate.of(2024, 2, 1)
                );
    }

    @Test
    @DisplayName("Should handle null category in ExpenseEntity")
    void shouldHandleNullCategory() {
        // Given
        ExpenseEntity expense = ExpenseEntity.builder()
                .id(1L)
                .amount(BigDecimal.valueOf(100.0))
                .category(null)
                .build();

        // When
        ExpenseResponse response = mapper.toResponse(expense);

        // Then
        assertThat(response.getCategoryId()).isNull();
        assertThat(response.getCategoryName()).isNull();
    }
}

