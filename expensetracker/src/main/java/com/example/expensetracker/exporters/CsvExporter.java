package com.example.expensetracker.exporters;

import com.example.expensetracker.entity.ExpenseEntity;

import java.io.IOException;
import java.io.Writer;
import java.util.List;

public class CsvExporter {

    public void exportExpenses(Writer writer, List<ExpenseEntity> expenses) {
        try {
            writer.write("ID,Date,Category,Amount,Description\n");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
