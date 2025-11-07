package com.example.expensetracker.testutil.factory;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.entity.*;
import com.example.expensetracker.enums.TeamRole;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Random;

public class TestDataFactory {

    private static final Random RANDOM = new Random(42);

    // ========== UserEntity ==========
    public static UserEntity.UserEntityBuilder userEntity() {
        return UserEntity.builder()
                .email("test" + RANDOM.nextInt(10000) + "@example.com")
                .username("testuser" + RANDOM.nextInt(10000))
                .password("$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy") // "password" encoded
                .role("ROLE_USER")
                .active(true);
    }

    public static UserEntity createUser(Long id) {
        return userEntity().id(id).build();
    }

    public static UserEntity createUser() {
        return userEntity().build();
    }

    // ========== CategoryEntity ==========
    public static CategoryEntity.CategoryEntityBuilder categoryEntity() {
        return CategoryEntity.builder()
                .name("Test Category " + RANDOM.nextInt(1000));
    }

    public static CategoryEntity createCategory(Long id, UserEntity user) {
        return categoryEntity()
                .id(id)
                .user(user)
                .build();
    }

    public static CategoryEntity createCategory(UserEntity user) {
        return categoryEntity()
                .user(user)
                .build();
    }

    // ========== ExpenseEntity ==========
    public static ExpenseEntity.ExpenseEntityBuilder expenseEntity() {
        return ExpenseEntity.builder()
                .amount(BigDecimal.valueOf(10.0 + RANDOM.nextDouble() * 1000))
                .description("Test expense " + RANDOM.nextInt(1000))
                .date(LocalDate.now().minusDays(RANDOM.nextInt(30)))
                .createdAt(Instant.now().minusSeconds(RANDOM.nextInt(86400)));
    }

    public static ExpenseEntity createExpense(Long id, UserEntity user, CategoryEntity category) {
        return expenseEntity()
                .id(id)
                .user(user)
                .category(category)
                .build();
    }

    public static ExpenseEntity createExpense(UserEntity user, CategoryEntity category) {
        return expenseEntity()
                .user(user)
                .category(category)
                .build();
    }

    // ========== TeamEntity ==========
    public static TeamEntity.TeamEntityBuilder teamEntity() {
        return TeamEntity.builder()
                .name("Test Team " + RANDOM.nextInt(1000));
    }

    public static TeamEntity createTeam(Long id, UserEntity owner) {
        return teamEntity()
                .id(id)
                .owner(owner)
                .build();
    }

    public static TeamEntity createTeam(UserEntity owner) {
        return teamEntity()
                .owner(owner)
                .build();
    }

    // ========== TeamMemberEntity ==========
    public static TeamMemberEntity createTeamMember(TeamEntity team, UserEntity user, TeamRole role) {
        return TeamMemberEntity.builder()
                .team(team)
                .user(user)
                .role(role)
                .build();
    }

    // ========== DTOs ==========
    public static CreateExpenseRequest createExpenseRequest(Long categoryId) {
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setCategoryId(categoryId);
        request.setAmount(BigDecimal.valueOf(50.0 + RANDOM.nextDouble() * 500));
        request.setDescription("Test expense description");
        request.setDate(LocalDate.now().minusDays(RANDOM.nextInt(30)));
        return request;
    }

    public static CreateExpenseRequest createExpenseRequest(Long categoryId, BigDecimal amount) {
        CreateExpenseRequest request = createExpenseRequest(categoryId);
        request.setAmount(amount);
        return request;
    }

    public static UpdateExpenseRequest updateExpenseRequest(Long categoryId) {
        UpdateExpenseRequest request = new UpdateExpenseRequest();
        request.setCategoryId(categoryId);
        request.setAmount(BigDecimal.valueOf(100.0 + RANDOM.nextDouble() * 500));
        request.setDescription("Updated expense description");
        request.setDate(LocalDate.now().minusDays(RANDOM.nextInt(30)));
        return request;
    }

    public static CreateTeamDto createTeamDto() {
        CreateTeamDto dto = new CreateTeamDto();
        dto.setName("Test Team " + RANDOM.nextInt(1000));
        return dto;
    }

    public static CreateTeamDto createTeamDto(String name) {
        CreateTeamDto dto = new CreateTeamDto();
        dto.setName(name);
        return dto;
    }

    public static CategoryDto categoryDto() {
        CategoryDto dto = new CategoryDto();
        dto.setName("Test Category " + RANDOM.nextInt(1000));
        return dto;
    }

    public static CategoryDto categoryDto(String name) {
        CategoryDto dto = new CategoryDto();
        dto.setName(name);
        return dto;
    }

    public static RegisterRequestDto registerRequestDto() {
        RegisterRequestDto dto = new RegisterRequestDto();
        dto.setEmail("test" + RANDOM.nextInt(10000) + "@example.com");
        dto.setUsername("testuser" + RANDOM.nextInt(10000));
        dto.setPassword("TestPassword123!");
        return dto;
    }

    public static RegisterRequestDto registerRequestDto(String email) {
        RegisterRequestDto dto = registerRequestDto();
        dto.setEmail(email);
        return dto;
    }

    public static AuthRequestDto authRequestDto(String email, String password) {
        AuthRequestDto dto = new AuthRequestDto();
        dto.setEmail(email);
        dto.setPassword(password);
        return dto;
    }

    public static AddMemberDto addMemberDto(Long userId, TeamRole role) {
        AddMemberDto dto = new AddMemberDto();
        dto.setUserId(userId);
        dto.setRole(role);
        return dto;
    }

    public static UpdateTeamNameDto updateTeamNameDto(String name) {
        UpdateTeamNameDto dto = new UpdateTeamNameDto();
        dto.setName(name);
        return dto;
    }
}

