package com.example.expensetracker.dto;

import com.example.expensetracker.enums.ShareMode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ShareToTeamDto {
    @NotNull(message = "Team ID is required")
    private Long teamId;
    
    @NotNull(message = "Share mode is required")
    private ShareMode mode;
}

