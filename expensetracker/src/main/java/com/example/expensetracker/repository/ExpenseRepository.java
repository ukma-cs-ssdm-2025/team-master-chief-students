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

    boolean existsByCategoryId(Long categoryId);

    /**
     * @param userId the user ID
     * @return count of expenses
     * @deprecated Use {@link #count(org.springframework.data.jpa.domain.Specification)} instead. To be removed in v2.0.
     */
    @Deprecated(since = "1.5", forRemoval = true)
    long countByUserId(Long userId);

    /**
     * @param userId the user ID
     * @return sum of amounts
     * @deprecated Use {@link com.example.expensetracker.service.ExpenseFilterService#getStatistics} instead. To be removed in v2.0.
     */
    @Deprecated(since = "1.5", forRemoval = true)
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM ExpenseEntity e WHERE e.user.id = :userId")
    BigDecimal sumAmountByUserId(Long userId);

    /**
     * @param userId user id
     * @param teamIds team ids
     * @param pageable pageable
     * @return page of expenses
     * @deprecated Use cursor-based pagination methods like {@link #findByUserIdWithCursor} or {@link #findByTeamIdWithCursor} instead. To be removed in v2.0.
     */
    @Deprecated(since = "1.5", forRemoval = true)
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

    /**
     * @param teamId team id
     * @param pageable pageable
     * @return page of expenses
     * @deprecated Use {@link #findByTeamIdOrdered} instead. To be removed in v2.0.
     */
    @Deprecated(since = "1.5", forRemoval = true)
    Page<ExpenseEntity> findByTeamId(Long teamId, Pageable pageable);

    /**
     * @param teamId team id
     * @param createdAt created at
     * @param id id
     * @param pageable pageable
     * @return list of expenses
     * @deprecated Use {@link #findByTeamIdWithCursor} instead. To be removed in v2.0.
     */
    @Deprecated(since = "1.5", forRemoval = true)
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