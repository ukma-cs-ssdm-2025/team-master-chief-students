package com.example.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseFilterRequest {
    private Long categoryId;
    private String category;
    private String categoryMatch; // "exact" or "like", default "exact"
    private LocalDate fromDate;
    private LocalDate toDate;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private Boolean hasReceipt;
    private Long teamId;
    private String search;
    private String cursor;
    private Integer limit;
}

