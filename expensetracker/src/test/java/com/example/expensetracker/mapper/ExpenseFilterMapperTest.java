package com.example.expensetracker.mapper;

import com.example.expensetracker.dto.ExpenseFilterItemDto;
import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("ExpenseFilterMapper Tests")
public class ExpenseFilterMapperTest {

    private final ExpenseFilterMapper mapper = new ExpenseFilterMapper();

    @Test
    @DisplayName("Should have map ExpenseEntity to ExpenseFilterItemDto correctly")
    void shouldMapExpenseEntityToFilterItemDto() {
        UserEntity user = TestDataFactory.createUser(1L);
        CategoryEntity category = TestDataFactory.createCategory(1L, user);
        ExpenseEntity expense = TestDataFactory.createExpense(1L, user, category);

        // When
        ExpenseFilterItemDto dto = mapper.toFilterItemDto(expense);

        // Then
        assert dto.getId().equals(expense.getId());
        assert dto.getAmount().equals(expense.getAmount());
        assert dto.getDate().equals(expense.getDate());
        assert dto.getCategoryName().equals(category.getName());
        assert dto.getDescription().equals(expense.getDescription());
        assert dto.getCategoryId().equals(category.getId());
        assert dto.getHasReceipt().equals(expense.getReceipt() != null);
    }
}
