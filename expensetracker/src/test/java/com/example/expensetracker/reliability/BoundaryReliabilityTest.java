package com.example.expensetracker.reliability;

import com.example.expensetracker.dto.CategoryDto;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.exception.*;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.security.SecurityUser;
import com.example.expensetracker.service.CategoryService;
import com.example.expensetracker.testutil.AbstractPostgresContainerTest;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("Boundary Reliability Tests")
class BoundaryReliabilityTest extends AbstractPostgresContainerTest {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserRepository userRepository;

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
    @DisplayName("Should handle null category DTO")
    void shouldHandleNullCategoryDto() {
        // Given: null DTO
        CategoryDto nullDto = null;

        // When/Then: система викидає ValidationException
        assertThatThrownBy(() -> categoryService.create(nullDto))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Category data is required");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {" ", "   ", "\t", "\n", "\r\n"})
    @DisplayName("Should reject null, empty, and whitespace-only category names")
    void shouldRejectNullOrEmptyCategoryNames(String name) {
        // Given: category name that is null, empty, or whitespace
        CategoryDto dto = new CategoryDto();
        dto.setName(name);

        // When/Then: система викидає ValidationException
        assertThatThrownBy(() -> categoryService.create(dto))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Category name is required");
    }

    @Test
    @DisplayName("Should handle minimum valid category name length")
    void shouldHandleMinimumValidCategoryNameLength() {
        // Given: category name with minimum valid length (1 character)
        String minName = "A";
        CategoryDto dto = TestDataFactory.categoryDto(minName);

        // When: створюємо категорію
        CategoryDto created = categoryService.create(dto);

        // Then: категорія створена успішно
        assertThat(created).isNotNull();
        assertThat(created.getName()).isEqualTo(minName);
    }

    @Test
    @DisplayName("Should handle maximum valid category name length")
    void shouldHandleMaximumValidCategoryNameLength() {
        // Given: category name with maximum valid length (100 characters)
        String maxName = "A".repeat(100);
        CategoryDto dto = TestDataFactory.categoryDto(maxName);

        // When: створюємо категорію
        CategoryDto created = categoryService.create(dto);

        // Then: категорія створена успішно
        assertThat(created).isNotNull();
        assertThat(created.getName()).hasSize(100);
    }

    @Test
    @DisplayName("Should reject category name exceeding maximum length")
    void shouldRejectCategoryNameExceedingMaximumLength() {
        // Given: category name exceeding maximum length (101 characters)
        String tooLongName = "A".repeat(101);
        CategoryDto dto = TestDataFactory.categoryDto(tooLongName);

        // When/Then: система викидає ValidationException
        assertThatThrownBy(() -> categoryService.create(dto))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Category name must not exceed 100 characters");
    }

    @Test
    @DisplayName("Should handle extremely long category name")
    void shouldHandleExtremelyLongCategoryName() {
        // Given: category name that is extremely long (1000+ characters)
        String extremelyLongName = "A".repeat(1000);
        CategoryDto dto = TestDataFactory.categoryDto(extremelyLongName);

        // When/Then: система викидає ValidationException
        assertThatThrownBy(() -> categoryService.create(dto))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Category name must not exceed 100 characters");
    }

    @ParameterizedTest
    @ValueSource(longs = {0, -1, -100, Long.MIN_VALUE})
    @DisplayName("Should reject invalid category IDs (zero and negative)")
    void shouldRejectInvalidCategoryIds(Long invalidId) {
        // Given: invalid category ID
        CategoryDto dto = TestDataFactory.categoryDto("Test");

        // When/Then: система викидає ValidationException
        assertThatThrownBy(() -> categoryService.update(invalidId, dto))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Invalid category ID");
    }

    @Test
    @DisplayName("Should handle null category ID")
    void shouldHandleNullCategoryId() {
        // Given: null category ID
        Long nullId = null;
        CategoryDto dto = TestDataFactory.categoryDto("Test");

        // When/Then: система викидає ValidationException
        assertThatThrownBy(() -> categoryService.update(nullId, dto))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Invalid category ID");
    }

    @Test
    @DisplayName("Should handle maximum Long value as category ID")
    void shouldHandleMaximumLongValueAsCategoryId() {
        // Given: максимальне значення Long як ID
        Long maxId = Long.MAX_VALUE;
        CategoryDto dto = TestDataFactory.categoryDto("Test");

        // When/Then: система викидає CategoryNotFoundException (не ValidationException)
        // Це означає, що валідація пройшла, але категорія не знайдена
        assertThatThrownBy(() -> categoryService.update(maxId, dto))
                .isInstanceOf(com.example.expensetracker.exception.CategoryNotFoundException.class);
    }

    @Test
    @DisplayName("Should handle special characters in category name")
    void shouldHandleSpecialCharactersInCategoryName() {
        // Given: category name with special characters
        String specialChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
        CategoryDto dto = TestDataFactory.categoryDto(specialChars);

        // When: створюємо категорію
        // Then: система або створює категорію, або викидає ValidationException, але не падає
        try {
            CategoryDto created = categoryService.create(dto);
            assertThat(created).isNotNull();
            assertThat(created.getName()).isEqualTo(specialChars);
        } catch (ValidationException e) {
            // Якщо викидається виняток, це теж нормально
            assertThat(e.getMessage()).isNotNull();
        }
    }

    @Test
    @DisplayName("Should handle Unicode characters in category name")
    void shouldHandleUnicodeCharactersInCategoryName() {
        // Given: category name with Unicode characters
        String unicodeName = "Категорія 分类 категория 🏷️";
        CategoryDto dto = TestDataFactory.categoryDto(unicodeName);

        // When: створюємо категорію
        // Then: система обробляє Unicode коректно
        try {
            CategoryDto created = categoryService.create(dto);
            assertThat(created).isNotNull();
            assertThat(created.getName()).isEqualTo(unicodeName);
        } catch (ValidationException e) {
            // Якщо викидається виняток, це теж нормально
            assertThat(e.getMessage()).isNotNull();
        }
    }

    @Test
    @DisplayName("Should handle category name with only spaces")
    void shouldHandleCategoryNameWithOnlySpaces() {
        // Given: category name with only spaces
        String spacesOnly = "   ";
        CategoryDto dto = new CategoryDto();
        dto.setName(spacesOnly);

        // When/Then: система викидає ValidationException
        assertThatThrownBy(() -> categoryService.create(dto))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Category name is required");
    }

    @Test
    @DisplayName("Should handle category name at boundary of valid length")
    void shouldHandleCategoryNameAtBoundaryOfValidLength() {
        // Given: category name exactly at boundary (99, 100, 101 characters)
        
        // 99 characters - should be valid
        String name99 = "A".repeat(99);
        CategoryDto dto99 = TestDataFactory.categoryDto(name99);
        CategoryDto created99 = categoryService.create(dto99);
        assertThat(created99.getName()).hasSize(99);

        // 100 characters - should be valid
        String name100 = "A".repeat(100);
        CategoryDto dto100 = TestDataFactory.categoryDto(name100);
        CategoryDto created100 = categoryService.create(dto100);
        assertThat(created100.getName()).hasSize(100);

        // 101 characters - should be invalid
        String name101 = "A".repeat(101);
        CategoryDto dto101 = TestDataFactory.categoryDto(name101);
        assertThatThrownBy(() -> categoryService.create(dto101))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Category name must not exceed 100 characters");
    }
}

