package com.example.expensetracker.service;

import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.exporters.CsvExporter;
import com.example.expensetracker.exporters.PdfExporter;
import com.example.expensetracker.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.io.Writer;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService extends BaseService {

    private final ExpenseRepository expenseRepository;
    private final CsvExporter csvExporter;
    private final PdfExporter pdfExporter;

    public void exportUserExpensesToCsv(Writer writer) {
        UserEntity user = getAuthenticatedUser();
        List<ExpenseEntity> expenses = expenseRepository.findByUserId(user.getId());
        csvExporter.exportExpenses(writer, expenses);
    }

    public void exportUserExpensesToPdf(OutputStream outputStream) {
        UserEntity user = getAuthenticatedUser();
        List<ExpenseEntity> expenses = expenseRepository.findByUserId(user.getId());
        pdfExporter.exportExpenses(outputStream, expenses);
    }
}
