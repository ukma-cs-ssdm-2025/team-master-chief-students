package com.example.expensetracker.mapper;

import com.example.expensetracker.dto.ReceiptDto;
import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.ReceiptEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("ReceiptMapper Tests")
public class ReceiptMapperTest {

    private final ReceiptMapper mapper = new ReceiptMapper();

    @Test
    @DisplayName("Should map ReceiptEntity to ReceiptDto correctly")
    void shouldMapReceiptEntityToDto() {
        UserEntity user = TestDataFactory.createUser(1L);
        CategoryEntity category = TestDataFactory.createCategory(1L, user);
        ExpenseEntity expense = TestDataFactory.createExpense(1L, user, category);

        ReceiptEntity receipt = TestDataFactory.createReceipt(expense);

        // When
        ReceiptDto dto = mapper.toDto(receipt);

        // Then
        assert dto.getFileUrl().equals(receipt.getFileUrl());
        assert dto.getExpenseId().equals(expense.getId());
    }
}
