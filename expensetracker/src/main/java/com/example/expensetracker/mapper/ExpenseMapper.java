package com.example.expensetracker.mapper;

import com.example.expensetracker.dto.ExpenseDto;
import com.example.expensetracker.entity.ExpenseEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ExpenseMapper {
    public ExpenseDto toDto(ExpenseEntity e) {
        return ExpenseDto.builder()
                .id(e.getId())

                .categoryId(e.getCategory().getId())
                .categoryName(e.getCategory().getName())
                .description(e.getDescription())
                .amount(e.getAmount())
                .date(e.getDate())
                .build();
    }

    public ExpenseEntity toEntity(ExpenseDto dto) {
        return ExpenseEntity.builder()
                .id(dto.getId())
                .description(dto.getDescription())
                .amount(dto.getAmount())
                .date(LocalDate.now())
                .build();
    }
}
