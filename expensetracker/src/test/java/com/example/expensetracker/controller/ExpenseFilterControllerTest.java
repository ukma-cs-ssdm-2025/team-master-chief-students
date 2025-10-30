//package com.example.expensetracker.controller;
//
//import com.example.expensetracker.controller.v1.ExpenseFilterController;
//import com.example.expensetracker.dto.ExpenseDto;
//import com.example.expensetracker.service.ExpenseService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.test.web.servlet.MockMvc;
//
//import org.springframework.security.test.context.support.WithMockUser;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.util.List;
//import java.util.Map;
//
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(ExpenseFilterController.class)
//@WithMockUser(username = "test@example.com", roles = "USER")
//class ExpenseFilterControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//
//    private ExpenseService expenseService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Test
//    void testFilterExpenses() throws Exception {
//        List<ExpenseDto> filtered = List.of(
//                new ExpenseDto(1L,1L,  "Food", "Dinner", BigDecimal.valueOf(20), LocalDate.now())
//        );
//
//        when(expenseService.filter(any(), any(), any(), any(), any())).thenReturn(filtered);
//
//        mockMvc.perform(get("/api/v1/expenses/filter")
//                        .param("category", "Food"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.message").value("Filtered expenses retrieved successfully"))
//                .andExpect(jsonPath("$.data[0].category").value("Food"));
//    }
//
//    @Test
//    void testGetStatistics() throws Exception {
//        Map<String, Object> stats = Map.of(
//                "totalAmount", BigDecimal.valueOf(100.5),
//                "count", 5
//        );
//
//        when(expenseService.getStatistics()).thenReturn(stats);
//
//        mockMvc.perform(get("/api/v1/expenses/filter/statistics"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.message").value("Expense statistics retrieved successfully"))
//                .andExpect(jsonPath("$.data.totalAmount").value(100.5))
//                .andExpect(jsonPath("$.data.count").value(5));
//    }
//}
