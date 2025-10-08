package com.example.expensetracker.controller.v1;

import com.example.expensetracker.dto.ExpenseDto;
import com.example.expensetracker.response.ApiResponse;
import com.example.expensetracker.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses/filter")
@RequiredArgsConstructor
public class ExpenseFilterController {

    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseDto>>> filter(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount) {

        var result = expenseService.filter(category, fromDate, toDate, minAmount, maxAmount);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Filtered expenses retrieved successfully", result)
        );
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Object>> getStatistics() {
        var stats = expenseService.getStatistics();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expense statistics retrieved successfully", stats)
        );
    }
}