package com.example.expensetracker.security;

import com.example.expensetracker.response.ErrorResponse;
import com.example.expensetracker.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {


        try {
            String authHeader = request.getHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = authHeader.substring(7);

            // Fixed: Replaced generic RuntimeException with library-specific JwtException
            if (!jwtService.isTokenValid(token, true)) {
                throw new io.jsonwebtoken.JwtException("JWT token validation returned false");
            }

            String email = jwtService.extractEmail(token, true);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                var userDetails = userService.loadUserByUsername(email);
                var authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

            filterChain.doFilter(request, response);

        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
            log.debug("JWT token expired", ex);
            ErrorResponse error = ErrorResponse.of(HttpServletResponse.SC_UNAUTHORIZED,
                    "JWT token expired. Please login again or use refresh token to get a new access token.");
            writeErrorResponse(response, error);

        } catch (io.jsonwebtoken.JwtException ex) {
            // This block now catches the exception thrown explicitly above as well as library parsing errors
            log.debug("JWT token validation failed", ex);
            ErrorResponse error = ErrorResponse.of(HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or expired JWT token. Please login again or refresh your token.");
            writeErrorResponse(response, error);

        } catch (AuthenticationException ex) {
            // Fixed: Added specific catch for Spring Security user loading errors
            log.debug("User authentication failed during filter execution", ex);
            ErrorResponse error = ErrorResponse.of(HttpServletResponse.SC_UNAUTHORIZED,
                    "Authentication failed: User verification error.");
            writeErrorResponse(response, error);

        } catch (Exception ex) {
            log.error("Unexpected error in JWT authentication filter", ex);
            ErrorResponse error = ErrorResponse.of(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "An internal authentication error occurred.");
            writeErrorResponse(response, error);
        }
    }

    private void writeErrorResponse(HttpServletResponse response, ErrorResponse error) throws IOException {
        response.setStatus(error.getStatus());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), error);
    }
}