package com.example.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LogoutRequestDto {
    @NotBlank(message = "Refresh token cannot be empty")
    private String refreshToken;
}
