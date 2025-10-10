package com.example.expensetracker.controller.v1;

import com.example.expensetracker.dto.ExpenseDto;
import com.example.expensetracker.response.ApiResponse;
import com.example.expensetracker.response.ErrorResponse;
import com.example.expensetracker.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses/filter")
@RequiredArgsConstructor
@Tag(name = "Expense Filter", description = "Endpoints for filtering expenses and retrieving statistics")
public class ExpenseFilterController {

    private final ExpenseService expenseService;

    @Operation(summary = "Filter expenses", description = "Filters expenses by category, date range, and amount range.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Filtered expenses retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                    {
                      "success": true,
                      "message": "Filtered expenses retrieved successfully",
                      "data": [
                        {
                          "id": 1,
                          "category": "Food",
                          "description": "Lunch",
                          "amount": 12.5,
                          "date": "2025-10-10"
                        }
                      ],
                      "metadata": {
                        "timestamp": "2025-10-10T20:00:00"
                      }
                    }
                    """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "No expenses found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
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

    @Operation(summary = "Get expense statistics", description = "Returns total amount and count of expenses.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Expense statistics retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                    {
                      "success": true,
                      "message": "Expense statistics retrieved successfully",
                      "data": {
                        "totalAmount": 150.0,
                        "count": 5
                      },
                      "metadata": {
                        "timestamp": "2025-10-10T20:00:00"
                      }
                    }
                    """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "No expenses found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Object>> getStatistics() {
        var stats = expenseService.getStatistics();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expense statistics retrieved successfully", stats)
        );
    }
}