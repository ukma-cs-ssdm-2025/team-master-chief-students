package com.example.expensetracker.security;

import com.example.expensetracker.response.ErrorResponse;
import com.example.expensetracker.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

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
            String email = jwtService.extractEmail(token, true);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                var userDetails = userService.loadUserByUsername(email);
                if (jwtService.isTokenValid(token, true)) {
                    var authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    throw new RuntimeException("JWT token invalid or expired");
                }
            }

            filterChain.doFilter(request, response);
        } catch (Exception ex) {
            ErrorResponse error = ErrorResponse.of(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            String json = String.format(
                    "{\"status\": %d, \"message\": \"%s\", \"timestamp\": \"%s\"}",
                    error.getStatus(),
                    error.getMessage(),
                    error.getTimestamp()
            );
            response.getWriter().write(json);
        }
    }
}
