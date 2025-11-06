package com.example.expensetracker.mapper;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.entity.ExpenseEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ExpenseMapper {
    public ExpenseResponse toResponse(ExpenseEntity e) {
        return ExpenseResponse.builder()
                .id(e.getId())
                .categoryId(e.getCategory() != null ? e.getCategory().getId() : null)
                .categoryName(e.getCategory() != null ? e.getCategory().getName() : null)
                .description(e.getDescription())
                .amount(e.getAmount())
                .date(e.getDate())
                .build();
    }

    public ExpenseEntity toEntity(CreateExpenseRequest request) {
        return ExpenseEntity.builder()
                .description(request.getDescription())
                .amount(request.getAmount())
                .date(request.getDate() != null ? request.getDate() : LocalDate.now())
                .build();
    }

    public void updateEntity(ExpenseEntity entity, UpdateExpenseRequest request) {
        entity.setDescription(request.getDescription());
        entity.setAmount(request.getAmount());
        if (request.getDate() != null) {
            entity.setDate(request.getDate());
        }
    }
    
    @Deprecated
    public ExpenseDto toDto(ExpenseEntity e) {
        return ExpenseDto.builder()
                .id(e.getId())
                .categoryId(e.getCategory() != null ? e.getCategory().getId() : null)
                .categoryName(e.getCategory() != null ? e.getCategory().getName() : null)
                .description(e.getDescription())
                .amount(e.getAmount())
                .date(e.getDate())
                .build();
    }
}
