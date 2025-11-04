package com.example.expensetracker.dto;

import com.example.expensetracker.enums.TeamRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddMemberDto {
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Role is required")
    private TeamRole role;
}

