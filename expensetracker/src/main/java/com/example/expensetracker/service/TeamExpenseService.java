package com.example.expensetracker.service;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.enums.ShareMode;

public interface TeamExpenseService {
    CursorPageResponse<ExpenseResponse> listTeamExpenses(Long userId, Long teamId, String cursor, int limit);
    
    ExpenseResponse createInTeam(Long me, Long teamId, CreateExpenseRequest request);
    
    ExpenseResponse sharePersonalToTeam(Long me, Long expenseId, Long teamId, ShareMode mode);
}

