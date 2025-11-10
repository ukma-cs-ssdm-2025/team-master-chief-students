package com.example.expensetracker.controller;

import com.example.expensetracker.config.SecurityConfig;
import com.example.expensetracker.config.TestSecurityConfig;
import com.example.expensetracker.controller.v1.CategoryController;
import com.example.expensetracker.dto.CategoryDto;
import com.example.expensetracker.exception.CategoryAlreadyExistsException;
import com.example.expensetracker.exception.CategoryNotFoundException;
import com.example.expensetracker.exception.ValidationException;
import com.example.expensetracker.security.JwtService;
import com.example.expensetracker.security.SecurityUser;
import com.example.expensetracker.service.CategoryService;
import com.example.expensetracker.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CategoryController.class)
@Import({SecurityConfig.class, TestSecurityConfig.class})
@DisplayName("CategoryController WebMvc Tests")
class CategoryControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CategoryService categoryService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserService userService;

    private void setupJwtMocks(String email) {
        when(jwtService.isTokenValid(anyString(), eq(true))).thenReturn(true);
        when(jwtService.extractEmail(anyString(), eq(true))).thenReturn(email);
        
        SecurityUser securityUser = new SecurityUser(
                com.example.expensetracker.entity.UserEntity.builder()
                        .id(1L)
                        .email(email)
                        .username("testuser")
                        .role("ROLE_USER")
                        .active(true)
                        .build()
        );
        when(userService.loadUserByUsername(email)).thenReturn(securityUser);
    }

    @Test
    @DisplayName("Should create category successfully")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldCreateCategorySuccessfully() throws Exception {
        // Given
        CategoryDto request = new CategoryDto();
        request.setName("Groceries");

        CategoryDto response = CategoryDto.builder()
                .id(1L)
                .name("Groceries")
                .build();

        setupJwtMocks("test@example.com");
        when(categoryService.create(any(CategoryDto.class))).thenReturn(response);

        // When/Then
        mockMvc.perform(post("/api/v1/categories")
                        .header("Authorization", "Bearer test-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Category created successfully"))
                .andExpect(jsonPath("$.data.id").value(1L))
                .andExpect(jsonPath("$.data.name").value("Groceries"));
    }

    @Test
    @DisplayName("Should return 400 when validation fails - null name")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldReturn400WhenValidationFailsNullName() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        CategoryDto request = new CategoryDto();
        request.setName(null);

        when(categoryService.create(any(CategoryDto.class)))
                .thenThrow(new ValidationException("Category name is required"));

        // When/Then
        mockMvc.perform(post("/api/v1/categories")
                        .header("Authorization", "Bearer test-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value(containsString("Category name is required")));
    }

    @Test
    @DisplayName("Should return 400 when validation fails - blank name")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldReturn400WhenValidationFailsBlankName() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        CategoryDto request = new CategoryDto();
        request.setName("   ");

        when(categoryService.create(any(CategoryDto.class)))
                .thenThrow(new ValidationException("Category name is required"));

        // When/Then
        mockMvc.perform(post("/api/v1/categories")
                        .header("Authorization", "Bearer test-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    @DisplayName("Should return 409 when category name already exists")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldReturn409WhenCategoryNameAlreadyExists() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        CategoryDto request = new CategoryDto();
        request.setName("Groceries");

        when(categoryService.create(any(CategoryDto.class)))
                .thenThrow(new CategoryAlreadyExistsException("Category with name 'Groceries' already exists."));

        // When/Then
        mockMvc.perform(post("/api/v1/categories")
                        .header("Authorization", "Bearer test-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value(containsString("already exists")));
    }

    @Test
    @DisplayName("Should get all categories successfully")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldGetAllCategoriesSuccessfully() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        List<CategoryDto> categories = Arrays.asList(
                CategoryDto.builder().id(1L).name("Groceries").build(),
                CategoryDto.builder().id(2L).name("Transport").build()
        );

        when(categoryService.getAllForCurrentUser()).thenReturn(categories);

        // When/Then
        mockMvc.perform(get("/api/v1/categories")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Categories retrieved successfully"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].id").value(1L))
                .andExpect(jsonPath("$.data[0].name").value("Groceries"))
                .andExpect(jsonPath("$.data[1].id").value(2L))
                .andExpect(jsonPath("$.data[1].name").value("Transport"));
    }

    @Test
    @DisplayName("Should return empty list when user has no categories")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldReturnEmptyListWhenUserHasNoCategories() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        when(categoryService.getAllForCurrentUser()).thenReturn(Arrays.asList());

        // When/Then
        mockMvc.perform(get("/api/v1/categories")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    @DisplayName("Should update category successfully")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldUpdateCategorySuccessfully() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        CategoryDto request = new CategoryDto();
        request.setName("Supermarket");

        CategoryDto response = CategoryDto.builder()
                .id(1L)
                .name("Supermarket")
                .build();

        when(categoryService.update(eq(1L), any(CategoryDto.class))).thenReturn(response);

        // When/Then
        mockMvc.perform(put("/api/v1/categories/1")
                        .header("Authorization", "Bearer test-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Category updated successfully"))
                .andExpect(jsonPath("$.data.id").value(1L))
                .andExpect(jsonPath("$.data.name").value("Supermarket"));
    }

    @Test
    @DisplayName("Should return 404 when category not found for update")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldReturn404WhenCategoryNotFoundForUpdate() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        CategoryDto request = new CategoryDto();
        request.setName("Supermarket");

        when(categoryService.update(eq(999L), any(CategoryDto.class)))
                .thenThrow(new CategoryNotFoundException("Category not found with id: 999"));

        // When/Then
        mockMvc.perform(put("/api/v1/categories/999")
                        .header("Authorization", "Bearer test-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Category not found with id: 999"));
    }

    @Test
    @DisplayName("Should return 409 when updating to existing category name")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldReturn409WhenUpdatingToExistingCategoryName() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        CategoryDto request = new CategoryDto();
        request.setName("Supermarket");

        when(categoryService.update(eq(1L), any(CategoryDto.class)))
                .thenThrow(new CategoryAlreadyExistsException("Category with name 'Supermarket' already exists."));

        // When/Then
        mockMvc.perform(put("/api/v1/categories/1")
                        .header("Authorization", "Bearer test-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value(containsString("already exists")));
    }

    @Test
    @DisplayName("Should delete category successfully")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldDeleteCategorySuccessfully() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        doNothing().when(categoryService).delete(1L);

        // When/Then
        mockMvc.perform(delete("/api/v1/categories/1")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Category deleted successfully"));

        verify(categoryService).delete(1L);
    }

    @Test
    @DisplayName("Should return 404 when category not found for delete")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldReturn404WhenCategoryNotFoundForDelete() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        doThrow(new CategoryNotFoundException("Category not found with id: 999"))
                .when(categoryService).delete(999L);

        // When/Then
        mockMvc.perform(delete("/api/v1/categories/999")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Category not found with id: 999"));
    }

    @Test
    @DisplayName("Should return 401 when not authenticated")
    void shouldReturn401WhenNotAuthenticated() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/categories"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should return 400 when validation fails - name too long")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldReturn400WhenNameTooLong() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        CategoryDto request = new CategoryDto();
        request.setName("a".repeat(101));

        when(categoryService.create(any(CategoryDto.class)))
                .thenThrow(new ValidationException("Category name must not exceed 100 characters"));

        // When/Then
        mockMvc.perform(post("/api/v1/categories")
                        .header("Authorization", "Bearer test-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value(containsString("Category name must be between 1 and 100 characters")));
    }
}

