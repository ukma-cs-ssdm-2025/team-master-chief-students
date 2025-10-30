package com.example.expensetracker.service;

import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.exporters.CsvExporter;
import com.example.expensetracker.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.Writer;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService extends BaseService {

    private final CsvExporter csvExporter;
    private final ExpenseRepository expenseRepository;

    public void exportUserExpensesToCsv(Writer writer) {
        UserEntity user = getAuthenticatedUser();
        List<ExpenseEntity> expenses = expenseRepository.findByUserId(user.getId());
        csvExporter.exportExpenses(writer, expenses);
    }
}
