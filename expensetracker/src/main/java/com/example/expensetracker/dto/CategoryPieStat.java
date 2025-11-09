package com.example.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryPieStat {
    private Long categoryId;
    private String categoryName;
    private BigDecimal amount;
    private BigDecimal percentage;
}

