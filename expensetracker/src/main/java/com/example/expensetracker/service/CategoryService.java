package com.example.expensetracker.service;

import com.example.expensetracker.dto.CategoryDto;
import java.util.List;

public interface CategoryService {
    CategoryDto create(CategoryDto dto);
    List<CategoryDto> getAllForCurrentUser();
    CategoryDto update(Long id, CategoryDto dto);
    void delete(Long id);
}