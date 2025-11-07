package com.example.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Response DTO for expense data.
 * Used for returning expense information to clients.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String description;
    private BigDecimal amount;
    private LocalDate date;
}

