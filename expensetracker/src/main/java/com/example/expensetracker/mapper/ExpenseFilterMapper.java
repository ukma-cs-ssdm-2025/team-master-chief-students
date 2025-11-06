package com.example.expensetracker.mapper;

import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.dto.ExpenseFilterItemDto;
import org.springframework.stereotype.Component;

@Component
public class ExpenseFilterMapper {

    public ExpenseFilterItemDto toFilterItemDto(ExpenseEntity entity) {
        return ExpenseFilterItemDto.builder()
                .id(entity.getId())
                .categoryId(entity.getCategory().getId())
                .categoryName(entity.getCategory().getName())
                .description(entity.getDescription())
                .amount(entity.getAmount())
                .date(entity.getDate())
                .hasReceipt(entity.getReceipt() != null)
                .teamId(entity.getTeam() != null ? entity.getTeam().getId() : null)
                .createdAt(entity.getCreatedAt())
                .build();
    }
}

