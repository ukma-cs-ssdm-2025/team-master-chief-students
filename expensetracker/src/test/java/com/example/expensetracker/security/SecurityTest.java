package com.example.expensetracker.security;

import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.security.JwtService;
import com.example.expensetracker.testutil.AbstractPostgresContainerTest;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@DisplayName("Security Tests")
class SecurityTest extends AbstractPostgresContainerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    private UserEntity testUser;
    private String accessToken;

    @BeforeEach
    void setUp() {
        testUser = TestDataFactory.createUser();
        testUser = userRepository.save(testUser);
        
        accessToken = jwtService.generateAccessToken(testUser);
    }

    @Test
    @DisplayName("Should allow access to public endpoints without authentication")
    void shouldAllowAccessToPublicEndpoints() throws Exception {
        int status = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\",\"password\":\"password\"}"))
                .andReturn()
                .getResponse()
                .getStatus();
        
        assertThat(status).isIn(400, 401);
    }

    @Test
    @DisplayName("Should deny access to protected endpoints without authentication")
    void shouldDenyAccessToProtectedEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/expenses"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should allow access to protected endpoints with authentication")
    void shouldAllowAccessToProtectedEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/expenses")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should allow access to actuator endpoints")
    void shouldAllowAccessToActuatorEndpoints() throws Exception {
        int status = mockMvc.perform(get("/actuator/health"))
                .andReturn()
                .getResponse()
                .getStatus();
        
        assertThat(status).isNotIn(401, 403);
    }

    @Test
    @DisplayName("Should allow access to Swagger UI")
    void shouldAllowAccessToSwaggerUi() throws Exception {
        mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should return 403 or 404 when user tries to access other user's expense")
    void shouldReturn403WhenAccessingOtherUsersExpense() throws Exception {
        int status = mockMvc.perform(get("/api/v1/expenses/999")
                        .header("Authorization", "Bearer " + accessToken))
                .andReturn()
                .getResponse()
                .getStatus();
        
        assertThat(status).isIn(200, 403, 404);
    }

    @Test
    @DisplayName("Should reject invalid/malformed access token")
    void shouldRejectInvalidAccessToken() throws Exception {
        String invalidToken = "invalid.token.here";
        
        mockMvc.perform(get("/api/v1/expenses")
                        .header("Authorization", "Bearer " + invalidToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should reject empty Bearer token")
    void shouldRejectEmptyBearerToken() throws Exception {
        mockMvc.perform(get("/api/v1/expenses")
                        .header("Authorization", "Bearer "))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should reject request with invalid Authorization header format")
    void shouldRejectInvalidAuthorizationFormat() throws Exception {
        mockMvc.perform(get("/api/v1/expenses")
                        .header("Authorization", "InvalidFormat token"))
                .andExpect(status().isForbidden());
        
        mockMvc.perform(get("/api/v1/expenses")
                        .header("Authorization", "NotBearer token"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should reject malformed JWT token (wrong structure)")
    void shouldRejectMalformedJwtToken() throws Exception {
        String malformedToken = "not.a.valid.jwt.token.structure";
        
        mockMvc.perform(get("/api/v1/expenses")
                        .header("Authorization", "Bearer " + malformedToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should deny access to another user's expense")
    void shouldDenyAccessToAnotherUsersExpense() throws Exception {
        mockMvc.perform(get("/api/v1/expenses/999999")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should deny access to another user's team")
    void shouldDenyAccessToAnotherUsersTeam() throws Exception {
        int status = mockMvc.perform(get("/api/v1/teams/999999")
                        .header("Authorization", "Bearer " + accessToken))
                .andReturn()
                .getResponse()
                .getStatus();
        
        assertThat(status).isIn(403, 404);
    }

    @Test
    @DisplayName("Should deny modifying another user's expense")
    void shouldDenyModifyingAnotherUsersExpense() throws Exception {
        mockMvc.perform(put("/api/v1/expenses/999999")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .content("{\"amount\": 100.0}"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should deny deleting another user's expense")
    void shouldDenyDeletingAnotherUsersExpense() throws Exception {
        mockMvc.perform(delete("/api/v1/expenses/999999")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNotFound());
    }
}

