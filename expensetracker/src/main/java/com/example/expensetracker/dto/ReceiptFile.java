package com.example.expensetracker.dto;

import org.springframework.core.io.Resource;

public record ReceiptFile(
        Resource resource,
        String contentType
) {}