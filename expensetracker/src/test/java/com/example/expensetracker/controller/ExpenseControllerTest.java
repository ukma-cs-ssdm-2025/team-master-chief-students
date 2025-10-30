//package com.example.expensetracker.controller;
//
//import com.example.expensetracker.controller.v1.ExpenseController;
//import com.example.expensetracker.dto.ExpenseDto;
//import com.example.expensetracker.security.JwtService;
//import com.example.expensetracker.service.ExpenseService;
//import com.example.expensetracker.service.ExportService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.util.List;
//
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(ExpenseController.class)
//@AutoConfigureMockMvc(addFilters = false)
//class ExpenseControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private ExpenseService expenseService;
//
//    @MockBean
//    private ExportService exportService;
//
//    @MockBean
//    private JwtService jwtService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Test
//    void testCreateExpense() throws Exception {
//        ExpenseDto dto = new ExpenseDto(1L,1L, "Food", "Lunch", BigDecimal.valueOf(15.5), LocalDate.now());
//
//        when(expenseService.create(any())).thenReturn(dto);
//
//        mockMvc.perform(post("/api/v1/expenses")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(dto)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.message").value("Expense created successfully"))
//                .andExpect(jsonPath("$.data.category").value("Food"));
//    }
//
//    @Test
//    void testGetAllExpenses() throws Exception {
//        List<ExpenseDto> expenses = List.of(
//                new ExpenseDto(1L,1L, "Food", "Lunch", BigDecimal.valueOf(10), LocalDate.now()),
//                new ExpenseDto(2L,1L, "Transport", "Bus", BigDecimal.valueOf(5), LocalDate.now())
//        );
//
//        when(expenseService.getAll()).thenReturn(expenses);
//
//        mockMvc.perform(get("/api/v1/expenses"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.data").isArray())
//                .andExpect(jsonPath("$.data[0].category").value("Food"));
//    }
//
//    @Test
//    void testDeleteExpense() throws Exception {
//        doNothing().when(expenseService).delete(1L);
//
//        mockMvc.perform(delete("/api/v1/expenses/1"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.message").value("Expense deleted successfully"));
//    }
//}
