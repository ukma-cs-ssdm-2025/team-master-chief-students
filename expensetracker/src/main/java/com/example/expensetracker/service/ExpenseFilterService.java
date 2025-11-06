package com.example.expensetracker.service;

import com.example.expensetracker.dto.CursorPageResponse;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.exception.ValidationException;
import com.example.expensetracker.dto.ExpenseFilterItemDto;
import com.example.expensetracker.dto.ExpenseFilterRequest;
import com.example.expensetracker.dto.ExpenseStatsDto;
import com.example.expensetracker.dto.DailyStat;
import com.example.expensetracker.mapper.ExpenseFilterMapper;
import com.example.expensetracker.repository.ExpenseFilterRepository;
import com.example.expensetracker.specification.ExpenseFilterSpecification;
import com.example.expensetracker.util.CursorUtil;
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

    private final ExpenseFilterRepository expenseRepository;
    private final ExpenseFilterMapper mapper;
        private final EntityManager entityManager;

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
                                .and(Sort.by(Sort.Direction.DESC, "id")))
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

        CriteriaQuery<Object[]> totalQuery = cb.createQuery(Object[].class);
        Root<ExpenseEntity> root = totalQuery.from(ExpenseEntity.class);
        totalQuery.select(cb.array(
                cb.coalesce(cb.sum(root.get("amount")), BigDecimal.ZERO),
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
                categoryRoot.get("category").get("id"),
                cb.sum(categoryRoot.get("amount"))
        ));
        Predicate categoryPredicate = spec.toPredicate(categoryRoot, categoryQuery, cb);
        if (categoryPredicate != null) {
            categoryQuery.where(categoryPredicate);
        }
        categoryQuery.groupBy(categoryRoot.get("category").get("id"));
        List<Object[]> categoryResults = entityManager.createQuery(categoryQuery).getResultList();
        Map<Long, BigDecimal> byCategory = categoryResults.stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).longValue(),
                        row -> (BigDecimal) row[1]
                ));

        CriteriaQuery<Object[]> dateQuery = cb.createQuery(Object[].class);
        Root<ExpenseEntity> dateRoot = dateQuery.from(ExpenseEntity.class);
        dateQuery.select(cb.array(
                dateRoot.get("date"),
                cb.sum(dateRoot.get("amount")),
                cb.count(dateRoot)
        ));
        Predicate datePredicate = spec.toPredicate(dateRoot, dateQuery, cb);
        if (datePredicate != null) {
            dateQuery.where(datePredicate);
        }
        dateQuery.groupBy(dateRoot.get("date"));
        dateQuery.orderBy(cb.asc(dateRoot.get("date")));
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
        if (request.getFromDate() != null && request.getToDate() != null) {
            if (request.getFromDate().isAfter(request.getToDate())) {
                throw new ValidationException("fromDate cannot be after toDate");
            }
        }

        if (request.getMinAmount() != null && request.getMaxAmount() != null) {
            if (request.getMinAmount().compareTo(request.getMaxAmount()) > 0) {
                throw new ValidationException("minAmount cannot be greater than maxAmount");
            }
        }

        if (request.getLimit() != null) {
            if (request.getLimit() < 1 || request.getLimit() > 100) {
                throw new ValidationException("limit must be between 1 and 100");
            }
        }

        if (request.getCategoryMatch() != null && 
            !request.getCategoryMatch().equalsIgnoreCase("exact") && 
            !request.getCategoryMatch().equalsIgnoreCase("like")) {
            throw new ValidationException("categoryMatch must be 'exact' or 'like'");
        }
    }
}

