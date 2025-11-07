package com.example.expensetracker.service.impl;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.dto.ReceiptDto;
import com.example.expensetracker.dto.ReceiptFile;
import com.example.expensetracker.dto.CreateExpenseDto;
import com.example.expensetracker.dto.ExpenseDto;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.ReceiptEntity;
import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.exception.CategoryNotFoundException;
import com.example.expensetracker.exception.ConflictException;
import com.example.expensetracker.exception.FileStorageException;
import com.example.expensetracker.exception.NotFoundException;
import com.example.expensetracker.exception.ValidationException;
import com.example.expensetracker.mapper.ExpenseMapper;
import com.example.expensetracker.mapper.ReceiptMapper;
import com.example.expensetracker.repository.CategoryRepository;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.repository.ReceiptRepository;
import com.example.expensetracker.config.AppProperties;
import com.example.expensetracker.service.ExpenseService;
import com.example.expensetracker.service.FileStorageService;
import com.example.expensetracker.util.CursorUtil;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.example.expensetracker.service.BaseService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl extends BaseService implements ExpenseService {

    private static final Logger logger = LogManager.getLogger(ExpenseServiceImpl.class);

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final ExpenseMapper mapper;
    private final FileStorageService fileStorageService;
    private final AppProperties appProperties;
    private final ReceiptRepository receiptRepository;
    private final ReceiptMapper receiptMapper;

    @Override
    @Transactional
    public ExpenseDto create(CreateExpenseDto request) {
        UserEntity currentUser = getAuthenticatedUser();
        
        if (request.getCategoryId() == null) {
            throw new ValidationException("Category ID is required");
        }
        
        CategoryEntity category = categoryRepository.findByIdAndUserId(request.getCategoryId(), currentUser.getId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + request.getCategoryId()));

        if (request.getAmount() == null) {
            throw new ValidationException("Amount is required");
        }
        if (request.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Amount must be greater than 0");
        }
        
        if (request.getDate() != null && request.getDate().isAfter(java.time.LocalDate.now())) {
            throw new ValidationException("Expense date cannot be in the future");
        }

        ExpenseEntity entity = ExpenseEntity.builder()
                .description(request.getDescription())
                .amount(request.getAmount())
                .date(request.getDate() != null ? request.getDate() : java.time.LocalDate.now())
                .build();
        entity.setUser(currentUser);
        entity.setCategory(category);

        return mapper.toDto(expenseRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseDto getById(Long id) {
        if (id == null || id <= 0) {
            throw new ValidationException("Invalid expense ID");
        }
        
        Long userId = getAuthenticatedUser().getId();

        ExpenseEntity entity = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Expense not found"));
        return mapper.toDto(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseDto> getAll() {
        Long userId = getAuthenticatedUser().getId();
        return expenseRepository.findByUserId(userId).stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CursorPageResponse<ExpenseDto> getAllPaginated(String cursor, int limit) {
        Long userId = getAuthenticatedUser().getId();
        logger.debug("Listing expenses for user {} with cursor: {}", userId, cursor);

        int pageSize = Math.min(Math.max(limit, appProperties.getPaginationMinLimit()), appProperties.getPaginationMaxLimit());

        List<ExpenseEntity> expenses;
        
        if (cursor != null && !cursor.isBlank()) {
            try {
                var cursorInfoOpt = CursorUtil.decodeCursor(cursor);
                if (cursorInfoOpt.isPresent()) {
                    var cursorInfo = cursorInfoOpt.get();
                    Instant cursorCreatedAt = cursorInfo.getCreatedAt();
                    Long cursorId = cursorInfo.getId();
                    
                    expenses = expenseRepository.findByUserIdWithCursor(
                            userId,
                            cursorCreatedAt,
                            cursorId,
                            PageRequest.of(0, pageSize + 1)
                    );
                } else {
                    expenses = expenseRepository.findByUserIdOrdered(
                            userId,
                            PageRequest.of(0, pageSize + 1)
                    );
                }
            } catch (ValidationException e) {
                throw new ValidationException("Invalid cursor: " + e.getMessage());
            }
        } else {
            expenses = expenseRepository.findByUserIdOrdered(
                    userId,
                    PageRequest.of(0, pageSize + 1)
            );
        }

        boolean hasNext = expenses.size() > pageSize;
        if (hasNext) {
            expenses = expenses.subList(0, pageSize);
        }

        List<ExpenseDto> expenseResponses = expenses.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());

        String nextCursor = null;
        if (hasNext && !expenses.isEmpty()) {
            ExpenseEntity lastExpense = expenses.get(expenses.size() - 1);
            nextCursor = CursorUtil.encodeCursor(lastExpense.getCreatedAt(), lastExpense.getId());
        }

        return CursorPageResponse.of(expenseResponses, nextCursor, hasNext);
    }

    @Override
    @Transactional
    public ExpenseDto update(Long id, ExpenseDto request) {
        UserEntity currentUser = getAuthenticatedUser();
        
        if (id == null || id <= 0) {
            throw new ValidationException("Invalid expense ID");
        }
        
        ExpenseEntity entity = expenseRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new NotFoundException("Expense not found"));

        if (request.getCategoryId() == null) {
            throw new ValidationException("Category ID is required");
        }
        
        CategoryEntity category = categoryRepository.findByIdAndUserId(request.getCategoryId(), currentUser.getId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + request.getCategoryId()));

        if (request.getAmount() != null) {
            if (request.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                throw new ValidationException("Amount must be greater than 0");
            }
        }
        
        if (request.getDate() != null && request.getDate().isAfter(java.time.LocalDate.now())) {
            throw new ValidationException("Expense date cannot be in the future");
        }

        entity.setCategory(category);
        if (request.getDescription() != null) {
            entity.setDescription(request.getDescription());
        }
        if (request.getAmount() != null) {
            entity.setAmount(request.getAmount());
        }
        if (request.getDate() != null) {
            entity.setDate(request.getDate());
        }

        return mapper.toDto(expenseRepository.save(entity));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (id == null || id <= 0) {
            throw new ValidationException("Invalid expense ID");
        }
        
        Long userId = getAuthenticatedUser().getId();

        if (!expenseRepository.existsByIdAndUserId(id, userId)) {
            throw new NotFoundException("Expense not found");
        }
        expenseRepository.deleteById(id);
    }

    @Override
    @Transactional
    public ReceiptDto addReceipt(Long expenseId, MultipartFile file) {
        if (expenseId == null || expenseId <= 0) {
            throw new ValidationException("Invalid expense ID");
        }
        
        if (file == null) {
            throw new ValidationException("File is required");
        }
        
        Long userId = getAuthenticatedUser().getId();
        ExpenseEntity expense = expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new NotFoundException("Expense not found with id: " + expenseId));
            
        if (expense.getReceipt() != null) {
            throw new ConflictException("Expense already has a receipt. Delete existing receipt first.");
        }

        String storedFileName = fileStorageService.store(file);

        ReceiptEntity newReceipt = ReceiptEntity.builder()
                .fileUrl(storedFileName)
                .expense(expense)
                .build();

        expense.setReceipt(newReceipt);
        expenseRepository.save(expense);

        return receiptMapper.toDto(newReceipt);
    }

    @Override
    @Transactional
    public void deleteReceipt(Long expenseId) {
        Long userId = getAuthenticatedUser().getId();
        ExpenseEntity expense = expenseRepository.findByIdAndUserId(expenseId, userId)
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
    @Transactional(readOnly = true)
    public ReceiptDto getReceipt(Long expenseId) {
        Long userId = getAuthenticatedUser().getId();
        ExpenseEntity expense = expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new NotFoundException("Expense not found with id: " + expenseId));

        ReceiptEntity receipt = expense.getReceipt();
        if (receipt == null) {
            throw new NotFoundException("Receipt not found for expense with id: " + expenseId);
        }

        return receiptMapper.toDto(receipt);
    }

    @Override
    @Transactional(readOnly = true)
    public ReceiptFile loadReceiptFile(Long expenseId) {
        ReceiptDto receipt = getReceipt(expenseId);
        String filename = receipt.getFileUrl();
        if (filename == null || filename.isBlank()) {
            throw new NotFoundException("Receipt file not found for expense: " + expenseId);
        }

        Resource resource = fileStorageService.loadAsResource(filename);

        String contentType;
        try {
            Path filePath = fileStorageService.load(filename);
            contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
        } catch (IOException e) {
            throw new FileStorageException("Could not determine file type.", e);
        }

        return new ReceiptFile(resource, contentType);
    }
}