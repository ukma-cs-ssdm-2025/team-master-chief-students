package com.example.expensetracker.repository;


import com.example.expensetracker.entity.RefreshToken;
import com.example.expensetracker.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    int deleteByUser(UserEntity user);
}