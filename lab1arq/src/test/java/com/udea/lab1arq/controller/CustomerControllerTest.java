package com.udea.lab1arq.controller;

import com.udea.lab1arq.DTO.CustomerDTO;
import com.udea.lab1arq.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomerControllerTest {

    private CustomerService customerService;
    private CustomerController customerController;

    @BeforeEach
    void setUp() {
        customerService = mock(CustomerService.class);
        customerController = new CustomerController();

        ReflectionTestUtils.setField(
                customerController, "customerFacade", customerService
        );
    }

    @Test
    void getAllCustomersReturnsCustomerList() {
        List<CustomerDTO> customers = List.of(
                new CustomerDTO(1L, "Ana", "Lopez", "1001", 500.0),
                new CustomerDTO(2L, "Luis", "Perez", "1002", 800.0)
        );

        when(customerService.getAllCustomer()).thenReturn(customers);

        ResponseEntity<List<CustomerDTO>> response =
                customerController.getAllCustomers();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(2, response.getBody().size());
        assertEquals("Ana", response.getBody().get(0).getFirstName());

        verify(customerService).getAllCustomer();
    }

    @Test
    void getAllCustomersReturnsEmptyList() {
        when(customerService.getAllCustomer()).thenReturn(List.of());

        ResponseEntity<List<CustomerDTO>> response =
                customerController.getAllCustomers();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void getCustomerByIdReturnsCustomer() {
        CustomerDTO customer =
                new CustomerDTO(1L, "Ana", "Lopez", "1001", 500.0);

        when(customerService.getCustomerById(1L)).thenReturn(customer);

        ResponseEntity<CustomerDTO> response =
                customerController.getCustomerById(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1L, response.getBody().getId());
        assertEquals("1001", response.getBody().getAccountNumber());

        verify(customerService).getCustomerById(1L);
    }

    @Test
    void getCustomerByIdPropagatesServiceException() {
        when(customerService.getCustomerById(99L))
                .thenThrow(new RuntimeException("Customer not found"));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> customerController.getCustomerById(99L)
        );

        assertEquals("Customer not found", exception.getMessage());
    }

    @Test
    void createCustomerReturnsCreatedCustomer() {
        CustomerDTO request =
                new CustomerDTO(null, "Ana", "Lopez", "1001", 500.0);

        CustomerDTO saved =
                new CustomerDTO(1L, "Ana", "Lopez", "1001", 500.0);

        when(customerService.createCustomer(request)).thenReturn(saved);

        ResponseEntity<CustomerDTO> response =
                customerController.createCustomer(request);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1L, response.getBody().getId());

        verify(customerService).createCustomer(request);
    }

    @Test
    void createCustomerRejectsNullBalance() {
        CustomerDTO request =
                new CustomerDTO(null, "Ana", "Lopez", "1001", null);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> customerController.createCustomer(request)
        );

        assertEquals("Balance cannot be null", exception.getMessage());
        verifyNoInteractions(customerService);
    }
}