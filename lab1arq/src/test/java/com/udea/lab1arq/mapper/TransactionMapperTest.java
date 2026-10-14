package com.udea.lab1arq.mapper;

import com.udea.lab1arq.dto.TransactionDTO;
import com.udea.lab1arq.entity.Transaction;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class TransactionMapperTest {

    private final TransactionMapper transactionMapper =
            TransactionMapper.INSTANCE;

    @Test
    void toDTOMapsAllTransactionFields() {
        LocalDateTime timestamp =
                LocalDateTime.of(2026, 10, 13, 10, 30);

        Transaction transaction = new Transaction(
                1L, "1001", "2002", 150.0, timestamp
        );

        TransactionDTO result = transactionMapper.toDTO(transaction);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("1001", result.getSenderAccountNumber());
        assertEquals("2002", result.getReceiverAccountNumber());
        assertEquals(150.0, result.getAmount());
        assertEquals(timestamp, result.getTimestamp());
    }

    @Test
    void toDTOReturnsNullWhenTransactionIsNull() {
        assertNull(transactionMapper.toDTO(null));
    }
}