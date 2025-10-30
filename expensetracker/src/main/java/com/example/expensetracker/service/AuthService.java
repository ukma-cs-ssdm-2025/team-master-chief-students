package com.example.expensetracker.service;

import com.example.expensetracker.dto.AuthRequestDto;
import com.example.expensetracker.dto.AuthResponseDto;
import com.example.expensetracker.dto.RegisterRequestDto;

public interface AuthService {
    AuthResponseDto login(AuthRequestDto dto);
    AuthResponseDto register(RegisterRequestDto dto);
    AuthResponseDto refresh(String refreshToken);
    void logout(String refreshToken);
}
