package com.example.expensetracker.service.impl;

import com.example.expensetracker.dto.ExpenseDto;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.exception.AppException;
import com.example.expensetracker.exception.NotFoundException;
import com.example.expensetracker.exception.UnauthorizedException;
import com.example.expensetracker.mapper.ExpenseMapper;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.security.SecurityUser;
import com.example.expensetracker.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper mapper;

    private UserEntity getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            // Это исключение должно перехватываться вашим SecurityConfig
            throw new UnauthorizedException("User not authenticated");
        }
        SecurityUser userDetails = (SecurityUser) auth.getPrincipal();
        return userDetails.getUser();
    }

    @Override
    public ExpenseDto create(ExpenseDto dto) {
        ExpenseEntity entity = mapper.toEntity(dto);

        entity.setUser(getAuthenticatedUser());
        return mapper.toDto(expenseRepository.save(entity));
    }

    @Override
    public ExpenseDto getById(Long id) {
        Long userId = getAuthenticatedUser().getId();

        ExpenseEntity entity = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Expense not found"));
        return mapper.toDto(entity);
    }

    @Override
    public List<ExpenseDto> getAll() {
        Long userId = getAuthenticatedUser().getId();

        return expenseRepository.findByUserId(userId)
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ExpenseDto update(Long id, ExpenseDto dto) {
        Long userId = getAuthenticatedUser().getId();
        ExpenseEntity entity = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Expense not found"));

        entity.setCategory(dto.getCategory());
        entity.setDescription(dto.getDescription());
        entity.setAmount(dto.getAmount());
        entity.setDate(dto.getDate());

        return mapper.toDto(expenseRepository.save(entity));
    }

    @Override
    public void delete(Long id) {
        Long userId = getAuthenticatedUser().getId();

        if (!expenseRepository.existsByIdAndUserId(id, userId)) {
            throw new NotFoundException("Expense not found");
        }
        expenseRepository.deleteById(id);
    }

    @Override
    public List<ExpenseDto> filter(String category, LocalDate from, LocalDate to, BigDecimal min, BigDecimal max) {
        Long userId = getAuthenticatedUser().getId();

        List<ExpenseEntity> userExpenses = expenseRepository.findByUserId(userId);

        return userExpenses.stream()
                .filter(e -> category == null || e.getCategory().equalsIgnoreCase(category))
                .filter(e -> from == null || !e.getDate().isBefore(from))
                .filter(e -> to == null || !e.getDate().isAfter(to))
                .filter(e -> min == null || e.getAmount().compareTo(min) >= 0)
                .filter(e -> max == null || e.getAmount().compareTo(max) <= 0)
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Object getStatistics() {
        Long userId = getAuthenticatedUser().getId();

        BigDecimal total = expenseRepository.sumAmountByUserId(userId);
        long countAmount = expenseRepository.countByUserId(userId);

        return new Object() {
            public final BigDecimal totalAmount = total;
            public final long count = countAmount;
        };
    }
}