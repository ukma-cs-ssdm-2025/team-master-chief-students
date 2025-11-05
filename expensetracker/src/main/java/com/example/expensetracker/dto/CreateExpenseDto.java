package com.example.expensetracker.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateExpenseDto {
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    private String description;
    
    @NotNull(message = "Amount is required")
    private BigDecimal amount;
    
    private LocalDate date;
}

