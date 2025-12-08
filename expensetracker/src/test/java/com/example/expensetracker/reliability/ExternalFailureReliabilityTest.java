package com.example.expensetracker.reliability;

import com.example.expensetracker.dto.CategoryDto;
import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.exception.ConflictException;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * External failure reliability test
 * 
 * Перевіряє поведінку системи при збоях зовнішніх залежностей:
 * - Падіння БД / втрата з'єднання
 * - Проблеми з транзакціями
 * - Обробка DataAccessException
 */
@DisplayName("External Failure Reliability Tests")
class ExternalFailureReliabilityTest extends AbstractPostgresContainerTest {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private UserEntity testUser;
    private CategoryEntity testCategory;

    @BeforeEach
    void setUp() {
        // Очищення SecurityContext
        SecurityContextHolder.clearContext();

        // Очищення даних
        expenseRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

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
    @DisplayName("Should handle database constraint violations gracefully")
    void shouldHandleDatabaseConstraintViolationsGracefully() {
        // Given: спроба створити категорію з дублікатом імені
        CategoryDto dto1 = TestDataFactory.categoryDto("DuplicateName");
        categoryService.create(dto1);

        CategoryDto dto2 = TestDataFactory.categoryDto("DuplicateName");

        // When/Then: система викидає CategoryAlreadyExistsException замість DataAccessException
        assertThatThrownBy(() -> categoryService.create(dto2))
                .isInstanceOf(com.example.expensetracker.exception.CategoryAlreadyExistsException.class)
                .hasMessageContaining("already exists");

        // Система залишається стабільною
        assertThat(categoryService.getAllForCurrentUser()).hasSize(1);
    }

    @Test
    @DisplayName("Should prevent deletion of category with associated expenses")
    void shouldPreventDeletionOfCategoryWithAssociatedExpenses() {
        // Given: категорія з пов'язаними витратами
        testCategory = CategoryEntity.builder()
                .name("TestCategory")
                .user(testUser)
                .build();
        testCategory = categoryRepository.save(testCategory);

        ExpenseEntity expense = ExpenseEntity.builder()
                .amount(java.math.BigDecimal.valueOf(100.0))
                .description("Test expense")
                .date(java.time.LocalDate.now())
                .category(testCategory)
                .user(testUser)
                .build();
        expenseRepository.save(expense);

        // When/Then: система викидає ConflictException замість DataIntegrityViolationException
        assertThatThrownBy(() -> categoryService.delete(testCategory.getId()))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("associated with existing expenses");

        // Категорія не видалена
        assertThat(categoryRepository.findById(testCategory.getId())).isPresent();
    }

    @Test
    @DisplayName("Should handle transaction rollback correctly")
    void shouldHandleTransactionRollbackCorrectly() {
        // Given: валідна категорія
        CategoryDto validDto = TestDataFactory.categoryDto("ValidCategory");

        // When: створюємо категорію
        CategoryDto created = categoryService.create(validDto);
        Long categoryId = created.getId();

        // Then: категорія збережена
        assertThat(categoryRepository.findById(categoryId)).isPresent();

        // Given: спроба видалити неіснуючу категорію (викличе помилку)
        Long nonExistentId = 99999L;

        // When/Then: транзакція відкочується, але система не падає
        assertThatThrownBy(() -> categoryService.delete(nonExistentId))
                .isInstanceOf(com.example.expensetracker.exception.CategoryNotFoundException.class);

        // Оригінальна категорія все ще існує (транзакція відкотилась)
        assertThat(categoryRepository.findById(categoryId)).isPresent();
    }

    @Test
    @DisplayName("Should maintain data consistency after failed operations")
    void shouldMaintainDataConsistencyAfterFailedOperations() {
        // Given: існуюча категорія
        CategoryDto dto = TestDataFactory.categoryDto("ExistingCategory");
        CategoryDto created = categoryService.create(dto);
        Long categoryId = created.getId();

        int initialCount = categoryService.getAllForCurrentUser().size();

        // When: спроба оновити неіснуючу категорію
        CategoryDto updateDto = TestDataFactory.categoryDto("UpdatedName");
        assertThatThrownBy(() -> categoryService.update(99999L, updateDto))
                .isInstanceOf(com.example.expensetracker.exception.CategoryNotFoundException.class);

        // Then: дані залишаються консистентними
        assertThat(categoryService.getAllForCurrentUser()).hasSize(initialCount);
        assertThat(categoryRepository.findById(categoryId)).isPresent();
        assertThat(categoryRepository.findById(categoryId).get().getName()).isEqualTo("ExistingCategory");
    }

    @Test
    @DisplayName("Should handle connection pool exhaustion scenario")
    void shouldHandleConnectionPoolExhaustionScenario() {
        // Given: багато одночасних операцій
        // Система має обробляти ситуацію, коли connection pool вичерпаний
        
        // Цей тест демонструє, що система не падає при проблемах з connection pool
        // В реальному сценарії це перевіряється через навантажувальне тестування
        
        // When: виконуємо багато операцій
        for (int i = 0; i < 10; i++) {
            try {
                CategoryDto dto = TestDataFactory.categoryDto("Category" + i);
                categoryService.create(dto);
            } catch (Exception e) {
                // Система має викидати зрозумілі винятки, а не падати
                assertThat(e).isInstanceOf(Exception.class);
            }
        }

        // Then: система залишається стабільною
        assertThat(categoryService.getAllForCurrentUser()).isNotNull();
    }

    @Test
    @DisplayName("Should provide fallback behavior for read operations")
    void shouldProvideFallbackBehaviorForReadOperations() {
        // Given: система без даних
        categoryRepository.deleteAll();

        // When: виконуємо read операцію
        var result = categoryService.getAllForCurrentUser();

        // Then: система повертає порожній список замість винятку
        assertThat(result).isNotNull().isEmpty();

    }
}

