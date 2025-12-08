package com.example.expensetracker.service;

import com.example.expensetracker.dto.AuthRequestDto;
import com.example.expensetracker.dto.AuthResponseDto;
import com.example.expensetracker.dto.RegisterRequestDto;
import com.example.expensetracker.entity.RefreshToken;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.exception.UnauthorizedException;
import com.example.expensetracker.exception.UserAlreadyExistsException;
import com.example.expensetracker.exception.ValidationException;
import com.example.expensetracker.repository.CategoryRepository;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.repository.RefreshTokenRepository;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.security.JwtService;
import com.example.expensetracker.service.impl.AuthServiceImpl;
import com.example.expensetracker.testutil.AbstractPostgresContainerTest;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("AuthService Integration Tests")
class AuthServiceImplTest extends AbstractPostgresContainerTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private UserEntity testUser;

    @BeforeEach
    void setUp() {
        refreshTokenRepository.deleteAll();
        expenseRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();
        
        testUser = TestDataFactory.createUser();
        testUser.setPassword(passwordEncoder.encode("TestPassword123!"));
        testUser = userRepository.save(testUser);
    }

    @Test
    @DisplayName("Should register user and save refresh token to database")
    void shouldRegisterUserAndSaveRefreshToken() {
        // Given
        RegisterRequestDto request = TestDataFactory.registerRequestDto();

        // When
        AuthResponseDto response = authService.register(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isNotBlank();
        assertThat(response.getRefreshToken()).isNotBlank();

        Optional<RefreshToken> savedToken = refreshTokenRepository.findByTokenWithUser(response.getRefreshToken());
        assertThat(savedToken).isPresent();
        assertThat(savedToken.get().getUser().getEmail()).isEqualTo(request.getEmail());
        assertThat(savedToken.get().getExpiryDate()).isAfter(Instant.now());
    }

    @Test
    @DisplayName("Should throw UserAlreadyExistsException when registering duplicate email")
    void shouldThrowExceptionWhenRegisteringDuplicateEmail() {
        // Given
        RegisterRequestDto request = TestDataFactory.registerRequestDto(testUser.getEmail());

        // When/Then
        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(UserAlreadyExistsException.class);
    }

    @Test
    @DisplayName("Should login user and save refresh token to database")
    void shouldLoginUserAndSaveRefreshToken() {
        // Given
        AuthRequestDto request = TestDataFactory.authRequestDto(testUser.getEmail(), "TestPassword123!");

        // When
        AuthResponseDto response = authService.login(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isNotBlank();
        assertThat(response.getRefreshToken()).isNotBlank();

        Optional<RefreshToken> savedToken = refreshTokenRepository.findByTokenWithUser(response.getRefreshToken());
        assertThat(savedToken).isPresent();
        assertThat(savedToken.get().getUser().getId()).isEqualTo(testUser.getId());
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when login with wrong password")
    void shouldThrowExceptionWhenLoginWithWrongPassword() {
        // Given
        AuthRequestDto request = TestDataFactory.authRequestDto(testUser.getEmail(), "WrongPassword");

        // When/Then
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when login with non-existent email")
    void shouldThrowExceptionWhenLoginWithNonExistentEmail() {
        // Given
        AuthRequestDto request = TestDataFactory.authRequestDto("nonexistent@example.com", "password");

        // When/Then
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    @DisplayName("Should refresh tokens and rotate refresh token")
    void shouldRefreshTokensAndRotateRefreshToken() {
        // Given
        String initialRefreshToken = jwtService.generateRefreshToken(testUser);
        Instant expiryDate = Instant.now().plusMillis(jwtService.getRefreshExpiration());
        RefreshToken initialTokenEntity = RefreshToken.builder()
                .token(initialRefreshToken)
                .user(testUser)
                .expiryDate(expiryDate)
                .build();
        refreshTokenRepository.save(initialTokenEntity);
        refreshTokenRepository.flush();

        // When
        AuthResponseDto response = authService.refresh(initialRefreshToken);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isNotBlank();
        assertThat(response.getRefreshToken()).isNotBlank();
        assertThat(response.getRefreshToken()).isNotEqualTo(initialRefreshToken);

        Optional<RefreshToken> oldToken = refreshTokenRepository.findByToken(initialRefreshToken);
        assertThat(oldToken).isEmpty();

        Optional<RefreshToken> newToken = refreshTokenRepository.findByTokenWithUser(response.getRefreshToken());
        assertThat(newToken).isPresent();
        assertThat(newToken.get().getUser().getId()).isEqualTo(testUser.getId());
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when refreshing with invalid token")
    void shouldThrowExceptionWhenRefreshingWithInvalidToken() {
        // Given
        String invalidToken = "invalid.refresh.token";

        // When/Then
        assertThatThrownBy(() -> authService.refresh(invalidToken))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("Invalid or expired refresh token");
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when refreshing with token not in database")
    void shouldThrowExceptionWhenRefreshingWithTokenNotInDatabase() {
        // Given
        String validButNotSavedToken = jwtService.generateRefreshToken(testUser);

        // When/Then
        assertThatThrownBy(() -> authService.refresh(validButNotSavedToken))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("Invalid or expired refresh token");
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when refreshing with expired token in database")
    void shouldThrowExceptionWhenRefreshingWithExpiredTokenInDatabase() {
        // Given
        String expiredRefreshToken = jwtService.generateRefreshToken(testUser);
        Instant pastExpiryDate = Instant.now().minusSeconds(3600);
        RefreshToken expiredTokenEntity = RefreshToken.builder()
                .token(expiredRefreshToken)
                .user(testUser)
                .expiryDate(pastExpiryDate)
                .build();
        refreshTokenRepository.save(expiredTokenEntity);
        refreshTokenRepository.flush();

        // When/Then
        assertThatThrownBy(() -> authService.refresh(expiredRefreshToken))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("Invalid or expired refresh token");

        refreshTokenRepository.flush();
        Optional<RefreshToken> deletedToken = refreshTokenRepository.findByToken(expiredRefreshToken);
        assertThat(deletedToken).isEmpty();
    }

    @Test
    @DisplayName("Should logout and delete refresh token from database")
    void shouldLogoutAndDeleteRefreshToken() {
        // Given
        String refreshToken = jwtService.generateRefreshToken(testUser);
        Instant expiryDate = Instant.now().plusMillis(jwtService.getRefreshExpiration());
        RefreshToken tokenEntity = RefreshToken.builder()
                .token(refreshToken)
                .user(testUser)
                .expiryDate(expiryDate)
                .build();
        refreshTokenRepository.save(tokenEntity);

        // When
        authService.logout(refreshToken);

        // Then
        Optional<RefreshToken> deletedToken = refreshTokenRepository.findByToken(refreshToken);
        assertThat(deletedToken).isEmpty();
    }

    @Test
    @DisplayName("Should throw ValidationException when logout with null token")
    void shouldThrowExceptionWhenLogoutWithNullToken() {
        // When/Then
        assertThatThrownBy(() -> authService.logout(null))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Refresh token is required");
    }

    @Test
    @DisplayName("Should throw ValidationException when logout with blank token")
    void shouldThrowExceptionWhenLogoutWithBlankToken() {
        // When/Then
        assertThatThrownBy(() -> authService.logout("   "))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Refresh token is required");
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when logout with non-existent token")
    void shouldThrowExceptionWhenLogoutWithNonExistentToken() {
        // Given
        String nonExistentToken = "non.existent.token";

        // When/Then
        assertThatThrownBy(() -> authService.logout(nonExistentToken))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("Invalid or expired refresh token");
    }
}

