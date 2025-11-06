package com.example.expensetracker.service;

import java.io.OutputStream;
import java.io.Writer;

public interface ExportService {
    void exportUserExpensesToCsv(Writer writer);
    
    void exportUserExpensesToPdf(OutputStream outputStream);
    
    void exportTeamExpensesToCsv(Long userId, Long teamId, Writer writer);
    
    void exportTeamExpensesToPdf(Long userId, Long teamId, OutputStream outputStream);
}
