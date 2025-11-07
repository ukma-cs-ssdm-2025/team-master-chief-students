package com.example.expensetracker.service;

import com.example.expensetracker.dto.CreateExpenseDto;
import com.example.expensetracker.dto.CursorPageResponse;
import com.example.expensetracker.dto.ExpenseDto;
import com.example.expensetracker.enums.ShareMode;

public interface TeamExpenseService {
    CursorPageResponse<ExpenseDto> listTeamExpenses(Long userId, Long teamId, String cursor, int limit);
    
    ExpenseDto createInTeam(Long me, Long teamId, CreateExpenseDto dto);
    
    ExpenseDto sharePersonalToTeam(Long me, Long expenseId, Long teamId, ShareMode mode);
}

