package com.example.expensetracker.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDto {
    private Long id;
    private String category;
    private String description;
    private BigDecimal amount;
    private LocalDate date;
}