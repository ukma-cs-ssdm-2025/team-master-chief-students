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
        String[] data = {
                expense.getId().toString(),
                expense.getDate().toString(),
                escapeCsvField(expense.getCategory().getName()),
                expense.getAmount().toPlainString(),
                escapeCsvField(expense.getDescription())
        };
        return String.join(",", data) + "\n";
    }

    private String escapeCsvField(String field) {
        if (field == null) {
            return "";
        }
        String escapedField = field.replace("\"", "\"\"");
        if (escapedField.contains(",") || escapedField.contains("\"") || escapedField.contains("\n")) {
            return "\"" + escapedField + "\"";
        }
        return escapedField;
    }
}
