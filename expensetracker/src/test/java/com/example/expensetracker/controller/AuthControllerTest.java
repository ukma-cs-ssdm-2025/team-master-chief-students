//package com.example.expensetracker.controller;
//
//import com.example.expensetracker.config.SecurityConfig;
//import com.example.expensetracker.controller.v1.AuthController;
//import com.example.expensetracker.dto.AuthRequestDto;
//import com.example.expensetracker.dto.AuthResponseDto;
//import com.example.expensetracker.dto.LogoutRequestDto;
//import com.example.expensetracker.dto.RegisterRequestDto;
//import com.example.expensetracker.security.JwtService;
//import com.example.expensetracker.service.AuthService;
//import com.example.expensetracker.service.UserService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.context.annotation.Import;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import static org.mockito.Mockito.doNothing;
//import static org.mockito.Mockito.when;
//import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.anonymous;
//import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(AuthController.class)
//@Import(SecurityConfig.class)
//class AuthControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private AuthService authService;
//
//    @MockBean
//    private JwtService jwtService;
//
//    @MockBean
//    private UserService userService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Test
//    void register_ShouldReturnTokens() throws Exception {
//        RegisterRequestDto request = new RegisterRequestDto("John", "john@example.com", "password123");
//        AuthResponseDto response = new AuthResponseDto("access-token", "refresh-token");
//
//        when(authService.register(request)).thenReturn(response);
//
//        mockMvc.perform(post("/api/v1/auth/register")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.accessToken").value("access-token"))
//                .andExpect(jsonPath("$.data.refreshToken").value("refresh-token"));
//    }
//
//    @Test
//    void login_ShouldReturnTokens() throws Exception {
//        AuthRequestDto request = new AuthRequestDto("john@example.com", "password123");
//        AuthResponseDto response = new AuthResponseDto("access-token", "refresh-token");
//
//        when(authService.login(request)).thenReturn(response);
//
//        mockMvc.perform(post("/api/v1/auth/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.accessToken").value("access-token"))
//                .andExpect(jsonPath("$.data.refreshToken").value("refresh-token"));
//    }
//
//    @Test
//    void logout_whenCalledWithValidToken_shouldReturnSuccessResponse() throws Exception {
//        LogoutRequestDto requestDto = new LogoutRequestDto();
//        requestDto.setRefreshToken("valid-token");
//
//        doNothing().when(authService).logout("valid-token");
//
//        mockMvc.perform(post("/api/v1/auth/logout")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestDto))
//                        .with(csrf())
//                        .with(anonymous()))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.message").value("Logout successful"));
//    }
//}
