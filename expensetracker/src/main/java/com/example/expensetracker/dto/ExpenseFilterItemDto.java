package com.example.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseFilterItemDto {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String description;
    private BigDecimal amount;
    private LocalDate date;
    private Boolean hasReceipt;
    private Long teamId;
    private Instant createdAt;
}

