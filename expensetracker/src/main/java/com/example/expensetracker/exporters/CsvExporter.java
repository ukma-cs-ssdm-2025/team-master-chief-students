package com.example.expensetracker.exporters;

import com.example.expensetracker.entity.ExpenseEntity;

import java.io.IOException;
import java.io.Writer;
import java.util.List;

public class CsvExporter {

    private static final String CSV_EXPENSES_HEADER = "ID,Date,Category,Amount,Description\n";

    public void exportExpenses(Writer writer, List<ExpenseEntity> expenses) {
        try {
            writer.write(CSV_EXPENSES_HEADER);
            for (ExpenseEntity expense : expenses) {
                writer.write(formatExpenseAsCsvLine(expense));
            }
        } catch (IOException e) {
            throw new RuntimeException("Error writing CSV data", e);
        }
    }

    private String formatExpenseAsCsvLine(ExpenseEntity expense) {
        return String.format("%d,%s,%s,%s,%s\n",
                expense.getId(),
                expense.getDate().toString(),
                expense.getCategory().getName(),
                expense.getAmount().toPlainString(),
                expense.getDescription()
        );
    }
}
