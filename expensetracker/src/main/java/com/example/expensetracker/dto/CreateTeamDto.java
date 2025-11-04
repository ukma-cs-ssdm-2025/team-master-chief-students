package com.example.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateTeamDto {
    @NotBlank(message = "Team name is required")
    @Size(min = 1, max = 100, message = "Team name must be between 1 and 100 characters")
    private String name;
}

