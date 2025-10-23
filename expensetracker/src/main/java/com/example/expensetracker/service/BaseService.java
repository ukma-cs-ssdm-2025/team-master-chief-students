package com.example.expensetracker.service;

import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.exception.UnauthorizedException;
import com.example.expensetracker.security.SecurityUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class BaseService {
    /**
     * Retrieves the currently authenticated user from the SecurityContext.
     *
     * @return The authenticated UserEntity.
     * @throws UnauthorizedException if no user is authenticated.
     */
    protected UserEntity getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            throw new UnauthorizedException("User not authenticated. Access is denied.");
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof SecurityUser) {
            return ((SecurityUser) principal).getUser();
        }

        throw new IllegalStateException("The principal is not an instance of SecurityUser. Unexpected authentication object.");
    }
}
