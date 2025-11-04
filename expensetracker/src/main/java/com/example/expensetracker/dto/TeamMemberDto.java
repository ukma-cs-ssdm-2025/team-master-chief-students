package com.example.expensetracker.dto;

import com.example.expensetracker.enums.TeamRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberDto {
    private Long userId;
    private String email;
    private TeamRole role;
}

