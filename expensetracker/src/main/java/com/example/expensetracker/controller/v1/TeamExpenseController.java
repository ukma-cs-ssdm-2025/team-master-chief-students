package com.example.expensetracker.controller.v1;

import com.example.expensetracker.dto.CreateExpenseRequest;
import com.example.expensetracker.dto.CursorPageResponse;
import com.example.expensetracker.dto.ExpenseFilterRequest;
import com.example.expensetracker.dto.ExpenseResponse;
import com.example.expensetracker.dto.TimeSeriesStatsDto;
import com.example.expensetracker.exception.AppException;
import com.example.expensetracker.service.ExpenseFilterService;
import com.example.expensetracker.response.ApiResponse;
import com.example.expensetracker.response.ErrorResponse;
import com.example.expensetracker.service.BaseService;
import com.example.expensetracker.service.ExportService;
import com.example.expensetracker.service.TeamExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.OutputStream;
import java.io.Writer;
import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/teams/{teamId}/expenses")
@RequiredArgsConstructor
@Tag(name = "Team Expenses", description = "Endpoints for managing team expenses with cursor-based pagination")
@SecurityRequirement(name = "BearerAuth")
public class TeamExpenseController extends BaseService {

    private final TeamExpenseService teamExpenseService;
    private final ExportService exportService;
    private final ExpenseFilterService expenseFilterService;

    @Operation(
            summary = "List team expenses",
            description = "Retrieves a paginated list of expenses for a team using cursor-based pagination. " +
                    "Expenses are ordered by createdAt DESC, id DESC. " +
                    "Use the 'cursor' parameter to fetch the next page.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Team expenses retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                    {
                      "success": true,
                      "message": "Team expenses retrieved successfully",
                      "data": {
                        "items": [
                          {
                            "id": 1,
                            "categoryId": 1,
                            "categoryName": "Food",
                            "description": "Team lunch",
                            "amount": 150.50,
                            "date": "2025-01-15"
                          },
                          {
                            "id": 2,
                            "categoryId": 2,
                            "categoryName": "Transport",
                            "description": "Taxi",
                            "amount": 25.00,
                            "date": "2025-01-14"
                          }
                        ],
                        "nextCursor": "MTczNzA2NjI1OTY1OjI=",
                        "hasNext": true,
                        "size": 2
                      }
                    }
                    """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid request parameters",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "User is not a member of the team",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Team not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @GetMapping
    public ResponseEntity<ApiResponse<CursorPageResponse<ExpenseResponse>>> listTeamExpenses(
            @PathVariable Long teamId,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "20") int limit
    ) {
        Long userId = getAuthenticatedUser().getId();

        CursorPageResponse<ExpenseResponse> result = teamExpenseService.listTeamExpenses(userId, teamId, cursor, limit);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Team expenses retrieved successfully", result)
        );
    }

    @Operation(
            summary = "Create team expense",
            description = "Creates a new expense for the team. Requires MEMBER role or higher.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Expense created successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Insufficient permissions or not a team member",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createInTeam(
            @PathVariable Long teamId,
            @Valid @RequestBody CreateExpenseRequest request) {
        Long me = getAuthenticatedUser().getId();
        ExpenseResponse expense = teamExpenseService.createInTeam(me, teamId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Expense created successfully", expense));
    }

    @Operation(
            summary = "Export team expenses to CSV",
            description = "Exports all team expenses to CSV format. Requires OWNER or ADMIN role.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Team expenses exported successfully",
                    content = @Content(mediaType = "text/csv")
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Insufficient permissions - requires OWNER or ADMIN role",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Team not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @GetMapping("/export/csv")
    public void exportToCsv(
            @PathVariable Long teamId,
            HttpServletResponse response) {
        response.setContentType("text/csv; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"team-expenses.csv\"");

        try (Writer writer = response.getWriter()) {
            Long userId = getAuthenticatedUser().getId();
            exportService.exportTeamExpensesToCsv(userId, teamId, writer);
        } catch (Exception e) {
            throw new AppException("Error exporting team expenses to CSV", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(
            summary = "Export team expenses to PDF",
            description = "Exports all team expenses to PDF format. Requires OWNER or ADMIN role.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Team expenses exported successfully",
                    content = @Content(mediaType = "application/pdf")
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Insufficient permissions - requires OWNER or ADMIN role",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Team not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @GetMapping("/export/pdf")
    public void exportToPdf(
            @PathVariable Long teamId,
            HttpServletResponse response) {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"team-expenses.pdf\"");

        try (OutputStream outputStream = response.getOutputStream()) {
            Long userId = getAuthenticatedUser().getId();
            exportService.exportTeamExpensesToPdf(userId, teamId, outputStream);
        } catch (Exception e) {
            throw new AppException("Error exporting team expenses to PDF", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(
            summary = "Get team time series statistics",
            description = """
                    Retrieves time series statistics for team expenses grouped by day.
                    
                    **Date filtering logic**:
                    - No dates: Returns statistics for all team expenses
                    - Only fromDate: Returns statistics for that specific day
                    - Both fromDate and toDate: Returns statistics for the date range (inclusive)
                    
                    **Response format**:
                    - totalAmount: Total sum of all expenses in the period
                    - count: Total number of expenses
                    - byPeriod: Array of daily statistics (date, totalAmount, count), sorted by date ascending
                    
                    Requires team membership.
                    """,
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Team time series statistics retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                                    {
                                      "success": true,
                                      "message": "Team time series statistics retrieved successfully",
                                      "data": {
                                        "totalAmount": 150.0,
                                        "count": 5,
                                        "byPeriod": [
                                          {
                                            "date": "2025-10-10",
                                            "totalAmount": 50.0,
                                            "count": 2
                                          },
                                          {
                                            "date": "2025-10-11",
                                            "totalAmount": 100.0,
                                            "count": 3
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
                    responseCode = "403",
                    description = "User is not a member of the team",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Team not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @GetMapping("/time-series-stats")
    public ResponseEntity<ApiResponse<TimeSeriesStatsDto>> getTeamTimeSeriesStatistics(
            @PathVariable Long teamId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "exact") String categoryMatch,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) Boolean hasReceipt,
            @RequestParam(required = false) String search
    ) {
        Long userId = getAuthenticatedUser().getId();

        LocalDate effectiveToDate = toDate;
        if (fromDate != null && toDate == null) {
            effectiveToDate = fromDate;
        }

        ExpenseFilterRequest request = ExpenseFilterRequest.builder()
                .categoryId(categoryId)
                .category(category)
                .categoryMatch(categoryMatch)
                .fromDate(fromDate)
                .toDate(effectiveToDate)
                .minAmount(minAmount)
                .maxAmount(maxAmount)
                .hasReceipt(hasReceipt)
                .search(search)
                .build();

        TimeSeriesStatsDto stats = expenseFilterService.getTeamTimeSeriesStatistics(userId, teamId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Team time series statistics retrieved successfully", stats)
        );
    }
}

