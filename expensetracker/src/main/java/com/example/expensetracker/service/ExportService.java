package com.example.expensetracker.service;

import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.enums.TeamRole;
import com.example.expensetracker.exporters.CsvExporter;
import com.example.expensetracker.exporters.PdfExporter;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.util.TeamAcl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.io.Writer;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExportService extends BaseService {

    private final ExpenseRepository expenseRepository;
    private final CsvExporter csvExporter;
    private final PdfExporter pdfExporter;
    private final TeamAcl teamAcl;

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

    public void exportTeamExpensesToCsv(Long userId, Long teamId, Writer writer) {
        log.info("Exporting team {} expenses to CSV by user {}", teamId, userId);
        
        teamAcl.requireMembership(userId, teamId, TeamRole.OWNER, TeamRole.ADMIN);
        
        List<ExpenseEntity> expenses = expenseRepository.findAllByTeamId(teamId);
        csvExporter.exportExpenses(writer, expenses);
        
        log.info("Exported {} expenses from team {} to CSV", expenses.size(), teamId);
    }

    public void exportTeamExpensesToPdf(Long userId, Long teamId, OutputStream outputStream) {
        log.info("Exporting team {} expenses to PDF by user {}", teamId, userId);
        
        teamAcl.requireMembership(userId, teamId, TeamRole.OWNER, TeamRole.ADMIN);
        
        List<ExpenseEntity> expenses = expenseRepository.findAllByTeamId(teamId);
        pdfExporter.exportExpenses(outputStream, expenses);
        
        log.info("Exported {} expenses from team {} to PDF", expenses.size(), teamId);
    }
}
