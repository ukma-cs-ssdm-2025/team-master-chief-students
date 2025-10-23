package com.example.expensetracker.exporters;

import com.example.expensetracker.entity.ExpenseEntity;

import java.io.IOException;
import java.io.Writer;
import java.util.List;

public class CsvExporter {

    private static final String CSV_EXPENSES_HEADER = "ID,Date,Category,Amount,Description\n";

    public void export(Writer writer, List<ExpenseEntity> expenses) {
        try {
            writer.write(CSV_EXPENSES_HEADER);
        } catch (IOException e) {
            throw new RuntimeException("Error writing CSV header", e);
        }
    }
}
