package com.example.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseStatsDto {
    private BigDecimal totalAmount;
    private Long count;
    private Map<Long, BigDecimal> byCategory;
    private List<DailyStat> byDate;
}

