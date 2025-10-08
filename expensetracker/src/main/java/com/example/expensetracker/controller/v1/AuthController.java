package com.example.expensetracker.controller.v1;

import com.example.expensetracker.dto.AuthRequestDto;
import com.example.expensetracker.dto.AuthResponseDto;
import com.example.expensetracker.dto.RegisterRequestDto;
import com.example.expensetracker.response.ApiResponse;
import com.example.expensetracker.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDto>> register(@RequestBody RegisterRequestDto request) {
        AuthResponseDto response = authService.register(request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "User registered successfully", response)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> login(@RequestBody AuthRequestDto request) {
        AuthResponseDto response = authService.login(request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Login successful", response)
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponseDto>> refresh(@RequestBody AuthResponseDto request) {
        AuthResponseDto response = authService.refresh(request.getRefreshToken());
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Token refreshed successfully", response)
        );
    }
}