package com.example.expensetracker.service.impl;

import com.example.expensetracker.dto.CategoryDto;
import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.exception.CategoryAlreadyExistsException;
import com.example.expensetracker.exception.CategoryNotFoundException;
import com.example.expensetracker.mapper.CategoryMapper;
import com.example.expensetracker.repository.CategoryRepository;
import com.example.expensetracker.service.BaseService;
import com.example.expensetracker.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl extends BaseService implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;


    @Override
    public CategoryDto create(CategoryDto dto) {
        UserEntity currentUser = getAuthenticatedUser();
        if (categoryRepository.existsByNameAndUserId(dto.getName(), currentUser.getId())) {
            throw new CategoryAlreadyExistsException("Category with name '" + dto.getName() + "' already exists.");
        }
        CategoryEntity category = categoryMapper.toEntity(dto);
        category.setUser(currentUser);
        CategoryEntity savedCategory = categoryRepository.save(category);
        return categoryMapper.toDto(savedCategory);
    }

    @Override
    public List<CategoryDto> getAllForCurrentUser() {
        Long userId = getAuthenticatedUser().getId();
        return categoryRepository.findByUserId(userId).stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDto update(Long id, CategoryDto dto) {
        UserEntity currentUser = getAuthenticatedUser();
        CategoryEntity category = categoryRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));

        if (!category.getName().equalsIgnoreCase(dto.getName()) && categoryRepository.existsByNameAndUserId(dto.getName(), currentUser.getId())) {
            throw new CategoryAlreadyExistsException("Category with name '" + dto.getName() + "' already exists.");
        }

        category.setName(dto.getName());
        return categoryMapper.toDto(categoryRepository.save(category));
    }

    @Override
    public void delete(Long id) {
        UserEntity currentUser = getAuthenticatedUser();
        CategoryEntity category = categoryRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));
        categoryRepository.delete(category);
    }
}