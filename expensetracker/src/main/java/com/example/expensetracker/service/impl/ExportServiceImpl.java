package com.example.expensetracker.service.impl;

import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.enums.TeamRole;
import com.example.expensetracker.exporters.CsvExporter;
import com.example.expensetracker.exporters.PdfExporter;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.service.BaseService;
import com.example.expensetracker.service.ExportService;
import com.example.expensetracker.util.TeamAcl;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.io.Writer;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportServiceImpl extends BaseService implements ExportService {

    private static final Logger logger = LogManager.getLogger(ExportServiceImpl.class);

    private final ExpenseRepository expenseRepository;
    private final CsvExporter csvExporter;
    private final PdfExporter pdfExporter;
    private final TeamAcl teamAcl;

    @Override
    public void exportUserExpensesToCsv(Writer writer) {
        UserEntity user = getAuthenticatedUser();
        List<ExpenseEntity> expenses = expenseRepository.findByUserId(user.getId());
        csvExporter.exportExpenses(writer, expenses);
    }

    @Override
    public void exportUserExpensesToPdf(OutputStream outputStream) {
        UserEntity user = getAuthenticatedUser();
        List<ExpenseEntity> expenses = expenseRepository.findByUserId(user.getId());
        pdfExporter.exportExpenses(outputStream, expenses);
    }

    @Override
    public void exportTeamExpensesToCsv(Long userId, Long teamId, Writer writer) {
        logger.info("Exporting team {} expenses to CSV by user {}", teamId, userId);
        
        teamAcl.requireMembership(userId, teamId, TeamRole.OWNER, TeamRole.ADMIN);
        
        List<ExpenseEntity> expenses = expenseRepository.findAllByTeamId(teamId);
        csvExporter.exportExpenses(writer, expenses);
        
        logger.info("Exported {} expenses from team {} to CSV", expenses.size(), teamId);
    }

    @Override
    public void exportTeamExpensesToPdf(Long userId, Long teamId, OutputStream outputStream) {
        logger.info("Exporting team {} expenses to PDF by user {}", teamId, userId);
        
        teamAcl.requireMembership(userId, teamId, TeamRole.OWNER, TeamRole.ADMIN);
        
        List<ExpenseEntity> expenses = expenseRepository.findAllByTeamId(teamId);
        pdfExporter.exportExpenses(outputStream, expenses);
        
        logger.info("Exported {} expenses from team {} to PDF", expenses.size(), teamId);
    }
}

