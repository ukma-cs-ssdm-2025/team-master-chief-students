package com.example.expensetracker.controller.v1;

import com.example.expensetracker.dto.CursorPageResponse;
import com.example.expensetracker.dto.ExpenseFilterItemDto;
import com.example.expensetracker.dto.ExpenseFilterRequest;
import com.example.expensetracker.dto.ExpenseStatsDto;
import com.example.expensetracker.service.ExpenseFilterService;
import com.example.expensetracker.response.ApiResponse;
import com.example.expensetracker.response.ErrorResponse;
import com.example.expensetracker.service.BaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/expenses/filter-service")
@RequiredArgsConstructor
@Tag(name = "Expense Filter Service", description = "SQL-level filtering and statistics for expenses. Server does not sort - client handles sorting.")
@SecurityRequirement(name = "BearerAuth")
public class ExpenseFilterController extends BaseService {

    private static final Logger logger = LogManager.getLogger(ExpenseFilterController.class);
    private final ExpenseFilterService filterService;

    @Operation(
            summary = "Get filtered expenses",
            description = """
                    Retrieves filtered expenses with cursor-based pagination.
                    All filtering is done at SQL level for performance.
                    
                    **Important**: Server does NOT accept 'sort' parameter and does NOT sort data.
                    Server only uses internal ordering (created_at DESC, id DESC) for cursor pagination.
                    Client must sort the results on their side.
                    
                    **Filtering parameters** (all optional):
                    - categoryId: Filter by category ID
                    - category: Filter by category name (exact or like match)
                    - categoryMatch: 'exact' or 'like' (default: 'exact')
                    - fromDate/toDate: Date range filter (ISO format)
                    - minAmount/maxAmount: Amount range filter
                    - hasReceipt: true/false to filter by receipt presence
                    - teamId: Filter by team ID
                    - search: Full-text search on description (case-insensitive LIKE)
                    - cursor: Base64-encoded cursor for pagination
                    - limit: Page size (1-100, default: 20)
                    """,
            security = @SecurityRequirement(name = "BearerAuth")
    )
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
                                      "data": {
                                        "items": [
                                          {
                                            "id": 123,
                                            "categoryId": 5,
                                            "categoryName": "Food",
                                            "description": "Lunch",
                                            "amount": 12.50,
                                            "date": "2025-10-10",
                                            "hasReceipt": true,
                                            "teamId": 9,
                                            "createdAt": "2025-11-01T12:34:56Z"
                                          }
                                        ],
                                        "nextCursor": "MTczMDcwNjYyNTk2NToxMjM0NQ",
                                        "hasNext": true,
                                        "size": 20
                                      }
                                    }
                                    """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid filter parameters",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - JWT token missing or invalid",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - Access denied",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @GetMapping("/items")
    public ResponseEntity<ApiResponse<CursorPageResponse<ExpenseFilterItemDto>>> getFilteredExpenses(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "exact") String categoryMatch,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) Boolean hasReceipt,
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String cursor,
            @RequestParam(required = false, defaultValue = "20") @Min(value = 1, message = "Limit must be at least 1") @Positive(message = "Limit must be positive") Integer limit
    ) {
        Long userId = getAuthenticatedUser().getId();

        ExpenseFilterRequest request = ExpenseFilterRequest.builder()
                .categoryId(categoryId)
                .category(category)
                .categoryMatch(categoryMatch)
                .fromDate(fromDate)
                .toDate(toDate)
                .minAmount(minAmount)
                .maxAmount(maxAmount)
                .hasReceipt(hasReceipt)
                .teamId(teamId)
                .search(search)
                .cursor(cursor)
                .limit(limit)
                .build();

        CursorPageResponse<ExpenseFilterItemDto> result = filterService.getFilteredExpenses(userId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Filtered expenses retrieved successfully", result)
        );
    }

    @Operation(
            summary = "Get expense statistics",
            description = """
                    Retrieves aggregated statistics for expenses matching the filter criteria.
                    All aggregations are done at SQL level.
                    
                    **Statistics include**:
                    - totalAmount: Sum of all amounts
                    - count: Total number of expenses
                    - byCategory: Map of categoryId -> total amount
                    - byDate: Array of daily statistics (date, totalAmount, count)
                    
                    Uses the same filter parameters as /items endpoint (except cursor/limit).
                    """,
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Statistics retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                                    {
                                      "success": true,
                                      "message": "Expense statistics retrieved successfully",
                                      "data": {
                                        "totalAmount": 150.0,
                                        "count": 5,
                                        "byCategory": {
                                          "5": 120.0,
                                          "7": 30.0
                                        },
                                        "byDate": [
                                          {
                                            "date": "2025-10-10",
                                            "totalAmount": 50.0,
                                            "count": 2
                                          }
                                        ]
                                      }
                                    }
                                    """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid filter parameters",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<ExpenseStatsDto>> getStatistics(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "exact") String categoryMatch,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) Boolean hasReceipt,
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) String search
    ) {
        Long userId = getAuthenticatedUser().getId();

        ExpenseFilterRequest request = ExpenseFilterRequest.builder()
                .categoryId(categoryId)
                .category(category)
                .categoryMatch(categoryMatch)
                .fromDate(fromDate)
                .toDate(toDate)
                .minAmount(minAmount)
                .maxAmount(maxAmount)
                .hasReceipt(hasReceipt)
                .teamId(teamId)
                .search(search)
                .build();

        ExpenseStatsDto stats = filterService.getStatistics(userId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expense statistics retrieved successfully", stats)
        );
    }
}

