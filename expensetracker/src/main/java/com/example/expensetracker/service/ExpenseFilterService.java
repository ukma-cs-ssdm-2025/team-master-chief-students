package com.example.expensetracker.service;

import com.example.expensetracker.dto.CursorPageResponse;
import com.example.expensetracker.dto.ExpenseFilterItemDto;
import com.example.expensetracker.dto.ExpenseFilterRequest;
import com.example.expensetracker.dto.ExpenseStatsDto;

public interface ExpenseFilterService {
    CursorPageResponse<ExpenseFilterItemDto> getFilteredExpenses(
            Long userId,
            ExpenseFilterRequest request
    );
    
    ExpenseStatsDto getStatistics(Long userId, ExpenseFilterRequest request);
}
