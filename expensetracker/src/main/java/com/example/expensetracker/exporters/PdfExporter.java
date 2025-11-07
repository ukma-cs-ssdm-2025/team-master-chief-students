package com.example.expensetracker.exporters;

import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.exception.ExportException;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

@Component
public class PdfExporter {
    public void exportExpenses(OutputStream outputStream, List<ExpenseEntity> expenses) {
        try (
                PdfWriter writer = new PdfWriter(outputStream);
                PdfDocument pdf = new PdfDocument(writer);
                Document document = new Document(pdf)
        ) {

            document.add(new Paragraph("Expenses Report")
                    .setFontSize(18)
                    .setBold()
                    .setMarginBottom(10));

            float[] columnWidths = {1, 3, 3, 3, 5};
            Table table = new Table(UnitValue.createPercentArray(columnWidths));
            table.setWidth(UnitValue.createPercentValue(100));

            PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            table.addHeaderCell(createHeaderCell("ID", boldFont));
            table.addHeaderCell(createHeaderCell("Date", boldFont));
            table.addHeaderCell(createHeaderCell("Category", boldFont));
            table.addHeaderCell(createHeaderCell("Amount", boldFont));
            table.addHeaderCell(createHeaderCell("Description", boldFont));

            for (ExpenseEntity expense : expenses) {
                table.addCell(createCell(expense.getId() != null ? expense.getId().toString() : ""));
                table.addCell(createCell(expense.getDate() != null ? expense.getDate().toString() : ""));

                String categoryName = (expense.getCategory() != null && expense.getCategory().getName() != null)
                        ? expense.getCategory().getName()
                        : "";
                table.addCell(createCell(categoryName));

                table.addCell(createCell(expense.getAmount() != null ? expense.getAmount().toPlainString() : ""));

                String description = expense.getDescription() != null ? expense.getDescription() : "";
                table.addCell(createCell(description));
            }

            document.add(table);

        } catch (IOException e) {
            throw new ExportException("Error writing PDF data", e);
        }
    }

    private Cell createHeaderCell(String text, PdfFont font) {
        return new Cell().add(new Paragraph(text).setFont(font));
    }

    private Cell createCell(String text) {
        return new Cell().add(new Paragraph(text));
    }
}