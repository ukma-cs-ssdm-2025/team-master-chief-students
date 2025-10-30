package com.example.expensetracker.controller.v1;

import com.example.expensetracker.dto.ExpenseDto;
import com.example.expensetracker.exception.AppException;
import com.example.expensetracker.response.ApiResponse;
import com.example.expensetracker.response.ErrorResponse;
import com.example.expensetracker.service.ExpenseService;
import com.example.expensetracker.service.ExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Writer;
import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
@Tag(name = "Expenses", description = "Endpoints for managing expenses")
@SecurityRequirement(name = "BearerAuth")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final ExportService exportService;

    @Operation(
            summary = "Create expense",
            description = "Creates a new expense record.",
            security = @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "BearerAuth") // <-- JWT requirement
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Expense created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                {
                  "success": true,
                  "message": "Expense created successfully",
                  "data": {
                    "id": 1,
                    "category": "Food",
                    "description": "Lunch",
                    "amount": 12.5,
                    "date": "2025-10-10"
                  },
                  "metadata": {
                    "timestamp": "2025-10-10T20:00:00"
                  }
                }
                """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Validation error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseDto>> create(@RequestBody ExpenseDto expenseDto) {
        var created = expenseService.create(expenseDto);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expense created successfully", created)
        );
    }

    @Operation(
            summary = "Get expense by ID",
            description = "Retrieves a specific expense record by its ID.",
            security = @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "BearerAuth") // <-- JWT requirement
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Expense retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                {
                  "success": true,
                  "message": "Expense retrieved successfully",
                  "data": {
                    "id": 1,
                    "category": "Food",
                    "description": "Lunch",
                    "amount": 12.5,
                    "date": "2025-10-10"
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
                    description = "Expense not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(value = """
                {
                  "status": 404,
                  "message": "Expense not found",
                  "timestamp": "2025-10-10T20:00:00"
                }
                """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(value = """
                {
                  "status": 500,
                  "message": "Internal server error",
                  "timestamp": "2025-10-10T20:00:00"
                }
                """)
                    )
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseDto>> getById(@PathVariable Long id) {
        var expense = expenseService.getById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expense retrieved successfully", expense)
        );
    }

    @Operation(
            summary = "Get all expenses",
            description = "Retrieves all expense records.",
            security = @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "BearerAuth") // <-- JWT requirement
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "All expenses retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                {
                  "success": true,
                  "message": "All expenses retrieved successfully",
                  "data": [
                    {
                      "id": 1,
                      "category": "Food",
                      "description": "Lunch",
                      "amount": 12.5,
                      "date": "2025-10-10"
                    },
                    {
                      "id": 2,
                      "category": "Transport",
                      "description": "Taxi",
                      "amount": 20.0,
                      "date": "2025-10-09"
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
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(value = """
                {
                  "status": 500,
                  "message": "Internal server error",
                  "timestamp": "2025-10-10T20:00:00"
                }
                """)
                    )
            )
    })
    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseDto>>> getAll() {
        var expenses = expenseService.getAll();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "All expenses retrieved successfully", expenses)
        );
    }

    @Operation(
            summary = "Update expense",
            description = "Updates an existing expense record by its ID.",
            security = @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "BearerAuth") // <-- JWT requirement
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Expense updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                {
                  "success": true,
                  "message": "Expense updated successfully",
                  "data": {
                    "id": 1,
                    "category": "Food",
                    "description": "Updated lunch",
                    "amount": 15.0,
                    "date": "2025-10-10"
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
                    description = "Expense not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(value = """
                {
                  "status": 404,
                  "message": "Expense not found",
                  "timestamp": "2025-10-10T20:00:00"
                }
                """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(value = """
                {
                  "status": 500,
                  "message": "Internal server error",
                  "timestamp": "2025-10-10T20:00:00"
                }
                """)
                    )
            )
    })
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseDto>> update(@PathVariable Long id, @RequestBody ExpenseDto expenseDto) {
        var updated = expenseService.update(id, expenseDto);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expense updated successfully", updated)
        );
    }

    @Operation(
            summary = "Delete expense",
            description = "Deletes an expense record by its ID.",
            security = @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "BearerAuth") // <-- JWT requirement
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Expense deleted successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                {
                  "success": true,
                  "message": "Expense deleted successfully",
                  "data": null,
                  "metadata": {
                    "timestamp": "2025-10-10T20:00:00"
                  }
                }
                """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Expense not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(value = """
                {
                  "status": 404,
                  "message": "Expense not found",
                  "timestamp": "2025-10-10T20:00:00"
                }
                """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(value = """
                {
                  "status": 500,
                  "message": "Internal server error",
                  "timestamp": "2025-10-10T20:00:00"
                }
                """)
                    )
            )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id) {
        expenseService.delete(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expense deleted successfully", null)
        );
    }

    @GetMapping("/export/csv")
    public void exportToCsv(HttpServletResponse response) {
        response.setContentType("text/csv; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"expenses.csv\"");

        try (Writer writer = response.getWriter()) {
            exportService.exportUserExpensesToCsv(writer);
        } catch (Exception e) {
            throw new AppException("Error exporting expenses to CSV", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}