package com.example.expensetracker.service;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.entity.ReceiptEntity;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseService {
    ExpenseResponse create(CreateExpenseRequest request);
    ExpenseResponse getById(Long id);
    List<ExpenseResponse> getAll();
    CursorPageResponse<ExpenseResponse> getAllPaginated(String cursor, int limit);
    ExpenseResponse update(Long id, UpdateExpenseRequest request);
    void delete(Long id);

    ReceiptDto addReceipt(Long expenseId, MultipartFile file);
    void deleteReceipt(Long expenseId);
    ReceiptDto getReceipt(Long expenseId);
    ReceiptFile loadReceiptFile(Long expenseId);
}