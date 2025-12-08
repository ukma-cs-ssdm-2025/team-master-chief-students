package com.example.expensetracker.repository;

import com.example.expensetracker.entity.ReceiptEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptRepository extends JpaRepository<ReceiptEntity, Integer> {
    ReceiptEntity findByExpense_Id(Long expenseId);
}
