package com.example.expensetracker.mapper;

import com.example.expensetracker.dto.ExpenseDto;
import com.example.expensetracker.entity.ExpenseEntity;
import org.springframework.stereotype.Component;

@Component
public class ExpenseMapper {
    public ExpenseDto toDto(ExpenseEntity e) {
        return ExpenseDto.builder()
                .id(e.getId())
                .category(e.getCategory())
                .description(e.getDescription())
                .amount(e.getAmount())
                .date(e.getDate())
                .build();
    }

    public ExpenseEntity toEntity(ExpenseDto dto) {
        return ExpenseEntity.builder()
                .id(dto.getId())
                .category(dto.getCategory())
                .description(dto.getDescription())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .build();
    }
}
