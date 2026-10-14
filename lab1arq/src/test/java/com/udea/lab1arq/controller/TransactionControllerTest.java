package com.udea.lab1arq.controller;

import com.udea.lab1arq.dto.TransactionDTO;
import com.udea.lab1arq.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TransactionControllerTest {

    private TransactionService transactionService;
    private TransactionController transactionController;

    @BeforeEach
    void setUp() {
        transactionService = mock(TransactionService.class);
        transactionController = new TransactionController(transactionService);

        ReflectionTestUtils.setField(
                transactionController, "transactionService",
                transactionService
        );
    }

    @Test
    void transferMoneyReturnsSavedTransaction() {
        TransactionDTO request = new TransactionDTO(
                null, "1001", "1002", 100.0, LocalDateTime.now()
        );

        TransactionDTO saved = new TransactionDTO(
                1L, "1001", "1002", 100.0, request.getTimestamp()
        );

        when(transactionService.transferMoney(request)).thenReturn(saved);

        ResponseEntity<?> response =
                transactionController.transferMoney(request);

        assertEquals(200, response.getStatusCode().value());
        assertInstanceOf(TransactionDTO.class, response.getBody());

        TransactionDTO body = (TransactionDTO) response.getBody();
        assertEquals(1L, body.getId());
        assertEquals("1001", body.getSenderAccountNumber());
        assertEquals("1002", body.getReceiverAccountNumber());

        verify(transactionService).transferMoney(request);
    }

    @Test
    void transferMoneyReturnsBadRequestWhenServiceRejectsRequest() {
        TransactionDTO request = new TransactionDTO(
                null, "1001", "1002", 100.0, LocalDateTime.now()
        );

        when(transactionService.transferMoney(request))
                .thenThrow(new IllegalArgumentException("Saldo insuficiente"));

        ResponseEntity<?> response =
                transactionController.transferMoney(request);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Saldo insuficiente", response.getBody());
    }

    @Test
    void getTransactionsByAccountReturnsTransactions() {
        String accountNumber = "1001";

        List<TransactionDTO> transactions = List.of(
                new TransactionDTO(
                        1L, "1001", "1002", 100.0, LocalDateTime.now()
                ),
                new TransactionDTO(
                        2L, "1003", "1001", 50.0, LocalDateTime.now()
                )
        );

        when(transactionService.getTransactionsForAccount(accountNumber))
                .thenReturn(transactions);

        List<TransactionDTO> response =
                transactionController.getTransactionsByAccount(accountNumber);

        assertEquals(2, response.size());
        assertEquals(1L, response.get(0).getId());
        assertEquals(2L, response.get(1).getId());

        verify(transactionService)
                .getTransactionsForAccount(accountNumber);
    }

    @Test
    void getTransactionsByAccountReturnsEmptyList() {
        when(transactionService.getTransactionsForAccount("1001"))
                .thenReturn(List.of());

        List<TransactionDTO> response =
                transactionController.getTransactionsByAccount("1001");

        assertNotNull(response);
        assertTrue(response.isEmpty());
    }
}
