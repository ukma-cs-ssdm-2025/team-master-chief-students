package com.example.expensetracker.service.impl;

import com.example.expensetracker.dto.ExpenseDto;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.ReceiptEntity;
import com.example.expensetracker.exception.NotFoundException;
import com.example.expensetracker.mapper.ExpenseMapper;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.repository.ReceiptRepository;
import com.example.expensetracker.security.SecurityUser;
import com.example.expensetracker.service.ExpenseService;
import com.example.expensetracker.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper mapper;
    private final FileStorageService fileStorageService;
    private final ReceiptRepository receiptRepository;

    @Override
    public ExpenseDto create(ExpenseDto dto) {
        ExpenseEntity entity = mapper.toEntity(dto);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        SecurityUser userDetails = (SecurityUser) auth.getPrincipal();
        entity.setUser(userDetails.getUser());
        return mapper.toDto(expenseRepository.save(entity));
    }

    @Override
    public ExpenseDto getById(Long id) {
        ExpenseEntity entity = expenseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Expense not found"));
        return mapper.toDto(entity);
    }

    @Override
    public List<ExpenseDto> getAll() {
        return expenseRepository.findAll()
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ExpenseDto update(Long id, ExpenseDto dto) {
        ExpenseEntity entity = expenseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Expense not found"));
        entity.setCategory(dto.getCategory());
        entity.setDescription(dto.getDescription());
        entity.setAmount(dto.getAmount());
        entity.setDate(dto.getDate());
        return mapper.toDto(expenseRepository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new NotFoundException("Expense not found");
        }
        expenseRepository.deleteById(id);
    }

    @Override
    public List<ExpenseDto> filter(String category, LocalDate from, LocalDate to, BigDecimal min, BigDecimal max) {
        return expenseRepository.findAll().stream()
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
        BigDecimal total = expenseRepository.findAll().stream()
                .map(ExpenseEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new Object() {
            public final BigDecimal totalAmount = total;
            public final long count = expenseRepository.count();
        };
    }

    @Override
    @Transactional
    public ReceiptEntity addReceipt(Long expenseId, MultipartFile file) {
        ExpenseEntity expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new NotFoundException("Expense not found with id: " + expenseId));

        String storedFileName = fileStorageService.store(file);

        ReceiptEntity newReceipt = ReceiptEntity.builder()
                .fileUrl(storedFileName)
                .expense(expense)
                .build();

        expense.setReceipt(newReceipt);
        expenseRepository.save(expense);

        return newReceipt;
    }

    @Override
    @Transactional
    public void deleteReceipt(Long expenseId) {
        ExpenseEntity expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new NotFoundException("Expense not found with id: " + expenseId));

        ReceiptEntity receipt = expense.getReceipt();
        if (receipt == null) {
            throw new NotFoundException("Receipt not found for expense with id: " + expenseId);
        }

        String filenameToDelete = receipt.getFileUrl();
        expense.setReceipt(null);

        receiptRepository.delete(receipt);
        expenseRepository.save(expense);
        fileStorageService.delete(filenameToDelete);
    }

    @Override
    public ReceiptEntity getReceipt(Long expenseId) {
        ExpenseEntity expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new NotFoundException("Expense not found with id: " + expenseId));

        ReceiptEntity receipt = expense.getReceipt();
        if (receipt == null) {
            throw new NotFoundException("Receipt not found for expense with id: " + expenseId);
        }

        return receipt;
    }
}