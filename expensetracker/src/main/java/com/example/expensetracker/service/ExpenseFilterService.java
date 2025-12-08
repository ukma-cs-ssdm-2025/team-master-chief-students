package com.example.expensetracker.service;

import com.example.expensetracker.dto.CursorPageResponse;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.exception.ValidationException;
import com.example.expensetracker.dto.ExpenseFilterItemDto;
import com.example.expensetracker.dto.ExpenseFilterRequest;
import com.example.expensetracker.dto.ExpenseStatsDto;
import com.example.expensetracker.dto.DailyStat;
import com.example.expensetracker.dto.PeriodStat;
import com.example.expensetracker.dto.TimeSeriesStatsDto;
import com.example.expensetracker.dto.CategoryPieStat;
import com.example.expensetracker.dto.CategoryPieStatsDto;
import com.example.expensetracker.mapper.ExpenseFilterMapper;
import com.example.expensetracker.repository.ExpenseFilterRepository;
import com.example.expensetracker.specification.ExpenseFilterSpecification;
import com.example.expensetracker.util.CursorUtil;
import com.example.expensetracker.util.TeamAcl;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExpenseFilterService extends BaseService {

    private static final String FIELD_AMOUNT = "amount";
    private static final String FIELD_CATEGORY = "category";
    private static final String FIELD_DATE = "date";
    private static final String FIELD_ID = "id";

    private final ExpenseFilterRepository expenseRepository;
    private final ExpenseFilterMapper mapper;
    private final EntityManager entityManager;
    private final TeamAcl teamAcl;

    @Transactional(readOnly = true)
    public CursorPageResponse<ExpenseFilterItemDto> getFilteredExpenses(
            Long userId,
            ExpenseFilterRequest request
    ) {
        validateFilterRequest(request);

        Instant cursorCreatedAt = null;
        Long cursorId = null;
        if (request.getCursor() != null && !request.getCursor().isBlank()) {
            var cursorInfoOpt = CursorUtil.decodeCursor(request.getCursor());
            if (cursorInfoOpt.isPresent()) {
                var cursorInfo = cursorInfoOpt.get();
                cursorCreatedAt = cursorInfo.getCreatedAt();
                cursorId = cursorInfo.getId();
            }
        }

        Specification<ExpenseEntity> spec = ExpenseFilterSpecification.buildSpecification(
                userId, request, cursorCreatedAt, cursorId
        );

        int limit = request.getLimit() != null ? request.getLimit() : 20;
        limit = Math.max(1, Math.min(100, limit));
        int pageSize = limit + 1;

        Page<ExpenseEntity> page = expenseRepository.findAll(
                spec,
                PageRequest.of(0, pageSize)
                        .withSort(Sort.by(Sort.Direction.DESC, "createdAt")
                                .and(Sort.by(Sort.Direction.DESC, FIELD_ID)))
        );
        List<ExpenseEntity> entities = page.getContent();

        boolean hasNext = entities.size() > limit;
        if (hasNext) {
            entities = entities.subList(0, limit);
        }

        List<ExpenseFilterItemDto> items = entities.stream()
                .map(mapper::toFilterItemDto)
                .collect(Collectors.toList());

        String nextCursor = null;
        if (hasNext && !entities.isEmpty()) {
            ExpenseEntity lastEntity = entities.get(entities.size() - 1);
            nextCursor = CursorUtil.encodeCursor(lastEntity.getCreatedAt(), lastEntity.getId());
        }

        return CursorPageResponse.of(items, nextCursor, hasNext);
    }

    @Transactional(readOnly = true)
    public ExpenseStatsDto getStatistics(Long userId, ExpenseFilterRequest request) {
        Specification<ExpenseEntity> spec = ExpenseFilterSpecification.buildStatsSpecification(
                userId, request
        );

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        // 1. Total Amount and Count
        CriteriaQuery<Object[]> totalQuery = cb.createQuery(Object[].class);
        Root<ExpenseEntity> root = totalQuery.from(ExpenseEntity.class);
        totalQuery.select(cb.array(
                cb.coalesce(cb.sum(root.get(FIELD_AMOUNT)), BigDecimal.ZERO),
                cb.count(root)
        ));
        Predicate wherePredicate = spec.toPredicate(root, totalQuery, cb);
        if (wherePredicate != null) {
            totalQuery.where(wherePredicate);
        }
        Object[] totalResult = entityManager.createQuery(totalQuery).getSingleResult();
        BigDecimal totalAmount = (BigDecimal) totalResult[0];
        Long count = ((Number) totalResult[1]).longValue();

        // 2. By Category
        CriteriaQuery<Object[]> categoryQuery = cb.createQuery(Object[].class);
        Root<ExpenseEntity> categoryRoot = categoryQuery.from(ExpenseEntity.class);
        categoryQuery.select(cb.array(
                categoryRoot.get(FIELD_CATEGORY).get(FIELD_ID),
                cb.sum(categoryRoot.get(FIELD_AMOUNT))
        ));
        Predicate categoryPredicate = spec.toPredicate(categoryRoot, categoryQuery, cb);
        if (categoryPredicate != null) {
            categoryQuery.where(categoryPredicate);
        }
        categoryQuery.groupBy(categoryRoot.get(FIELD_CATEGORY).get(FIELD_ID));
        List<Object[]> categoryResults = entityManager.createQuery(categoryQuery).getResultList();
        Map<Long, BigDecimal> byCategory = categoryResults.stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).longValue(),
                        row -> (BigDecimal) row[1]
                ));

        // 3. By Date
        CriteriaQuery<Object[]> dateQuery = cb.createQuery(Object[].class);
        Root<ExpenseEntity> dateRoot = dateQuery.from(ExpenseEntity.class);
        dateQuery.select(cb.array(
                dateRoot.get(FIELD_DATE),
                cb.sum(dateRoot.get(FIELD_AMOUNT)),
                cb.count(dateRoot)
        ));
        Predicate datePredicate = spec.toPredicate(dateRoot, dateQuery, cb);
        if (datePredicate != null) {
            dateQuery.where(datePredicate);
        }
        dateQuery.groupBy(dateRoot.get(FIELD_DATE));
        dateQuery.orderBy(cb.asc(dateRoot.get(FIELD_DATE)));
        List<Object[]> dateResults = entityManager.createQuery(dateQuery).getResultList();
        List<DailyStat> byDate = dateResults.stream()
                .map(row -> DailyStat.builder()
                        .date((LocalDate) row[0])
                        .totalAmount((BigDecimal) row[1])
                        .count(((Number) row[2]).longValue())
                        .build())
                .collect(Collectors.toList());

        return ExpenseStatsDto.builder()
                .totalAmount(totalAmount)
                .count(count)
                .byCategory(byCategory)
                .byDate(byDate)
                .build();
    }

    private void validateFilterRequest(ExpenseFilterRequest request) {
        if (request.getFromDate() != null && request.getToDate() != null
                && request.getFromDate().isAfter(request.getToDate())) {
            throw new ValidationException("fromDate cannot be after toDate");
        }

        if (request.getMinAmount() != null && request.getMaxAmount() != null
                && request.getMinAmount().compareTo(request.getMaxAmount()) > 0) {
            throw new ValidationException("minAmount cannot be greater than maxAmount");
        }

        if (request.getLimit() != null && (request.getLimit() < 1 || request.getLimit() > 100)) {
            throw new ValidationException("limit must be between 1 and 100");
        }

        if (request.getCategoryMatch() != null &&
                !request.getCategoryMatch().equalsIgnoreCase("exact") &&
                !request.getCategoryMatch().equalsIgnoreCase("like")) {
            throw new ValidationException("categoryMatch must be 'exact' or 'like'");
        }
    }

    @Transactional(readOnly = true)
    public TimeSeriesStatsDto getTimeSeriesStatistics(Long userId, ExpenseFilterRequest request) {
        ExpenseFilterRequest statsRequest = createStatsRequest(request, request.getTeamId());
        return calculateTimeSeriesStats(userId, statsRequest);
    }

    @Transactional(readOnly = true)
    public TimeSeriesStatsDto getTeamTimeSeriesStatistics(Long userId, Long teamId, ExpenseFilterRequest request) {
        teamAcl.requireMembership(userId, teamId);
        ExpenseFilterRequest statsRequest = createStatsRequest(request, teamId);
        return calculateTimeSeriesStats(userId, statsRequest);
    }

    // Extracted logic to avoid transactional self-invocation and duplicate code
    private TimeSeriesStatsDto calculateTimeSeriesStats(Long userId, ExpenseFilterRequest request) {
        Specification<ExpenseEntity> spec = ExpenseFilterSpecification.buildStatsSpecification(userId, request);
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        CriteriaQuery<Object[]> totalQuery = cb.createQuery(Object[].class);
        Root<ExpenseEntity> root = totalQuery.from(ExpenseEntity.class);
        totalQuery.select(cb.array(
                cb.coalesce(cb.sum(root.get(FIELD_AMOUNT)), BigDecimal.ZERO),
                cb.count(root)
        ));
        Predicate wherePredicate = spec.toPredicate(root, totalQuery, cb);
        if (wherePredicate != null) {
            totalQuery.where(wherePredicate);
        }
        Object[] totalResult = entityManager.createQuery(totalQuery).getSingleResult();
        BigDecimal totalAmount = (BigDecimal) totalResult[0];
        Long count = ((Number) totalResult[1]).longValue();

        CriteriaQuery<Object[]> dateQuery = cb.createQuery(Object[].class);
        Root<ExpenseEntity> dateRoot = dateQuery.from(ExpenseEntity.class);
        dateQuery.select(cb.array(
                dateRoot.get(FIELD_DATE),
                cb.sum(dateRoot.get(FIELD_AMOUNT)),
                cb.count(dateRoot)
        ));
        Predicate datePredicate = spec.toPredicate(dateRoot, dateQuery, cb);
        if (datePredicate != null) {
            dateQuery.where(datePredicate);
        }
        dateQuery.groupBy(dateRoot.get(FIELD_DATE));
        dateQuery.orderBy(cb.asc(dateRoot.get(FIELD_DATE)));
        List<Object[]> dateResults = entityManager.createQuery(dateQuery).getResultList();
        List<PeriodStat> byPeriod = dateResults.stream()
                .map(row -> PeriodStat.builder()
                        .date((LocalDate) row[0])
                        .totalAmount((BigDecimal) row[1])
                        .count(((Number) row[2]).longValue())
                        .build())
                .collect(Collectors.toList());

        return TimeSeriesStatsDto.builder()
                .totalAmount(totalAmount)
                .count(count)
                .byPeriod(byPeriod)
                .build();
    }

    @Transactional(readOnly = true)
    public CategoryPieStatsDto getCategoryPieStatistics(Long userId, ExpenseFilterRequest request) {
        return calculateCategoryPieStats(userId, request);
    }

    @Transactional(readOnly = true)
    public CategoryPieStatsDto getTeamCategoryPieStatistics(Long userId, Long teamId, ExpenseFilterRequest request) {
        teamAcl.requireMembership(userId, teamId);
        ExpenseFilterRequest statsRequest = createStatsRequest(request, teamId);
        return calculateCategoryPieStats(userId, statsRequest);
    }

    // Extracted logic to avoid transactional self-invocation
    private CategoryPieStatsDto calculateCategoryPieStats(Long userId, ExpenseFilterRequest request) {
        Specification<ExpenseEntity> spec = ExpenseFilterSpecification.buildStatsSpecification(userId, request);
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        CriteriaQuery<Object[]> totalQuery = cb.createQuery(Object[].class);
        Root<ExpenseEntity> root = totalQuery.from(ExpenseEntity.class);
        totalQuery.select(cb.array(
                cb.coalesce(cb.sum(root.get(FIELD_AMOUNT)), BigDecimal.ZERO),
                cb.count(root)
        ));
        Predicate wherePredicate = spec.toPredicate(root, totalQuery, cb);
        if (wherePredicate != null) {
            totalQuery.where(wherePredicate);
        }
        Object[] totalResult = entityManager.createQuery(totalQuery).getSingleResult();
        BigDecimal totalAmount = (BigDecimal) totalResult[0];
        Long count = ((Number) totalResult[1]).longValue();

        CriteriaQuery<Object[]> categoryQuery = cb.createQuery(Object[].class);
        Root<ExpenseEntity> categoryRoot = categoryQuery.from(ExpenseEntity.class);
        categoryQuery.select(cb.array(
                categoryRoot.get(FIELD_CATEGORY).get(FIELD_ID),
                categoryRoot.get(FIELD_CATEGORY).get("name"),
                cb.sum(categoryRoot.get(FIELD_AMOUNT))
        ));
        Predicate categoryPredicate = spec.toPredicate(categoryRoot, categoryQuery, cb);
        if (categoryPredicate != null) {
            categoryQuery.where(categoryPredicate);
        }
        categoryQuery.groupBy(
                categoryRoot.get(FIELD_CATEGORY).get(FIELD_ID),
                categoryRoot.get(FIELD_CATEGORY).get("name")
        );
        categoryQuery.orderBy(cb.desc(cb.sum(categoryRoot.get(FIELD_AMOUNT))));
        List<Object[]> categoryResults = entityManager.createQuery(categoryQuery).getResultList();

        List<CategoryPieStat> categories = categoryResults.stream()
                .map(row -> {
                    Long categoryId = ((Number) row[0]).longValue();
                    String categoryName = (String) row[1];
                    BigDecimal amount = (BigDecimal) row[2];
                    BigDecimal percentage = totalAmount.compareTo(BigDecimal.ZERO) > 0
                            ? amount.divide(totalAmount, 4, java.math.RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100))
                            : BigDecimal.ZERO;
                    return CategoryPieStat.builder()
                            .categoryId(categoryId)
                            .categoryName(categoryName)
                            .amount(amount)
                            .percentage(percentage.setScale(2, java.math.RoundingMode.HALF_UP))
                            .build();
                })
                .collect(Collectors.toList());

        return CategoryPieStatsDto.builder()
                .totalAmount(totalAmount)
                .totalCount(count)
                .categories(categories)
                .build();
    }

    private ExpenseFilterRequest createStatsRequest(ExpenseFilterRequest original, Long teamId) {
        return ExpenseFilterRequest.builder()
                .categoryId(original.getCategoryId())
                .category(original.getCategory())
                .categoryMatch(original.getCategoryMatch())
                .fromDate(original.getFromDate())
                .toDate(original.getToDate())
                .minAmount(original.getMinAmount())
                .maxAmount(original.getMaxAmount())
                .hasReceipt(original.getHasReceipt())
                .teamId(teamId)
                .search(original.getSearch())
                .build();
    }
}