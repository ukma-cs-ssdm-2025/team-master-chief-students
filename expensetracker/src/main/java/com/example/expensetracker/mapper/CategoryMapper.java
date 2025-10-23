package com.example.expensetracker.mapper;

import com.example.expensetracker.dto.CategoryDto;
import com.example.expensetracker.entity.CategoryEntity;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
    public CategoryDto toDto(CategoryEntity entity) {
        return CategoryDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }

    public CategoryEntity toEntity(CategoryDto dto) {
        return CategoryEntity.builder()
                .name(dto.getName())
                .build();
    }
}