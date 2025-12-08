package com.example.expensetracker.exporter;

import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.exporters.CsvExporter;
import org.junit.jupiter.api.Test;

import java.io.StringWriter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CsvExporterTest {

    @Test
    void export_WithEmptyList_ShouldReturnOnlyHeader() {
        CsvExporter exporter = new CsvExporter();
        StringWriter writer = new StringWriter();

        exporter.exportExpenses(writer, Collections.emptyList());

        String expectedCsv = "ID,Date,Category,Amount,Description\n";
        assertEquals(expectedCsv, writer.toString());
    }

    @Test
    void export_WithOneExpense_ShouldReturnHeaderAndDataRow() {
        CsvExporter exporter = new CsvExporter();
        StringWriter writer = new StringWriter();

        CategoryEntity category = new CategoryEntity();
        category.setName("Food");

        ExpenseEntity expense = ExpenseEntity.builder()
                .id(1L)
                .date(LocalDate.of(2025, 10, 23))
                .category(category)
                .amount(new BigDecimal("12.99"))
                .description("Lunch")
                .build();

        exporter.exportExpenses(writer, List.of(expense));

        String expectedCsv = """
                ID,Date,Category,Amount,Description
                1,2025-10-23,Food,12.99,Lunch
                """;
        assertEquals(expectedCsv, writer.toString());
    }

    @Test
    void export_WithCommaInDescription_ShouldQuoteField() {
        CsvExporter exporter = new CsvExporter();
        StringWriter writer = new StringWriter();

        CategoryEntity category = new CategoryEntity();
        category.setName("Groceries");

        ExpenseEntity expense = ExpenseEntity.builder()
                .id(2L)
                .date(LocalDate.of(2025, 10, 24))
                .category(category)
                .amount(new BigDecimal("50.00"))
                .description("Milk, eggs, bread")
                .build();

        exporter.exportExpenses(writer, List.of(expense));

        String expectedCsv = """
                ID,Date,Category,Amount,Description
                2,2025-10-24,Groceries,50.00,"Milk, eggs, bread"
                """;
        assertEquals(expectedCsv, writer.toString());
    }
}
