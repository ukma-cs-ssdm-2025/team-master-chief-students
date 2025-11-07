package com.example.expensetracker.controller.v1;

import com.example.expensetracker.dto.ExpenseDto;
import com.example.expensetracker.dto.ShareToTeamDto;
import com.example.expensetracker.response.ApiResponse;
import com.example.expensetracker.response.ErrorResponse;
import com.example.expensetracker.service.BaseService;
import com.example.expensetracker.service.TeamExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/expenses/{expenseId}/share")
@RequiredArgsConstructor
@Tag(name = "Expense Sharing", description = "Endpoints for sharing personal expenses to teams")
@SecurityRequirement(name = "BearerAuth")
public class ExpenseSharingController extends BaseService {

    private final TeamExpenseService teamExpenseService;

    @Operation(
            summary = "Share expense to team",
            description = "Shares a personal expense to a team. " +
                    "MOVE mode: moves the expense to the team (it disappears from personal list). " +
                    "COPY_REFERENCE mode: creates a copy of the expense for the team, keeping the original in personal list.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Expense shared successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid request or expense already shared",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Not the owner of the expense or not a team member",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Expense or team not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseDto>> shareToTeam(
            @PathVariable Long expenseId,
            @Valid @RequestBody ShareToTeamDto dto) {
        Long me = getAuthenticatedUser().getId();
        ExpenseDto expense = teamExpenseService.sharePersonalToTeam(me, expenseId, dto.getTeamId(), dto.getMode());
        return ResponseEntity.ok(new ApiResponse<>(true, "Expense shared successfully", expense));
    }
}

