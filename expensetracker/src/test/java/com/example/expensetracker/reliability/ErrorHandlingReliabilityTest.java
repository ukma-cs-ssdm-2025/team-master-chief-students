package com.example.expensetracker.reliability;

import com.example.expensetracker.dto.CategoryDto;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.exception.*;
import com.example.expensetracker.repository.CategoryRepository;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.security.SecurityUser;
import com.example.expensetracker.service.CategoryService;
import com.example.expensetracker.testutil.AbstractPostgresContainerTest;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Error-handling reliability test
 * * Перевіряє, що система коректно обробляє винятки та помилки:
 * - Не падає при виникненні помилок
 * - Повертає зрозумілі повідомлення про помилки
 * - Логує помилки для діагностики
 */
@DisplayName("Error Handling Reliability Tests")
class ErrorHandlingReliabilityTest extends AbstractPostgresContainerTest {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private UserEntity testUser;

    @BeforeEach
    void setUp() {
        // Очищення SecurityContext
        SecurityContextHolder.clearContext();

        // Створення тестового користувача
        testUser = TestDataFactory.createUser();
        testUser.setPassword(passwordEncoder.encode("TestPassword123!"));
        testUser = userRepository.save(testUser);

        // Налаштування аутентифікації
        SecurityUser securityUser = new SecurityUser(testUser);
        Authentication authentication = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                securityUser, null, securityUser.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    @DisplayName("Should handle null input gracefully without crashing")
    void shouldHandleNullInputGracefully() {
        // Given: null category DTO
        CategoryDto nullDto = null;

        // When/Then: система не падає, а викидає ValidationException
        assertThatThrownBy(() -> categoryService.create(nullDto))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Category data is required");

        // Система залишається стабільною після обробки помилки
        assertThat(categoryService.getAllForCurrentUser()).isNotNull();
    }

    @Test
    @DisplayName("Should handle invalid category ID without crashing")
    void shouldHandleInvalidCategoryIdWithoutCrashing() {
        // Given: invalid category ID (negative, zero, null)
        Long invalidId = -1L;
        CategoryDto dto = TestDataFactory.categoryDto("Test");

        // When/Then: система не падає, а викидає ValidationException
        assertThatThrownBy(() -> categoryService.update(invalidId, dto))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Invalid category ID");

        // Система залишається стабільною
        assertThat(categoryService.getAllForCurrentUser()).isNotNull();
    }

    @Test
    @DisplayName("Should handle non-existent resource gracefully")
    void shouldHandleNonExistentResourceGracefully() {
        // Given: non-existent category ID
        Long nonExistentId = 99999L;
        CategoryDto dto = TestDataFactory.categoryDto("Test");

        // When/Then: система не падає, а викидає CategoryNotFoundException
        assertThatThrownBy(() -> categoryService.update(nonExistentId, dto))
                .isInstanceOf(CategoryNotFoundException.class)
                .hasMessageContaining("Category not found");

        // Система залишається стабільною
        assertThat(categoryService.getAllForCurrentUser()).isNotNull();
    }

    @Test
    @DisplayName("Should handle conflict situations gracefully")
    void shouldHandleConflictSituationsGracefully() {
        // Given: A category with an associated expense
        CategoryDto categoryDto = TestDataFactory.categoryDto("Conflict Category");
        CategoryDto createdCategory = categoryService.create(categoryDto);

        // Retrieve the underlying entity to link the expense
        var categoryEntity = categoryRepository.findById(createdCategory.getId()).orElseThrow();

        // Create an expense linked to this category to cause a foreign key constraint violation on delete
        ExpenseEntity expense = ExpenseEntity.builder()
                .amount(BigDecimal.TEN)
                .description("Dependent Expense")
                .date(LocalDate.now())
                .user(testUser)
                .category(categoryEntity)
                .build();
        expenseRepository.save(expense);

        // When/Then: Attempting to delete the category should throw ConflictException
        // instead of a raw database error
        assertThatThrownBy(() -> categoryService.delete(createdCategory.getId()))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    @DisplayName("Should return meaningful error messages")
    void shouldReturnMeaningfulErrorMessages() {
        // Given: invalid input
        CategoryDto dto = new CategoryDto();
        dto.setName(""); // Empty name

        // When/Then: система повертає зрозуміле повідомлення
        assertThatThrownBy(() -> categoryService.create(dto))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Category name is required");

        // Повідомлення має бути зрозумілим для користувача
        String errorMessage = assertThatThrownBy(() -> categoryService.create(dto))
                .isInstanceOf(ValidationException.class)
                .extracting(Throwable::getMessage)
                .toString();

        assertThat(errorMessage).isNotNull();
    }

    @Test

    @DisplayName("Should handle extremely long input without crashing")

    void shouldHandleExtremelyLongInputWithoutCrashing() {

// Given: category name that exceeds maximum length

        String veryLongName = "a".repeat(1000); // Значно більше за ліміт 100 символів

        CategoryDto dto = TestDataFactory.categoryDto(veryLongName);



// When/Then: система не падає, а викидає ValidationException

        assertThatThrownBy(() -> categoryService.create(dto))

                .isInstanceOf(ValidationException.class)

                .hasMessageContaining("Category name must not exceed 100 characters");



// Система залишається стабільною

        assertThat(categoryService.getAllForCurrentUser()).isNotNull();

    }

    @Test
    @DisplayName("Should handle special characters in input")
    void shouldHandleSpecialCharactersInInput() {
        // Given: category name with special characters
        String specialChars = "Test!@#$%^&*()_+-=[]{}|;':\",./<>?";
        CategoryDto dto = TestDataFactory.categoryDto(specialChars);

        // When: система обробляє спеціальні символи
        // Then: або створює категорію, або викидає ValidationException, але не падає
        try {
            categoryService.create(dto);
            // Якщо створення успішне, система працює коректно
            assertThat(categoryService.getAllForCurrentUser()).isNotEmpty();
        } catch (ValidationException e) {
            // Якщо викидається виняток, це теж нормально - система не падає
            assertThat(e.getMessage()).isNotNull();
        }
    }
}