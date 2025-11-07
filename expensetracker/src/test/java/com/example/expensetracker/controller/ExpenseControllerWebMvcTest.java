package com.example.expensetracker.controller;

import com.example.expensetracker.config.SecurityConfig;
import com.example.expensetracker.config.TestSecurityConfig;
import com.example.expensetracker.controller.v1.ExpenseController;
import com.example.expensetracker.security.JwtService;
import com.example.expensetracker.security.SecurityUser;
import com.example.expensetracker.service.UserService;
import com.example.expensetracker.dto.CreateExpenseRequest;
import com.example.expensetracker.dto.ExpenseResponse;
import com.example.expensetracker.dto.UpdateExpenseRequest;
import com.example.expensetracker.exception.CategoryNotFoundException;
import com.example.expensetracker.exception.NotFoundException;
import com.example.expensetracker.exception.ValidationException;
import com.example.expensetracker.security.JwtAuthenticationFilter;
import com.example.expensetracker.service.ExpenseService;
import com.example.expensetracker.service.ExportService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExpenseController.class)
@Import({SecurityConfig.class, TestSecurityConfig.class})
@DisplayName("ExpenseController WebMvc Tests")
class ExpenseControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ExpenseService expenseService;

    @MockitoBean
    private ExportService exportService;

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
    @DisplayName("Should create expense successfully")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldCreateExpenseSuccessfully() throws Exception {
        // Given
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setCategoryId(1L);
        request.setAmount(BigDecimal.valueOf(100.50));
        request.setDescription("Test expense");
        request.setDate(LocalDate.now());

        ExpenseResponse response = ExpenseResponse.builder()
                .id(1L)
                .categoryId(1L)
                .amount(request.getAmount())
                .description(request.getDescription())
                .build();

        setupJwtMocks("test@example.com");
        when(expenseService.create(any(CreateExpenseRequest.class))).thenReturn(response);

        // When/Then
        mockMvc.perform(post("/api/v1/expenses")
                        .header("Authorization", "Bearer test-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1L))
                .andExpect(jsonPath("$.data.amount").value(100.50))
                .andExpect(jsonPath("$.data.description").value("Test expense"));
    }

    @Test
    @DisplayName("Should return 400 when validation fails")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldReturn400WhenValidationFails() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setCategoryId(null);
        request.setAmount(BigDecimal.valueOf(100));

        // When/Then
        mockMvc.perform(post("/api/v1/expenses")
                        .header("Authorization", "Bearer test-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value(containsString("Category ID is required")));
    }

    @Test
    @DisplayName("Should return 404 when expense not found")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldReturn404WhenExpenseNotFound() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        when(expenseService.getById(999L))
                .thenThrow(new NotFoundException("Expense not found"));

        // When/Then
        mockMvc.perform(get("/api/v1/expenses/999")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Expense not found"));
    }

    @Test
    @DisplayName("Should return 401 when not authenticated")
    void shouldReturn401WhenNotAuthenticated() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/expenses/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should return 400 when category not found")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldReturn400WhenCategoryNotFound() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setCategoryId(999L);
        request.setAmount(BigDecimal.valueOf(100));

        when(expenseService.create(any(CreateExpenseRequest.class)))
                .thenThrow(new CategoryNotFoundException("Category not found with id: 999"));

        // When/Then
        mockMvc.perform(post("/api/v1/expenses")
                        .header("Authorization", "Bearer test-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Category not found with id: 999"));
    }

    @Test
    @DisplayName("Should update expense successfully")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldUpdateExpenseSuccessfully() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        UpdateExpenseRequest request = new UpdateExpenseRequest();
        request.setCategoryId(1L);
        request.setAmount(BigDecimal.valueOf(200.0));
        request.setDescription("Updated expense");

        ExpenseResponse response = ExpenseResponse.builder()
                .id(1L)
                .categoryId(1L)
                .amount(request.getAmount())
                .description(request.getDescription())
                .build();

        when(expenseService.update(eq(1L), any(UpdateExpenseRequest.class))).thenReturn(response);

        // When/Then
        mockMvc.perform(put("/api/v1/expenses/1")
                        .header("Authorization", "Bearer test-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1L))
                .andExpect(jsonPath("$.data.amount").value(200.0));
    }

    @Test
    @DisplayName("Should delete expense successfully")
    @WithMockUser(username = "test@example.com", roles = "USER")
    void shouldDeleteExpenseSuccessfully() throws Exception {
        // Given
        setupJwtMocks("test@example.com");
        doNothing().when(expenseService).delete(1L);

        // When/Then
        mockMvc.perform(delete("/api/v1/expenses/1")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(expenseService).delete(1L);
    }
}

