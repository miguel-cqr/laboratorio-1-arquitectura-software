package com.udea.lab1arq.service;

import com.udea.lab1arq.DTO.TransactionDTO;
import com.udea.lab1arq.entity.Customer;
import com.udea.lab1arq.entity.Transaction;
import com.udea.lab1arq.repository.CustomerRepository;
import com.udea.lab1arq.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private TransactionService transactionService;

    @Test
    void transferMoneyUpdatesBalancesAndSavesTransaction() {
        TransactionDTO request = mock(TransactionDTO.class);
        Customer sender = mock(Customer.class);
        Customer receiver = mock(Customer.class);

        when(request.getSenderAccountNumber()).thenReturn("111");
        when(request.getReceiverAccountNumber()).thenReturn("222");
        when(request.getAmount()).thenReturn(50.0);

        when(customerRepository.findByAccountNumber("111"))
                .thenReturn(Optional.of(sender));
        when(customerRepository.findByAccountNumber("222"))
                .thenReturn(Optional.of(receiver));

        when(sender.getAccountNumber()).thenReturn("111");
        when(receiver.getAccountNumber()).thenReturn("222");
        when(sender.getBalance()).thenReturn(100.0);
        when(receiver.getBalance()).thenReturn(200.0);

        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> {
                    Transaction transaction = invocation.getArgument(0);
                    transaction.setId(1L);
                    return transaction;
                });

        TransactionDTO result = transactionService.transferMoney(request);

        verify(sender).setBalance(50.0);
        verify(receiver).setBalance(250.0);
        verify(customerRepository).save(sender);
        verify(customerRepository).save(receiver);
        verify(transactionRepository).save(any(Transaction.class));

        assertEquals("111", result.getSenderAccountNumber());
        assertEquals("222", result.getReceiverAccountNumber());
        assertEquals(50.0, result.getAmount());
        assertEquals(1L, result.getId());
    }

    @Test
    void transferMoneyRejectsNullAccountNumbers() {
        TransactionDTO request = mock(TransactionDTO.class);

        when(request.getSenderAccountNumber()).thenReturn(null);

        assertThrows(
                IllegalArgumentException.class,
                () -> transactionService.transferMoney(request)
        );

        verifyNoInteractions(customerRepository, transactionRepository);
    }

    @Test
    void transferMoneyRejectsMissingSenderAccount() {
        TransactionDTO request = mock(TransactionDTO.class);

        when(request.getSenderAccountNumber()).thenReturn("111");
        when(request.getReceiverAccountNumber()).thenReturn("222");

        when(customerRepository.findByAccountNumber("111"))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> transactionService.transferMoney(request)
        );

        assertEquals(
                "La cuenta del remitente no existe.",
                exception.getMessage()
        );

        verify(transactionRepository, never()).save(any(Transaction.class));
    }

    @Test
    void transferMoneyRejectsMissingReceiverAccount() {
        TransactionDTO request = mock(TransactionDTO.class);
        Customer sender = mock(Customer.class);

        when(request.getSenderAccountNumber()).thenReturn("111");
        when(request.getReceiverAccountNumber()).thenReturn("222");

        when(customerRepository.findByAccountNumber("111"))
                .thenReturn(Optional.of(sender));
        when(customerRepository.findByAccountNumber("222"))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> transactionService.transferMoney(request)
        );

        assertEquals(
                "La cuenta del receptor no existe.",
                exception.getMessage()
        );

        verify(transactionRepository, never()).save(any(Transaction.class));
    }

    @Test
    void transferMoneyRejectsInsufficientBalance() {
        TransactionDTO request = mock(TransactionDTO.class);
        Customer sender = mock(Customer.class);
        Customer receiver = mock(Customer.class);

        when(request.getSenderAccountNumber()).thenReturn("111");
        when(request.getReceiverAccountNumber()).thenReturn("222");
        when(request.getAmount()).thenReturn(50.0);

        when(customerRepository.findByAccountNumber("111"))
                .thenReturn(Optional.of(sender));
        when(customerRepository.findByAccountNumber("222"))
                .thenReturn(Optional.of(receiver));

        when(sender.getBalance()).thenReturn(20.0);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> transactionService.transferMoney(request)
        );

        assertEquals(
                "Saldo insuficiente en la cuenta del remitente.",
                exception.getMessage()
        );

        verify(customerRepository, never()).save(any(Customer.class));
        verifyNoInteractions(transactionRepository);
    }

    @Test
    void getTransactionsForAccountReturnsTransactionDTOs() {
        Transaction transaction = mock(Transaction.class);

        when(transactionRepository
                .findBySenderAccountNumberOrReceiverAccountNumber("111", "111"))
                .thenReturn(List.of(transaction));

        when(transaction.getId()).thenReturn(1L);
        when(transaction.getSenderAccountNumber()).thenReturn("111");
        when(transaction.getReceiverAccountNumber()).thenReturn("222");
        when(transaction.getAmount()).thenReturn(25.0);

        List<TransactionDTO> result =
                transactionService.getTransactionsForAccount("111");

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals("111", result.get(0).getSenderAccountNumber());
        assertEquals("222", result.get(0).getReceiverAccountNumber());
        assertEquals(25.0, result.get(0).getAmount());
    }
    @Test
    void transferMoneyRejectsNullSenderAccount() {
        TransactionDTO dto = new TransactionDTO();
        dto.setSenderAccountNumber(null);
        dto.setReceiverAccountNumber("2002");
        dto.setAmount(100.0);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> transactionService.transferMoney(dto)
        );

        assertEquals(
                "Los números de cuenta del remitente y receptor son obligatorios.",
                exception.getMessage()
        );

        verifyNoInteractions(customerRepository, transactionRepository);
    }

    @Test
    void transferMoneyRejectsNullReceiverAccount() {
        TransactionDTO dto = new TransactionDTO();
        dto.setSenderAccountNumber("1001");
        dto.setReceiverAccountNumber(null);
        dto.setAmount(100.0);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> transactionService.transferMoney(dto)
        );

        assertEquals(
                "Los números de cuenta del remitente y receptor son obligatorios.",
                exception.getMessage()
        );

        verifyNoInteractions(customerRepository, transactionRepository);
    }
}