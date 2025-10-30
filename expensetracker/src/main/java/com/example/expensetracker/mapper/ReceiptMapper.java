package com.example.expensetracker.mapper;

import com.example.expensetracker.dto.ReceiptDto;
import org.springframework.stereotype.Component;

@Component
public class ReceiptMapper {
    public ReceiptDto toDto(com.example.expensetracker.entity.ReceiptEntity e) {
        return ReceiptDto.builder()
                .fileUrl(e.getFileUrl())
                .expenseId(e.getExpense().getId())
                .build();
    }
}
