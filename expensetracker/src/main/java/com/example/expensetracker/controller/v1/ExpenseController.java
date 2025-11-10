package com.example.expensetracker.controller.v1;

import com.example.expensetracker.dto.CreateExpenseRequest;
import com.example.expensetracker.dto.CursorPageResponse;
import com.example.expensetracker.dto.ExpenseResponse;
import com.example.expensetracker.dto.UpdateExpenseRequest;
import com.example.expensetracker.dto.ReceiptDto;
import com.example.expensetracker.dto.ReceiptFile;
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
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.OutputStream;
import java.io.Writer;

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
    public ResponseEntity<ApiResponse<ExpenseResponse>> create(@Valid @RequestBody CreateExpenseRequest request) {
        var created = expenseService.create(request);
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
    public ResponseEntity<ApiResponse<ExpenseResponse>> getById(@PathVariable Long id) {
        var expense = expenseService.getById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expense retrieved successfully", expense)
        );
    }

    @Operation(
            summary = "Get all expenses",
            description = "Retrieves a paginated list of expenses using cursor-based pagination. " +
                    "Expenses are ordered by createdAt DESC, id DESC. " +
                    "Use the 'cursor' parameter to fetch the next page.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Expenses retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                {
                  "success": true,
                  "message": "Expenses retrieved successfully",
                  "data": {
                    "items": [
                      {
                        "id": 1,
                        "categoryId": 1,
                        "categoryName": "Food",
                        "description": "Lunch",
                        "amount": 12.5,
                        "date": "2025-10-10"
                      },
                      {
                        "id": 2,
                        "categoryId": 2,
                        "categoryName": "Transport",
                        "description": "Taxi",
                        "amount": 20.0,
                        "date": "2025-10-09"
                      }
                    ],
                    "nextCursor": "MTczMDcwNjYyNTk2NToxMjM0NQ",
                    "hasNext": true,
                    "size": 2
                  }
                }
                """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid cursor format",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    @GetMapping
    public ResponseEntity<ApiResponse<CursorPageResponse<ExpenseResponse>>> getAll(
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "20") int limit
    ) {
        CursorPageResponse<ExpenseResponse> result = expenseService.getAllPaginated(cursor, limit);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expenses retrieved successfully", result)
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
    public ResponseEntity<ApiResponse<ExpenseResponse>> update(@PathVariable Long id, @Valid @RequestBody UpdateExpenseRequest request) {
        var updated = expenseService.update(id, request);
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

    @PostMapping("/{expenseId}/receipt")
    public ResponseEntity<ReceiptDto> uploadReceipt(
            @PathVariable Long expenseId,
            @RequestParam("file") MultipartFile file
    ) {
        ReceiptDto createdReceipt = expenseService.addReceipt(expenseId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReceipt);
    }

    @DeleteMapping("/{expenseId}/receipt")
    public ResponseEntity<Void> deleteReceipt(@PathVariable Long expenseId) {
        expenseService.deleteReceipt(expenseId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{expenseId}/receipt")
    public ResponseEntity<Resource> getReceiptFile(@PathVariable Long expenseId) {
        ReceiptFile receiptFile = expenseService.loadReceiptFile(expenseId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(receiptFile.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + receiptFile.resource().getFilename() + "\"")
                .body(receiptFile.resource());
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

    @GetMapping("/export/pdf")
    public void exportToPdf(HttpServletResponse response) {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"expenses.pdf\"");

        try (OutputStream outputStream = response.getOutputStream()) {
            exportService.exportUserExpensesToPdf(outputStream);
        } catch (Exception e) {
            throw new AppException("Error exporting expenses to PDF", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}