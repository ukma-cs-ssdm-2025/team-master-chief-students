package com.example.expensetracker.mapper;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.entity.ExpenseEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ExpenseMapper {
    public ExpenseResponse toResponse(ExpenseEntity e) {
        ExpenseResponse.ExpenseResponseBuilder builder = ExpenseResponse.builder()
                .id(e.getId())
                .description(e.getDescription())
                .amount(e.getAmount())
                .date(e.getDate());

        if (e.getCategory() != null) {
            builder.categoryId(e.getCategory().getId())
                    .categoryName(e.getCategory().getName());
        } else {
            builder.categoryId(null)
                    .categoryName(null);
        }

        return builder.build();
    }

    public ExpenseEntity toEntity(CreateExpenseRequest request) {
        return ExpenseEntity.builder()
                .description(request.getDescription())
                .amount(request.getAmount())
                .date(request.getDate() != null ? request.getDate() : LocalDate.now())
                .build();
    }

    public void updateEntity(ExpenseEntity entity, UpdateExpenseRequest request) {
        if (request.getDescription() != null) {
            entity.setDescription(request.getDescription());
        }
        if (request.getAmount() != null) {
            entity.setAmount(request.getAmount());
        }
        if (request.getDate() != null) {
            entity.setDate(request.getDate());
        }
    }

    // Legacy methods for backward compatibility

    /**
     * Converts entity to the old DTO format.
     *
     * @param e the expense entity
     * @return the legacy expense DTO
     * @deprecated Use {@link #toResponse(ExpenseEntity)} instead. This method will be removed in v2.0.
     */
    @Deprecated(since = "1.5", forRemoval = true)
    public ExpenseDto toDto(ExpenseEntity e) {
        ExpenseDto.ExpenseDtoBuilder builder = ExpenseDto.builder()
                .id(e.getId())
                .description(e.getDescription())
                .amount(e.getAmount())
                .date(e.getDate());

        if (e.getCategory() != null) {
            builder.categoryId(e.getCategory().getId())
                    .categoryName(e.getCategory().getName());
        } else {
            builder.categoryId(null)
                    .categoryName(null);
        }

        return builder.build();
    }
}