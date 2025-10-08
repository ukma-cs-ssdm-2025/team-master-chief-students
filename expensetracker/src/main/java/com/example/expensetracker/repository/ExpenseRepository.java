package com.example.expensetracker.repository;

import com.example.expensetracker.entity.ExpenseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long> {
    List<ExpenseEntity> findByUserId(Long userId);
    List<ExpenseEntity> findByUserIdAndCategoryContainingIgnoreCase(Long userId, String category);
}
