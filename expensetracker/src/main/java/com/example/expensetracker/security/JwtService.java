package com.example.expensetracker.security;

import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.exception.InternalServerException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private static final int MIN_SECRET_LENGTH = 32;

    private final SecretKey accessSecretKey;
    private final SecretKey refreshSecretKey;

    private final long accessExpiration;
    private final long refreshExpiration;

    public JwtService(
            @Value("${jwt.secret}") String accessSecret,
            @Value("${jwt.refresh-secret}") String refreshSecret,
            @Value("${jwt.expiration-ms}") long accessExpiration,
            @Value("${jwt.refresh-expiration-ms}") long refreshExpiration
    ) {
        validateSecret(accessSecret, "JWT_ACCESS_SECRET");
        validateSecret(refreshSecret, "JWT_REFRESH_SECRET");
        
        if (accessSecret.equals(refreshSecret)) {
            throw new InternalServerException(
                    "JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different for security reasons."
            );
        }
        
        this.accessSecretKey = Keys.hmacShaKeyFor(accessSecret.getBytes(StandardCharsets.UTF_8));
        this.refreshSecretKey = Keys.hmacShaKeyFor(refreshSecret.getBytes(StandardCharsets.UTF_8));
        this.accessExpiration = accessExpiration;
        this.refreshExpiration = refreshExpiration;
    }

    private void validateSecret(String secret, String secretName) {
        if (secret == null || secret.isBlank()) {
            throw new InternalServerException(
                    String.format(
                            "%s environment variable is required and cannot be empty. " +
                            "Please set it in your environment or .env file.",
                            secretName
                    )
            );
        }
        
        if (secret.length() < MIN_SECRET_LENGTH) {
            throw new InternalServerException(
                    String.format(
                            "%s must be at least %d characters long for security. " +
                            "Current length: %d. Please generate a strong secret using: openssl rand -base64 32",
                            secretName,
                            MIN_SECRET_LENGTH,
                            secret.length()
                    )
            );
        }
    }

    // === ACCESS TOKEN ===
    public String generateAccessToken(UserEntity user) {
        return generateToken(user, accessExpiration, accessSecretKey, Map.of("type", "access"));
    }

    // === REFRESH TOKEN ===
    public String generateRefreshToken(UserEntity user) {
        return generateToken(user, refreshExpiration, refreshSecretKey, Map.of("type", "refresh"));
    }

    // === GENERIC TOKEN BUILDER ===
    private String generateToken(UserEntity user, long expiration, SecretKey key, Map<String, Object> claims) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(user.getEmail())
                .claims(claims)
                .issuedAt(now)
                .expiration(exp)
                .signWith(key)
                .compact();
    }

    // === VALIDATION ===
    public boolean isTokenValid(String token, boolean isAccessToken) {
        try {
            getClaims(token, isAccessToken);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractEmail(String token, boolean isAccessToken) {
        return getClaims(token, isAccessToken).getPayload().getSubject();
    }

    private Jws<Claims> getClaims(String token, boolean isAccessToken) {
        SecretKey key = isAccessToken ? accessSecretKey : refreshSecretKey;

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token);
    }
}