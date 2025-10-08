package com.example.expensetracker.controller.v1;

import com.example.expensetracker.dto.ExpenseDto;
import com.example.expensetracker.response.ApiResponse;
import com.example.expensetracker.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseDto>> create(@RequestBody ExpenseDto expenseDto) {
        var created = expenseService.create(expenseDto);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expense created successfully", created)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseDto>> getById(@PathVariable Long id) {
        var expense = expenseService.getById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expense retrieved successfully", expense)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseDto>>> getAll() {
        var expenses = expenseService.getAll();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "All expenses retrieved successfully", expenses)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseDto>> update(@PathVariable Long id, @RequestBody ExpenseDto expenseDto) {
        var updated = expenseService.update(id, expenseDto);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expense updated successfully", updated)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id) {
        expenseService.delete(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expense deleted successfully", null)
        );
    }
}