package com.example.expensetracker.service;

import com.example.expensetracker.dto.ExpenseDto;
import com.example.expensetracker.entity.ReceiptEntity;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseService {
    ExpenseDto create(ExpenseDto dto);
    ExpenseDto getById(Long id);
    List<ExpenseDto> getAll();
    ExpenseDto update(Long id, ExpenseDto dto);
    void delete(Long id);

    List<ExpenseDto> filter(String category, LocalDate from, LocalDate to, BigDecimal min, BigDecimal max);
    Object getStatistics();

    ReceiptEntity addReceipt(Long expenseId, MultipartFile file);
    void deleteReceipt(Long expenseId);
    ReceiptEntity getReceipt(Long expenseId);
}