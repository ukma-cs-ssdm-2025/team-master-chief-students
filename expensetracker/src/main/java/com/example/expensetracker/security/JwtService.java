package com.example.expensetracker.security;

import com.example.expensetracker.entity.UserEntity;
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

    private final SecretKey accessSecretKey;
    private final SecretKey refreshSecretKey;

    private final long accessExpiration;
    private final long refreshExpiration;

    public JwtService(
            @Value("${JWT_ACCESS_SECRET}") String accessSecret,
            @Value("${JWT_REFRESH_SECRET}") String refreshSecret,
            @Value("${JWT_ACCESS_EXPIRATION}") long accessExpiration,
            @Value("${JWT_REFRESH_EXPIRATION}") long refreshExpiration
    ) {
        this.accessSecretKey = Keys.hmacShaKeyFor(accessSecret.getBytes(StandardCharsets.UTF_8));
        this.refreshSecretKey = Keys.hmacShaKeyFor(refreshSecret.getBytes(StandardCharsets.UTF_8));
        this.accessExpiration = accessExpiration;
        this.refreshExpiration = refreshExpiration;
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