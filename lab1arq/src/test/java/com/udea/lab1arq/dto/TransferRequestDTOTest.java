package com.udea.lab1arq.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TransferRequestDTOTest {

    @Test
    void noArgsConstructorCreatesEmptyDTO() {
        TransferRequestDTO dto = new TransferRequestDTO();

        assertNotNull(dto);
        assertNull(dto.getSenderAccountNumber());
        assertNull(dto.getReceiverAccountNumber());
        assertNull(dto.getAmount());
    }

    @Test
    void gettersAndSettersWorkCorrectly() {
        TransferRequestDTO dto = new TransferRequestDTO();

        dto.setSenderAccountNumber("1001");
        dto.setReceiverAccountNumber("2002");
        dto.setAmount(150.0);

        assertEquals("1001", dto.getSenderAccountNumber());
        assertEquals("2002", dto.getReceiverAccountNumber());
        assertEquals(150.0, dto.getAmount());
    }
}