package com.example.expensetracker.service;

import com.example.expensetracker.dto.CategoryDto;
import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.exception.CategoryAlreadyExistsException;
import com.example.expensetracker.exception.CategoryNotFoundException;
import com.example.expensetracker.exception.ConflictException;
import com.example.expensetracker.exception.ValidationException;
import com.example.expensetracker.mapper.CategoryMapper;
import com.example.expensetracker.repository.CategoryRepository;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.service.impl.CategoryServiceImpl;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CategoryService Unit Tests")
class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @Spy
    @InjectMocks
    private CategoryServiceImpl categoryService;

    private UserEntity testUser;

    @BeforeEach
    void setUp() {
        testUser = TestDataFactory.createUser(1L);
        lenient().doReturn(testUser).when(categoryService).getAuthenticatedUser();
    }

    @Test
    @DisplayName("Should create category successfully")
    void shouldCreateCategorySuccessfully() {
        // Given
        CategoryDto dto = TestDataFactory.categoryDto("Groceries");
        CategoryEntity entity = CategoryEntity.builder()
                .id(1L)
                .name("Groceries")
                .user(testUser)
                .build();
        CategoryDto expectedDto = CategoryDto.builder()
                .id(1L)
                .name("Groceries")
                .build();

        when(categoryRepository.existsByNameAndUserId("Groceries", 1L)).thenReturn(false);
        when(categoryMapper.toEntity(dto)).thenReturn(CategoryEntity.builder().name("Groceries").build());
        when(categoryRepository.save(any(CategoryEntity.class))).thenReturn(entity);
        when(categoryMapper.toDto(entity)).thenReturn(expectedDto);

        // When
        CategoryDto result = categoryService.create(dto);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Groceries");
        verify(categoryRepository).existsByNameAndUserId("Groceries", 1L);
        verify(categoryRepository).save(any(CategoryEntity.class));
    }

    @Test
    @DisplayName("Should throw ValidationException when category DTO is null")
    void shouldThrowValidationExceptionWhenCategoryDtoIsNull() {
        // When/Then
        assertThatThrownBy(() -> categoryService.create(null))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Category data is required");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {" ", "   ", "\t", "\n"})
    @DisplayName("Should throw ValidationException when category name is null or blank")
    void shouldThrowValidationExceptionWhenCategoryNameIsNullOrBlank(String name) {
        // Given
        CategoryDto dto = new CategoryDto();
        dto.setName(name);

        // When/Then
        assertThatThrownBy(() -> categoryService.create(dto))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Category name is required");
    }

    @Test
    @DisplayName("Should throw ValidationException when category name exceeds 100 characters")
    void shouldThrowValidationExceptionWhenCategoryNameExceeds100Characters() {
        // Given
        String longName = "a".repeat(101);
        CategoryDto dto = TestDataFactory.categoryDto(longName);

        // When/Then
        assertThatThrownBy(() -> categoryService.create(dto))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Category name must not exceed 100 characters");
    }

    @Test
    @DisplayName("Should throw CategoryAlreadyExistsException when category name already exists")
    void shouldThrowCategoryAlreadyExistsExceptionWhenCategoryNameAlreadyExists() {
        // Given
        CategoryDto dto = TestDataFactory.categoryDto("Groceries");
        when(categoryRepository.existsByNameAndUserId("Groceries", 1L)).thenReturn(true);

        // When/Then
        assertThatThrownBy(() -> categoryService.create(dto))
                .isInstanceOf(CategoryAlreadyExistsException.class)
                .hasMessageContaining("Category with name 'Groceries' already exists");
    }

    @Test
    @DisplayName("Should get all categories for current user successfully")
    void shouldGetAllCategoriesForCurrentUserSuccessfully() {
        // Given
        CategoryEntity category1 = TestDataFactory.createCategory(1L, testUser);
        CategoryEntity category2 = TestDataFactory.createCategory(2L, testUser);
        List<CategoryEntity> entities = Arrays.asList(category1, category2);

        CategoryDto dto1 = CategoryDto.builder().id(1L).name("Groceries").build();
        CategoryDto dto2 = CategoryDto.builder().id(2L).name("Transport").build();

        when(categoryRepository.findByUserId(1L)).thenReturn(entities);
        when(categoryMapper.toDto(category1)).thenReturn(dto1);
        when(categoryMapper.toDto(category2)).thenReturn(dto2);

        // When
        List<CategoryDto> result = categoryService.getAllForCurrentUser();

        // Then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Groceries");
        assertThat(result.get(1).getName()).isEqualTo("Transport");
        verify(categoryRepository).findByUserId(1L);
    }

    @Test
    @DisplayName("Should return empty list when user has no categories")
    void shouldReturnEmptyListWhenUserHasNoCategories() {
        // Given
        when(categoryRepository.findByUserId(1L)).thenReturn(Arrays.asList());

        // When
        List<CategoryDto> result = categoryService.getAllForCurrentUser();

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Should update category successfully")
    void shouldUpdateCategorySuccessfully() {
        // Given
        CategoryEntity existingCategory = TestDataFactory.createCategory(1L, testUser);
        existingCategory.setName("Groceries");

        CategoryDto updateDto = TestDataFactory.categoryDto("Supermarket");
        CategoryEntity updatedEntity = CategoryEntity.builder()
                .id(1L)
                .name("Supermarket")
                .user(testUser)
                .build();
        CategoryDto expectedDto = CategoryDto.builder()
                .id(1L)
                .name("Supermarket")
                .build();

        when(categoryRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(existingCategory));
        when(categoryRepository.existsByNameAndUserId("Supermarket", 1L)).thenReturn(false);
        when(categoryRepository.save(existingCategory)).thenReturn(updatedEntity);
        when(categoryMapper.toDto(updatedEntity)).thenReturn(expectedDto);

        // When
        CategoryDto result = categoryService.update(1L, updateDto);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Supermarket");
        verify(categoryRepository).findByIdAndUserId(1L, 1L);
        verify(categoryRepository).save(existingCategory);
    }

    @Test
    @DisplayName("Should update category with same name successfully")
    void shouldUpdateCategoryWithSameNameSuccessfully() {
        // Given
        CategoryEntity existingCategory = TestDataFactory.createCategory(1L, testUser);
        existingCategory.setName("Groceries");

        CategoryDto updateDto = TestDataFactory.categoryDto("Groceries");
        CategoryDto expectedDto = CategoryDto.builder()
                .id(1L)
                .name("Groceries")
                .build();

        when(categoryRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(existingCategory));
        when(categoryRepository.save(existingCategory)).thenReturn(existingCategory);
        when(categoryMapper.toDto(existingCategory)).thenReturn(expectedDto);

        // When
        CategoryDto result = categoryService.update(1L, updateDto);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Groceries");
        verify(categoryRepository, never()).existsByNameAndUserId(anyString(), anyLong());
    }

    @Test
    @DisplayName("Should throw ValidationException when update ID is null")
    void shouldThrowValidationExceptionWhenUpdateIdIsNull() {
        // Given
        CategoryDto dto = TestDataFactory.categoryDto("Groceries");

        // When/Then
        assertThatThrownBy(() -> categoryService.update(null, dto))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Invalid category ID");
    }

    @ParameterizedTest
    @ValueSource(longs = {0, -1, -100})
    @DisplayName("Should throw ValidationException when update ID is invalid")
    void shouldThrowValidationExceptionWhenUpdateIdIsInvalid(Long id) {
        // Given
        CategoryDto dto = TestDataFactory.categoryDto("Groceries");

        // When/Then
        assertThatThrownBy(() -> categoryService.update(id, dto))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Invalid category ID");
    }

    @Test
    @DisplayName("Should throw ValidationException when update DTO is null")
    void shouldThrowValidationExceptionWhenUpdateDtoIsNull() {
        // When/Then
        assertThatThrownBy(() -> categoryService.update(1L, null))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Category data is required");
    }

    @Test
    @DisplayName("Should throw CategoryNotFoundException when updating non-existent category")
    void shouldThrowCategoryNotFoundExceptionWhenUpdatingNonExistentCategory() {
        // Given
        CategoryDto dto = TestDataFactory.categoryDto("Groceries");
        when(categoryRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> categoryService.update(999L, dto))
                .isInstanceOf(CategoryNotFoundException.class)
                .hasMessageContaining("Category not found with id: 999");
    }

    @Test
    @DisplayName("Should throw CategoryAlreadyExistsException when updating to existing name")
    void shouldThrowCategoryAlreadyExistsExceptionWhenUpdatingToExistingName() {
        // Given
        CategoryEntity existingCategory = TestDataFactory.createCategory(1L, testUser);
        existingCategory.setName("Groceries");

        CategoryDto updateDto = TestDataFactory.categoryDto("Supermarket");

        when(categoryRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(existingCategory));
        when(categoryRepository.existsByNameAndUserId("Supermarket", 1L)).thenReturn(true);

        // When/Then
        assertThatThrownBy(() -> categoryService.update(1L, updateDto))
                .isInstanceOf(CategoryAlreadyExistsException.class)
                .hasMessageContaining("Category with name 'Supermarket' already exists");
    }

    @Test
    @DisplayName("Should delete category successfully")
    void shouldDeleteCategorySuccessfully() {
        // Given
        CategoryEntity category = TestDataFactory.createCategory(1L, testUser);
        when(categoryRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(category));
        when(expenseRepository.existsByCategoryId(1L)).thenReturn(false);
        doNothing().when(categoryRepository).delete(category);

        // When
        categoryService.delete(1L);

        // Then
        verify(categoryRepository).findByIdAndUserId(1L, 1L);
        verify(expenseRepository).existsByCategoryId(1L);
        verify(categoryRepository).delete(category);
    }

    @Test
    @DisplayName("Should throw ValidationException when delete ID is null")
    void shouldThrowValidationExceptionWhenDeleteIdIsNull() {
        // When/Then
        assertThatThrownBy(() -> categoryService.delete(null))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Invalid category ID");
    }

    @ParameterizedTest
    @ValueSource(longs = {0, -1, -100})
    @DisplayName("Should throw ValidationException when delete ID is invalid")
    void shouldThrowValidationExceptionWhenDeleteIdIsInvalid(Long id) {
        // When/Then
        assertThatThrownBy(() -> categoryService.delete(id))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Invalid category ID");
    }

    @Test
    @DisplayName("Should throw CategoryNotFoundException when deleting non-existent category")
    void shouldThrowCategoryNotFoundExceptionWhenDeletingNonExistentCategory() {
        // Given
        when(categoryRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> categoryService.delete(999L))
                .isInstanceOf(CategoryNotFoundException.class)
                .hasMessageContaining("Category not found with id: 999");
    }

    @Test
    @DisplayName("Should throw ConflictException when deleting category with associated expenses")
    void shouldThrowConflictExceptionWhenDeletingCategoryWithAssociatedExpenses() {
        // Given
        CategoryEntity category = TestDataFactory.createCategory(1L, testUser);
        when(categoryRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(category));
        when(expenseRepository.existsByCategoryId(1L)).thenReturn(true);

        // When/Then
        assertThatThrownBy(() -> categoryService.delete(1L))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("Cannot delete category: it is associated with existing expenses");

        verify(categoryRepository).findByIdAndUserId(1L, 1L);
        verify(expenseRepository).existsByCategoryId(1L);
        verify(categoryRepository, never()).delete(any());
    }
}

