package com.example.expensetracker.service;

import com.example.expensetracker.dto.CreateExpenseRequest;
import com.example.expensetracker.dto.ExpenseResponse;
import com.example.expensetracker.dto.UpdateExpenseRequest;
import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.exception.CategoryNotFoundException;
import com.example.expensetracker.exception.NotFoundException;
import com.example.expensetracker.exception.ValidationException;
import com.example.expensetracker.mapper.ExpenseMapper;
import com.example.expensetracker.repository.CategoryRepository;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.service.impl.ExpenseServiceImpl;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ExpenseService Unit Tests")
class ExpenseServiceImplTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ExpenseMapper mapper;

    @Spy
    @InjectMocks
    private ExpenseServiceImpl expenseService;

    private UserEntity testUser;

    @BeforeEach
    void setUp() {
        testUser = TestDataFactory.createUser(1L);
        lenient().doReturn(testUser).when(expenseService).getAuthenticatedUser();
    }

    @Test
    @DisplayName("Should create expense successfully")
    void shouldCreateExpenseSuccessfully() {
        // Given
        CategoryEntity category = TestDataFactory.createCategory(1L, testUser);
        CreateExpenseRequest request = TestDataFactory.createExpenseRequest(1L);
        ExpenseEntity savedEntity = TestDataFactory.createExpense(1L, testUser, category);
        ExpenseResponse expectedResponse = ExpenseResponse.builder()
                .id(1L)
                .categoryId(1L)
                .amount(request.getAmount())
                .build();

        when(categoryRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(category));
        when(expenseRepository.save(any(ExpenseEntity.class))).thenReturn(savedEntity);
        when(mapper.toResponse(savedEntity)).thenReturn(expectedResponse);
        when(mapper.toEntity(request)).thenReturn(ExpenseEntity.builder()
                .amount(request.getAmount())
                .description(request.getDescription())
                .date(request.getDate())
                .build());

        // When
        ExpenseResponse result = expenseService.create(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getCategoryId()).isEqualTo(1L);
        verify(expenseRepository).save(any(ExpenseEntity.class));
    }

    @Test
    @DisplayName("Should throw ValidationException when category ID is null")
    void shouldThrowValidationExceptionWhenCategoryIdIsNull() {
        // Given
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setCategoryId(null);
        request.setAmount(BigDecimal.valueOf(100));

        // When/Then
        assertThatThrownBy(() -> expenseService.create(request))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Category ID is required");
    }

    @Test
    @DisplayName("Should throw ValidationException when amount is null")
    void shouldThrowValidationExceptionWhenAmountIsNull() {
        // Given
        CategoryEntity category = TestDataFactory.createCategory(1L, testUser);
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setCategoryId(1L);
        request.setAmount(null);

        when(categoryRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(category));

        // When/Then
        assertThatThrownBy(() -> expenseService.create(request))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Amount is required");
    }

    @ParameterizedTest
    @ValueSource(doubles = {0.0, -1.0, -100.0})
    @DisplayName("Should throw ValidationException when amount is zero or negative")
    void shouldThrowValidationExceptionWhenAmountIsZeroOrNegative(double amount) {
        // Given
        CategoryEntity category = TestDataFactory.createCategory(1L, testUser);
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setCategoryId(1L);
        request.setAmount(BigDecimal.valueOf(amount));

        when(categoryRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(category));

        // When/Then
        assertThatThrownBy(() -> expenseService.create(request))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Amount must be greater than 0");
    }

    @Test
    @DisplayName("Should throw ValidationException when date is in the future")
    void shouldThrowValidationExceptionWhenDateIsInFuture() {
        // Given
        CategoryEntity category = TestDataFactory.createCategory(1L, testUser);
        CreateExpenseRequest request = TestDataFactory.createExpenseRequest(1L);
        request.setDate(LocalDate.now().plusDays(1));

        when(categoryRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(category));

        // When/Then
        assertThatThrownBy(() -> expenseService.create(request))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Expense date cannot be in the future");
    }

    @Test
    @DisplayName("Should throw CategoryNotFoundException when category not found")
    void shouldThrowCategoryNotFoundExceptionWhenCategoryNotFound() {
        // Given
        CreateExpenseRequest request = TestDataFactory.createExpenseRequest(999L);

        when(categoryRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> expenseService.create(request))
                .isInstanceOf(CategoryNotFoundException.class)
                .hasMessageContaining("Category not found");
    }

    @Test
    @DisplayName("Should get expense by ID successfully")
    void shouldGetExpenseByIdSuccessfully() {
        // Given
        CategoryEntity category = TestDataFactory.createCategory(1L, testUser);
        ExpenseEntity expense = TestDataFactory.createExpense(1L, testUser, category);
        ExpenseResponse expectedResponse = ExpenseResponse.builder()
                .id(1L)
                .categoryId(1L)
                .build();

        when(expenseRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(expense));
        when(mapper.toResponse(expense)).thenReturn(expectedResponse);

        // When
        ExpenseResponse result = expenseService.getById(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should throw NotFoundException when expense not found")
    void shouldThrowNotFoundExceptionWhenExpenseNotFound() {
        // Given
        when(expenseRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> expenseService.getById(999L))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("Expense not found");
    }

    @Test
    @DisplayName("Should throw ValidationException when ID is invalid")
    void shouldThrowValidationExceptionWhenIdIsInvalid() {
        // When/Then
        assertThatThrownBy(() -> expenseService.getById(null))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Invalid expense ID");

        assertThatThrownBy(() -> expenseService.getById(0L))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Invalid expense ID");

        assertThatThrownBy(() -> expenseService.getById(-1L))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Invalid expense ID");
    }

    @Test
    @DisplayName("Should update expense successfully")
    void shouldUpdateExpenseSuccessfully() {
        // Given
        CategoryEntity category = TestDataFactory.createCategory(1L, testUser);
        ExpenseEntity expense = TestDataFactory.createExpense(1L, testUser, category);
        UpdateExpenseRequest request = TestDataFactory.updateExpenseRequest(1L);
        ExpenseResponse expectedResponse = ExpenseResponse.builder()
                .id(1L)
                .amount(request.getAmount())
                .build();

        when(expenseRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(expense));
        when(categoryRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(category));
        when(expenseRepository.save(expense)).thenReturn(expense);
        when(mapper.toResponse(expense)).thenReturn(expectedResponse);

        // When
        ExpenseResponse result = expenseService.update(1L, request);

        // Then
        assertThat(result).isNotNull();
        verify(mapper).updateEntity(eq(expense), eq(request));
    }

    @Test
    @DisplayName("Should delete expense successfully")
    void shouldDeleteExpenseSuccessfully() {
        // Given
        when(expenseRepository.existsByIdAndUserId(1L, 1L)).thenReturn(true);

        // When
        expenseService.delete(1L);

        // Then
        verify(expenseRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw NotFoundException when deleting non-existent expense")
    void shouldThrowNotFoundExceptionWhenDeletingNonExistentExpense() {
        // Given
        when(expenseRepository.existsByIdAndUserId(999L, 1L)).thenReturn(false);

        // When/Then
        assertThatThrownBy(() -> expenseService.delete(999L))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("Expense not found");
    }
}
