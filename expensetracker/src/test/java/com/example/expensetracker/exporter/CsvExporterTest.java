package com.example.expensetracker.exporter;

import com.example.expensetracker.exporters.CsvExporter;
import org.junit.jupiter.api.Test;

import java.io.StringWriter;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CsvExporterTest {

    @Test
    void export_WithEmptyList_ShouldReturnOnlyHeader() {
        CsvExporter exporter = new CsvExporter();
        StringWriter writer = new StringWriter();

        exporter.exportExpenses(writer, Collections.emptyList());

        String expectedCsv = "ID,Date,Category,Amount,Description\n";
        assertEquals(expectedCsv, writer.toString());
    }

}
