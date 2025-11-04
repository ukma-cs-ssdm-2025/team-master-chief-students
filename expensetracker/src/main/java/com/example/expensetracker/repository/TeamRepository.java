package com.example.expensetracker.repository;

import com.example.expensetracker.entity.TeamEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamRepository extends JpaRepository<TeamEntity, Long> {
    Optional<TeamEntity> findByIdAndOwnerId(Long id, Long ownerId);
}

