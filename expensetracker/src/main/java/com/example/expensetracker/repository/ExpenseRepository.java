package com.example.expensetracker.repository;

import com.example.expensetracker.entity.ExpenseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long> {
    List<ExpenseEntity> findByUserId(Long userId);

    Optional<ExpenseEntity> findByIdAndUserId(Long id, Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);
    long countByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM ExpenseEntity e WHERE e.user.id = :userId")
    BigDecimal sumAmountByUserId(Long userId);
    
    @Query("""
        SELECT e FROM ExpenseEntity e
        WHERE (e.user.id = :userId AND e.team IS NULL)
        OR (e.team.id IN :teamIds)
        """)
    Page<ExpenseEntity> findVisibleForUser(
            @Param("userId") Long userId,
            @Param("teamIds") Collection<Long> teamIds,
            Pageable pageable
    );
    
    Page<ExpenseEntity> findByTeamId(Long teamId, Pageable pageable);
    
    @Query("""
        SELECT e FROM ExpenseEntity e
        WHERE e.team.id = :teamId
        AND (
            :createdAt IS NULL OR
            e.createdAt < :createdAt OR
            (e.createdAt = :createdAt AND e.id < :id)
        )
        ORDER BY e.createdAt DESC, e.id DESC
        """)
    List<ExpenseEntity> findTeamKeyset(
            @Param("teamId") Long teamId,
            @Param("createdAt") Instant createdAt,
            @Param("id") Long id,
            Pageable pageable
    );
    
    @Query("""
        SELECT e FROM ExpenseEntity e
        WHERE e.team.id = :teamId
        ORDER BY e.createdAt DESC, e.id DESC
        """)
    List<ExpenseEntity> findByTeamIdOrdered(
            @Param("teamId") Long teamId,
            Pageable pageable
    );
    
    @Query("""
        SELECT e FROM ExpenseEntity e
        WHERE e.team.id = :teamId
        AND (e.createdAt < :cursorCreatedAt OR (e.createdAt = :cursorCreatedAt AND e.id < :cursorId))
        ORDER BY e.createdAt DESC, e.id DESC
        """)
    List<ExpenseEntity> findByTeamIdWithCursor(
            @Param("teamId") Long teamId,
            @Param("cursorCreatedAt") Instant cursorCreatedAt,
            @Param("cursorId") Long cursorId,
            Pageable pageable
    );
}
