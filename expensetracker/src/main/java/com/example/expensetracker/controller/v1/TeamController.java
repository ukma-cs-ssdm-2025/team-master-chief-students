package com.example.expensetracker.controller.v1;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.enums.TeamRole;
import com.example.expensetracker.response.ApiResponse;
import com.example.expensetracker.response.ErrorResponse;
import com.example.expensetracker.service.BaseService;
import com.example.expensetracker.service.TeamService;
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

import java.util.List;

@RestController
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
@Tag(name = "Teams", description = "Endpoints for managing teams and team members")
@SecurityRequirement(name = "BearerAuth")
public class TeamController extends BaseService {

    private final TeamService teamService;

    @Operation(summary = "Create team", description = "Creates a new team. The creator becomes the owner.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Team created successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Validation error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PostMapping
    public ResponseEntity<ApiResponse<TeamDto>> createTeam(@Valid @RequestBody CreateTeamDto dto) {
        Long me = getAuthenticatedUser().getId();
        TeamDto team = teamService.createTeam(me, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Team created successfully", team));
    }

    @Operation(summary = "List my teams", description = "Returns all teams where the current user is a member.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<TeamDto>>> listMyTeams() {
        Long me = getAuthenticatedUser().getId();
        List<TeamDto> teams = teamService.listMyTeams(me);
        return ResponseEntity.ok(new ApiResponse<>(true, "Teams retrieved successfully", teams));
    }

    @Operation(summary = "Get team details", description = "Returns team details and members list.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Team details retrieved successfully"
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
    @GetMapping("/{teamId}")
    public ResponseEntity<ApiResponse<TeamDetailsDto>> getTeam(@PathVariable Long teamId) {
        Long me = getAuthenticatedUser().getId();
        TeamDetailsDto team = teamService.getTeam(me, teamId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Team details retrieved successfully", team));
    }

    @Operation(summary = "Add team member", description = "Adds a user to the team. Requires OWNER or ADMIN role.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Member added successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Insufficient permissions",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "User is already a member",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PostMapping("/{teamId}/members")
    public ResponseEntity<ApiResponse<Void>> addMember(
            @PathVariable Long teamId,
            @Valid @RequestBody AddMemberDto dto) {
        Long me = getAuthenticatedUser().getId();
        teamService.addMember(me, teamId, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Member added successfully", null));
    }

    @Operation(summary = "Change member role", description = "Changes the role of a team member. Requires OWNER or ADMIN role.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Role changed successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Insufficient permissions",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "Cannot change role of the last owner",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PatchMapping("/{teamId}/members/{userId}")
    public ResponseEntity<ApiResponse<Void>> changeRole(
            @PathVariable Long teamId,
            @PathVariable Long userId,
            @RequestParam TeamRole role) {
        Long me = getAuthenticatedUser().getId();
        teamService.changeRole(me, teamId, userId, role);
        return ResponseEntity.ok(new ApiResponse<>(true, "Role changed successfully", null));
    }

    @Operation(summary = "Remove team member", description = "Removes a member from the team. Requires OWNER or ADMIN role, or the member can remove themselves.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Member removed successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Insufficient permissions",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "Cannot remove the last owner",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @DeleteMapping("/{teamId}/members/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable Long teamId,
            @PathVariable Long userId) {
        Long me = getAuthenticatedUser().getId();
        teamService.removeMember(me, teamId, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Member removed successfully", null));
    }

    @Operation(summary = "Update team name", description = "Updates the team name. Requires OWNER or ADMIN role.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Team name updated successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Validation error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Insufficient permissions",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Team not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PatchMapping("/{teamId}/name")
    public ResponseEntity<ApiResponse<TeamDto>> updateTeamName(
            @PathVariable Long teamId,
            @Valid @RequestBody UpdateTeamNameDto dto) {
        Long me = getAuthenticatedUser().getId();
        TeamDto team = teamService.updateTeamName(me, teamId, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Team name updated successfully", team));
    }

    @Operation(summary = "Delete team", description = "Deletes a team. Only the team owner can delete the team. All team members will be removed automatically.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Team deleted successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Insufficient permissions - only team owner can delete the team",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Team not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @DeleteMapping("/{teamId}")
    public ResponseEntity<ApiResponse<Void>> deleteTeam(@PathVariable Long teamId) {
        Long me = getAuthenticatedUser().getId();
        teamService.deleteTeam(me, teamId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Team deleted successfully", null));
    }
}

