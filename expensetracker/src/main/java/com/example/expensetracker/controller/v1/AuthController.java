package com.example.expensetracker.controller.v1;

import com.example.expensetracker.dto.AuthRequestDto;
import com.example.expensetracker.dto.AuthResponseDto;
import com.example.expensetracker.dto.LogoutRequestDto;
import com.example.expensetracker.dto.RegisterRequestDto;
import com.example.expensetracker.response.ApiResponse;
import com.example.expensetracker.response.ErrorResponse;
import com.example.expensetracker.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration, login, and token refresh")
public class AuthController {

    private final AuthService authService;


    @Operation(
            summary = "Register a new user",
            description = "Creates a new user account and returns access/refresh tokens."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "User registered successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = com.example.expensetracker.response.ApiResponse.class)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Validation error",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = com.example.expensetracker.response.ErrorResponse.class)
                    )
            )
    })
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDto>> register(@Valid @RequestBody RegisterRequestDto request) {
        AuthResponseDto response = authService.register(request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "User registered successfully", response)
        );
    }

    @Operation(
            summary = "User login",
            description = "Authenticates user credentials and returns new access and refresh tokens."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Login successful",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = com.example.expensetracker.response.ApiResponse.class),
                            examples = @ExampleObject(value = """
                                {
                                  "success": true,
                                  "message": "Login successful",
                                  "data": {
                                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                  },
                                  "metadata": {
                                    "timestamp": "2025-10-10T20:00:00"
                                  }
                                }
                                """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Invalid credentials",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(value = """
                                {
                                  "status": 401,
                                  "message": "Invalid email or password",
                                  "timestamp": "2025-10-10T20:00:00"
                                }
                                """)
                    )
            )
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> login(@Valid @RequestBody AuthRequestDto request) {
        AuthResponseDto response = authService.login(request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Login successful", response)
        );
    }

    @Operation(
            summary = "Refresh access token",
            description = "Generates new access and refresh tokens using a valid refresh token."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Token refreshed successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = com.example.expensetracker.response.ApiResponse.class),
                            examples = @ExampleObject(value = """
                                {
                                  "success": true,
                                  "message": "Token refreshed successfully",
                                  "data": {
                                    "accessToken": "newAccessTokenValue...",
                                    "refreshToken": "newRefreshTokenValue..."
                                  },
                                  "metadata": {
                                    "timestamp": "2025-10-10T20:00:00"
                                  }
                                }
                                """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Invalid or expired refresh token",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(value = """
                                {
                                  "status": 401,
                                  "message": "Invalid or expired refresh token",
                                  "timestamp": "2025-10-10T20:00:00"
                                }
                                """)
                    )
            )
    })
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponseDto>> refresh(@RequestBody AuthResponseDto request) {
        AuthResponseDto response = authService.refresh(request.getRefreshToken());
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Token refreshed successfully", response)
        );
    }

    @Operation(summary = "User logout", description = "Invalidates the user's refresh token.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Logout successful"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "Invalid request: token is missing or not found"
            )
    })
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody LogoutRequestDto request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Logout successful", null)
        );
    }
}