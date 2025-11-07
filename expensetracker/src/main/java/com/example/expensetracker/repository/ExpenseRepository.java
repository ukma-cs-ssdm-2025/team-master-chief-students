package com.example.expensetracker.repository;

import com.example.expensetracker.entity.ExpenseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long>, JpaSpecificationExecutor<ExpenseEntity> {
    @Query("""
        SELECT DISTINCT e FROM ExpenseEntity e
        LEFT JOIN FETCH e.category
        LEFT JOIN FETCH e.user
        LEFT JOIN FETCH e.team
        WHERE e.user.id = :userId
        """)
    List<ExpenseEntity> findByUserId(@Param("userId") Long userId);
    
    @Query("""
        SELECT DISTINCT e FROM ExpenseEntity e
        LEFT JOIN FETCH e.category
        LEFT JOIN FETCH e.user
        LEFT JOIN FETCH e.team
        WHERE e.id = :id AND e.user.id = :userId
        """)
    Optional<ExpenseEntity> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    @Query("""
        SELECT DISTINCT e FROM ExpenseEntity e
        LEFT JOIN FETCH e.category
        LEFT JOIN FETCH e.user
        LEFT JOIN FETCH e.team
        WHERE e.team.id = :teamId
        ORDER BY e.createdAt DESC, e.id DESC
        """)
    List<ExpenseEntity> findByTeamIdOrdered(
            @Param("teamId") Long teamId,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT e FROM ExpenseEntity e
        LEFT JOIN FETCH e.category
        LEFT JOIN FETCH e.user
        LEFT JOIN FETCH e.team
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

    @Query("""
        SELECT DISTINCT e FROM ExpenseEntity e
        LEFT JOIN FETCH e.category
        LEFT JOIN FETCH e.user
        LEFT JOIN FETCH e.team
        WHERE e.user.id = :userId AND e.team IS NULL
        ORDER BY e.createdAt DESC, e.id DESC
        """)
    List<ExpenseEntity> findByUserIdOrdered(
            @Param("userId") Long userId,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT e FROM ExpenseEntity e
        LEFT JOIN FETCH e.category
        LEFT JOIN FETCH e.user
        LEFT JOIN FETCH e.team
        WHERE e.user.id = :userId AND e.team IS NULL
        AND (e.createdAt < :cursorCreatedAt OR (e.createdAt = :cursorCreatedAt AND e.id < :cursorId))
        ORDER BY e.createdAt DESC, e.id DESC
        """)
    List<ExpenseEntity> findByUserIdWithCursor(
            @Param("userId") Long userId,
            @Param("cursorCreatedAt") Instant cursorCreatedAt,
            @Param("cursorId") Long cursorId,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT e FROM ExpenseEntity e
        LEFT JOIN FETCH e.category
        LEFT JOIN FETCH e.user
        LEFT JOIN FETCH e.team
        WHERE e.team.id = :teamId
        ORDER BY e.createdAt DESC, e.id DESC
        """)
    List<ExpenseEntity> findAllByTeamId(@Param("teamId") Long teamId);

    boolean existsByIdAndUserId(Long id, Long userId);

    @Deprecated
    long countByUserId(Long userId);

    @Deprecated
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM ExpenseEntity e WHERE e.user.id = :userId")
    BigDecimal sumAmountByUserId(Long userId);

    @Deprecated
    @Query("""
        SELECT DISTINCT e FROM ExpenseEntity e
        LEFT JOIN FETCH e.category
        LEFT JOIN FETCH e.user
        LEFT JOIN FETCH e.team
        WHERE (e.user.id = :userId AND e.team IS NULL)
        OR (e.team.id IN :teamIds)
        """)
    Page<ExpenseEntity> findVisibleForUser(
            @Param("userId") Long userId,
            @Param("teamIds") Collection<Long> teamIds,
            Pageable pageable
    );

    @Deprecated
    Page<ExpenseEntity> findByTeamId(Long teamId, Pageable pageable);

    @Deprecated
    @Query("""
        SELECT DISTINCT e FROM ExpenseEntity e
        LEFT JOIN FETCH e.category
        LEFT JOIN FETCH e.user
        LEFT JOIN FETCH e.team
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
    

}
