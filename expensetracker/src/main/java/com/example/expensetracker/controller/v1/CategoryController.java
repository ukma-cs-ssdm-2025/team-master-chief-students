package com.example.expensetracker.controller.v1;

import com.example.expensetracker.dto.CategoryDto;
import com.example.expensetracker.response.ApiResponse;
import com.example.expensetracker.response.ErrorResponse;
import com.example.expensetracker.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Endpoints for managing user-specific categories")
@SecurityRequirement(name = "BearerAuth")
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(
            summary = "Create category",
            description = "Creates a new category for the current authenticated user."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "Category created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                                {
                                  "success": true,
                                  "message": "Category created successfully",
                                  "data": {
                                    "id": 1,
                                    "name": "Groceries"
                                  },
                                  "metadata": {
                                    "timestamp": "2025-10-22T13:52:00"
                                  }
                                }
                                """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Validation error (e.g., name is empty)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "Category with this name already exists",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDto>> create(@RequestBody CategoryDto categoryDto) {
        CategoryDto createdCategory = categoryService.create(categoryDto);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Category created successfully", createdCategory),
                HttpStatus.CREATED
        );
    }

    @Operation(
            summary = "Get all categories",
            description = "Retrieves all categories for the current authenticated user."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Categories retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                                {
                                  "success": true,
                                  "message": "Categories retrieved successfully",
                                  "data": [
                                    {
                                      "id": 1,
                                      "name": "Groceries"
                                    },
                                    {
                                      "id": 2,
                                      "name": "Transport"
                                    }
                                  ],
                                  "metadata": {
                                    "timestamp": "2025-10-22T13:55:00"
                                  }
                                }
                                """)
                    )
            )
    })
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAllForCurrentUser() {
        List<CategoryDto> categories = categoryService.getAllForCurrentUser();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Categories retrieved successfully", categories)
        );
    }

    @Operation(
            summary = "Update category",
            description = "Updates an existing category by its ID."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Category updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                                {
                                  "success": true,
                                  "message": "Category updated successfully",
                                  "data": {
                                    "id": 1,
                                    "name": "Supermarket"
                                  },
                                  "metadata": {
                                    "timestamp": "2025-10-22T14:00:00"
                                  }
                                }
                                """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Category not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(value = """
                                {
                                  "status": 404,
                                  "message": "Category not found",
                                  "timestamp": "2025-10-22T14:01:00"
                                }
                                """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "Another category with this name already exists",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> update(@PathVariable Long id, @RequestBody CategoryDto categoryDto) {
        CategoryDto updatedCategory = categoryService.update(id, categoryDto);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Category updated successfully", updatedCategory)
        );
    }

    @Operation(
            summary = "Delete category",
            description = "Deletes a category by its ID. Fails if the category is in use by expenses."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Category deleted successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = """
                                {
                                  "success": true,
                                  "message": "Category deleted successfully",
                                  "data": null,
                                  "metadata": {
                                    "timestamp": "2025-10-22T14:05:00"
                                  }
                                }
                                """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Category not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(value = """
                                {
                                  "status": 404,
                                  "message": "Category not found",
                                  "timestamp": "2025-10-22T14:06:00"
                                }
                                """)
                    )
            )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Category deleted successfully", null)
        );
    }
}