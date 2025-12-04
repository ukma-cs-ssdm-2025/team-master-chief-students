package com.example.expensetracker.specification;

import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.ReceiptEntity;
import com.example.expensetracker.dto.ExpenseFilterRequest;
import jakarta.persistence.criteria.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class ExpenseFilterSpecification {

    // 1. Private constructor to hide the implicit public one (Fix for java:S1118)
    private ExpenseFilterSpecification() {
        throw new IllegalStateException("Utility class");
    }

    // 2. Refactored method to reduce Cognitive Complexity (Fix for java:S3776)
    public static Specification<ExpenseEntity> buildSpecification(
            Long userId,
            ExpenseFilterRequest request,
            Instant cursorCreatedAt,
            Long cursorId
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // User filter (always applied)
            predicates.add(cb.equal(root.get("user").get("id"), userId));

            // Apply all other filters via helper methods
            addCategoryPredicates(root, cb, request, predicates);
            addDatePredicates(root, cb, request, predicates);
            addAmountPredicates(root, cb, request, predicates);
            addReceiptPredicates(root, query, cb, request, predicates);

            if (request.getTeamId() != null) {
                predicates.add(cb.equal(root.get("team").get("id"), request.getTeamId()));
            }

            if (request.getSearch() != null && !request.getSearch().isBlank()) {
                String searchTerm = request.getSearch().trim();
                predicates.add(cb.like(
                        cb.lower(root.get("description")),
                        "%" + searchTerm.toLowerCase() + "%"
                ));
            }

            addCursorPredicates(root, cb, cursorCreatedAt, cursorId, predicates);

            log.debug("Expense filter applied: userId={}, filters={}, cursor={}",
                    userId,
                    request,
                    cursorCreatedAt != null ? "present" : "none");

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<ExpenseEntity> buildStatsSpecification(
            Long userId,
            ExpenseFilterRequest request
    ) {
        return buildSpecification(userId, request, null, null);
    }

    // --- Helper Methods ---

    private static void addCategoryPredicates(Root<ExpenseEntity> root, CriteriaBuilder cb,
                                              ExpenseFilterRequest request, List<Predicate> predicates) {
        if (request.getCategoryId() != null) {
            predicates.add(cb.equal(root.get("category").get("id"), request.getCategoryId()));
        } else if (request.getCategory() != null && !request.getCategory().isBlank()) {
            Join<ExpenseEntity, Object> categoryJoin = root.join("category");
            String categoryName = request.getCategory().trim();
            if ("like".equalsIgnoreCase(request.getCategoryMatch())) {
                predicates.add(cb.like(
                        cb.lower(categoryJoin.get("name")),
                        "%" + categoryName.toLowerCase() + "%"
                ));
            } else {
                predicates.add(cb.equal(
                        cb.lower(categoryJoin.get("name")),
                        categoryName.toLowerCase()
                ));
            }
        }
    }

    private static void addDatePredicates(Root<ExpenseEntity> root, CriteriaBuilder cb,
                                          ExpenseFilterRequest request, List<Predicate> predicates) {
        if (request.getFromDate() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("date"), request.getFromDate()));
        }
        if (request.getToDate() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("date"), request.getToDate()));
        }
    }

    private static void addAmountPredicates(Root<ExpenseEntity> root, CriteriaBuilder cb,
                                            ExpenseFilterRequest request, List<Predicate> predicates) {
        if (request.getMinAmount() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("amount"), request.getMinAmount()));
        }
        if (request.getMaxAmount() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("amount"), request.getMaxAmount()));
        }
    }

    private static void addReceiptPredicates(Root<ExpenseEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb,
                                             ExpenseFilterRequest request, List<Predicate> predicates) {
        if (request.getHasReceipt() != null) {
            Subquery<Long> receiptSubquery = query.subquery(Long.class);
            Root<ReceiptEntity> receiptRoot = receiptSubquery.from(ReceiptEntity.class);
            receiptSubquery.select(receiptRoot.get("expense").get("id"));
            receiptSubquery.where(cb.equal(receiptRoot.get("expense").get("id"), root.get("id")));

            if (request.getHasReceipt()) {
                predicates.add(cb.exists(receiptSubquery));
            } else {
                predicates.add(cb.not(cb.exists(receiptSubquery)));
            }
        }
    }

    private static void addCursorPredicates(Root<ExpenseEntity> root, CriteriaBuilder cb,
                                            Instant cursorCreatedAt, Long cursorId, List<Predicate> predicates) {
        if (cursorCreatedAt != null && cursorId != null) {
            Predicate cursorPredicate = cb.or(
                    cb.lessThan(root.get("createdAt"), cursorCreatedAt),
                    cb.and(
                            cb.equal(root.get("createdAt"), cursorCreatedAt),
                            cb.lessThan(root.get("id"), cursorId)
                    )
            );
            predicates.add(cursorPredicate);
        }
    }
}