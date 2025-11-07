package com.example.expensetracker.integration;

import com.example.expensetracker.dto.CreateExpenseRequest;
import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.repository.CategoryRepository;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.security.JwtService;
import com.example.expensetracker.testutil.AbstractPostgresContainerTest;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.math.BigDecimal;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@DisplayName("Expense Integration Tests")
class ExpenseIntegrationTest extends AbstractPostgresContainerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private JwtService jwtService;

    private UserEntity testUser;
    private CategoryEntity testCategory;
    private String accessToken;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.basePath = "/api/v1";

        testUser = TestDataFactory.createUser();
        testUser.setPassword("$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"); // "password"
        testUser = userRepository.save(testUser);

        testCategory = TestDataFactory.createCategory(testUser);
        testCategory = categoryRepository.save(testCategory);

        accessToken = jwtService.generateAccessToken(testUser);
    }

    @Test
    @DisplayName("Should create expense via REST API")
    void shouldCreateExpenseViaRestApi() {
        // Given
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setCategoryId(testCategory.getId());
        request.setAmount(BigDecimal.valueOf(100.50));
        request.setDescription("Integration test expense");
        request.setDate(java.time.LocalDate.now());

        // When/Then
        given()
                .header("Authorization", "Bearer " + accessToken)
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .post("/expenses")
        .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("data.amount", equalTo(100.50f))
                .body("data.description", equalTo("Integration test expense"));
    }

    @Test
    @DisplayName("Should return 400 when validation fails")
    void shouldReturn400WhenValidationFails() {
        // Given
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setCategoryId(null); // Invalid
        request.setAmount(BigDecimal.valueOf(100));

        // When/Then
        given()
                .header("Authorization", "Bearer " + accessToken)
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .post("/expenses")
        .then()
                .statusCode(400)
                .body("status", equalTo(400))
                .body("message", containsString("Category ID is required"));
    }

    @Test
    @DisplayName("Should return 401 when not authenticated")
    void shouldReturn401WhenNotAuthenticated() {
        // When/Then
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/expenses/1")
        .then()
                .statusCode(403);
    }

    @Test
    @DisplayName("Should get expenses with cursor pagination")
    void shouldGetExpensesWithCursorPagination() {
        // When/Then
        given()
                .header("Authorization", "Bearer " + accessToken)
        .when()
                .get("/expenses?limit=10")
        .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("data.items", notNullValue())
                .body("data.hasNext", notNullValue());
    }
}

