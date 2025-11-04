package com.example.expensetracker.controller.v1;

import com.example.expensetracker.dto.CreateExpenseDto;
import com.example.expensetracker.dto.CursorPageResponse;
import com.example.expensetracker.dto.ExpenseDto;
import com.example.expensetracker.response.ApiResponse;
import com.example.expensetracker.response.ErrorResponse;
import com.example.expensetracker.service.BaseService;
import com.example.expensetracker.service.TeamExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/teams/{teamId}/expenses")
@RequiredArgsConstructor
@Tag(name = "Team Expenses", description = "Endpoints for managing team expenses with cursor-based pagination")
@SecurityRequirement(name = "BearerAuth")
public class TeamExpenseController extends BaseService {

    private final TeamExpenseService teamExpenseService;

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
    public ResponseEntity<ApiResponse<CursorPageResponse<ExpenseDto>>> listTeamExpenses(
            @PathVariable Long teamId,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "20") int limit
    ) {
        Long userId = getAuthenticatedUser().getId();

        CursorPageResponse<ExpenseDto> result = teamExpenseService.listTeamExpenses(userId, teamId, cursor, limit);

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
    public ResponseEntity<ApiResponse<ExpenseDto>> createInTeam(
            @PathVariable Long teamId,
            @Valid @RequestBody CreateExpenseDto dto) {
        Long me = getAuthenticatedUser().getId();
        ExpenseDto expense = teamExpenseService.createInTeam(me, teamId, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Expense created successfully", expense));
    }
}

