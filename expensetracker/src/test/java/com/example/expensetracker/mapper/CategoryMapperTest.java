package com.example.expensetracker.mapper;

import com.example.expensetracker.dto.CategoryDto;
import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("CategoryMapper Tests")
public class CategoryMapperTest {

    private final CategoryMapper mapper = new CategoryMapper();

    @Test
    @DisplayName("Should map CategoryEntity to CategoryResponse correctly")
    void shouldMapCategoryEntityToResponse() {
        UserEntity user = TestDataFactory.createUser();
        CategoryEntity category = TestDataFactory.createCategory(1L, user);

        // When
        CategoryDto response = mapper.toDto(category);

        // Then
        assert response.getId().equals(1L);
        assert response.getName().equals(category.getName());
    }

    @Test
    @DisplayName("Should map CategoryDto to CategoryEntity correctly")
    void shouldMapCategoryDtoToEntity() {
        CategoryDto dto = CategoryDto.builder()
                .name("Utilities")
                .build();

        // When
        CategoryEntity entity = mapper.toEntity(dto);

        // Then
        assert entity.getName().equals("Utilities");
    }
}
