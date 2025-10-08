package com.example.expensetracker.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequestDto {
    private String email;
    private String password;
}
