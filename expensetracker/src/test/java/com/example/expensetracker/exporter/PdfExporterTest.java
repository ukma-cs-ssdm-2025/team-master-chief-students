package com.example.expensetracker.exporter;

import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.exporters.PdfExporter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.canvas.parser.PdfTextExtractor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PdfExporterTest {

    private PdfExporter pdfExporter;

    @BeforeEach
    void setUp() {
        pdfExporter = new PdfExporter();
    }

    private String extractTextFromPdf(byte[] pdfBytes) throws IOException {
        try (
                ByteArrayInputStream bais = new ByteArrayInputStream(pdfBytes);
                PdfReader reader = new PdfReader(bais);
                PdfDocument pdfDoc = new PdfDocument(reader)
        ) {
            return PdfTextExtractor.getTextFromPage(pdfDoc.getFirstPage());
        }
    }

    @Test
    void testExportExpenses_HappyPath() throws IOException {
        CategoryEntity category = mock(CategoryEntity.class);
        when(category.getName()).thenReturn("Food");

        ExpenseEntity expense1 = mock(ExpenseEntity.class);
        when(expense1.getId()).thenReturn(1L);
        when(expense1.getDate()).thenReturn(LocalDate.of(2025, 10, 28));
        when(expense1.getCategory()).thenReturn(category);
        when(expense1.getAmount()).thenReturn(new BigDecimal("150.75"));
        when(expense1.getDescription()).thenReturn("Weekly groceries");

        List<ExpenseEntity> expenses = List.of(expense1);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        pdfExporter.exportExpenses(baos, expenses);

        String pdfText = extractTextFromPdf(baos.toByteArray());

        assertThat(baos.size()).isGreaterThan(0);
        assertThat(pdfText).contains("Expenses Report");
        assertThat(pdfText).contains("ID");
        assertThat(pdfText).contains("Date");
        assertThat(pdfText).contains("Category");
        assertThat(pdfText).contains("Amount");
        assertThat(pdfText).contains("Description");
        assertThat(pdfText).contains("1");
        assertThat(pdfText).contains("2025-10-28");
        assertThat(pdfText).contains("Food");
        assertThat(pdfText).contains("150.75");
        assertThat(pdfText).contains("Weekly groceries");
    }

    @Test
    void testExportExpenses_EmptyList() throws IOException {
        List<ExpenseEntity> expenses = Collections.emptyList();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        pdfExporter.exportExpenses(baos, expenses);

        String pdfText = extractTextFromPdf(baos.toByteArray());

        assertThat(baos.size()).isGreaterThan(0);
        assertThat(pdfText).contains("Expenses Report");
        assertThat(pdfText).contains("ID");
        assertThat(pdfText).contains("Category");
        assertThat(pdfText).contains("Amount");
    }

    @Test
    void testExportExpenses_HandlesNullValues() {
        ExpenseEntity allNullExpense = mock(ExpenseEntity.class);
        when(allNullExpense.getId()).thenReturn(null);
        when(allNullExpense.getDate()).thenReturn(null);
        when(allNullExpense.getCategory()).thenReturn(null);
        when(allNullExpense.getAmount()).thenReturn(null);
        when(allNullExpense.getDescription()).thenReturn(null);

        CategoryEntity nullNameCategory = mock(CategoryEntity.class);
        when(nullNameCategory.getName()).thenReturn(null);

        ExpenseEntity nullCategoryNameExpense = mock(ExpenseEntity.class);
        when(nullCategoryNameExpense.getCategory()).thenReturn(nullNameCategory);
        when(nullCategoryNameExpense.getAmount()).thenReturn(new BigDecimal("10")); // для ідентифікації

        List<ExpenseEntity> expenses = List.of(allNullExpense, nullCategoryNameExpense);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        assertDoesNotThrow(() -> pdfExporter.exportExpenses(baos, expenses));

        assertDoesNotThrow(() -> {
            String pdfText = extractTextFromPdf(baos.toByteArray());
            assertThat(pdfText).contains("Expenses Report");
            assertThat(pdfText).contains("10"); // Від другої сутності
        });
    }
}