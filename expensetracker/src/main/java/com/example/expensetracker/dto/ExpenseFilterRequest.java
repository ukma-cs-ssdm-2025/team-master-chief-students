package com.example.expensetracker.dto;

import jakarta.validation.constraints.*;
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
    @Positive(message = "Category ID must be positive")
    private Long categoryId;
    
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    private String category;
    
    @Pattern(regexp = "exact|like", message = "Category match must be 'exact' or 'like'")
    private String categoryMatch; // "exact" or "like", default "exact"
    
    @PastOrPresent(message = "From date cannot be in the future")
    private LocalDate fromDate;
    
    @PastOrPresent(message = "To date cannot be in the future")
    private LocalDate toDate;
    
    @DecimalMin(value = "0.01", message = "Min amount must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Min amount must have at most 10 integer digits and 2 decimal places")
    private BigDecimal minAmount;
    
    @DecimalMin(value = "0.01", message = "Max amount must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Max amount must have at most 10 integer digits and 2 decimal places")
    private BigDecimal maxAmount;
    
    private Boolean hasReceipt;
    
    @Positive(message = "Team ID must be positive")
    private Long teamId;
    
    @Size(max = 200, message = "Search term must not exceed 200 characters")
    private String search;
    
    private String cursor;
    
    @Min(value = 1, message = "Limit must be at least 1")
    @Max(value = 100, message = "Limit must not exceed 100")
    private Integer limit;
}

