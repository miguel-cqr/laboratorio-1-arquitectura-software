package com.udea.lab1arq.service;

import com.udea.lab1arq.DTO.CustomerDTO;
import com.udea.lab1arq.entity.Customer;
import com.udea.lab1arq.mapper.CustomerMapper;
import com.udea.lab1arq.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CustomerMapper customerMapper;

    @InjectMocks
    private CustomerService customerService;

    @Test
    void getAllCustomerReturnsCustomersAsDTOs() {
        Customer customer = mock(Customer.class);
        CustomerDTO customerDTO = mock(CustomerDTO.class);

        when(customerRepository.findAll()).thenReturn(List.of(customer));
        when(customerMapper.toDTO(customer)).thenReturn(customerDTO);

        List<CustomerDTO> result = customerService.getAllCustomer();

        assertEquals(1, result.size());
        assertSame(customerDTO, result.get(0));
        verify(customerRepository).findAll();
        verify(customerMapper).toDTO(customer);
    }

    @Test
    void getCustomerByIdReturnsCustomerWhenItExists() {
        Customer customer = mock(Customer.class);
        CustomerDTO customerDTO = mock(CustomerDTO.class);

        when(customerRepository.findById(1L))
                .thenReturn(Optional.of(customer));
        when(customerMapper.toDTO(customer)).thenReturn(customerDTO);

        CustomerDTO result = customerService.getCustomerById(1L);

        assertSame(customerDTO, result);
    }

    @Test
    void getCustomerByIdThrowsExceptionWhenCustomerDoesNotExist() {
        when(customerRepository.findById(99L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> customerService.getCustomerById(99L)
        );

        assertEquals("Customer not found", exception.getMessage());
        verify(customerMapper, never()).toDTO(any());
    }

    @Test
    void createCustomerConvertsSavesAndReturnsDTO() {
        CustomerDTO inputDTO = mock(CustomerDTO.class);
        Customer customer = mock(Customer.class);
        Customer savedCustomer = mock(Customer.class);
        CustomerDTO resultDTO = mock(CustomerDTO.class);

        when(customerMapper.toEntity(inputDTO)).thenReturn(customer);
        when(customerRepository.save(customer)).thenReturn(savedCustomer);
        when(customerMapper.toDTO(savedCustomer)).thenReturn(resultDTO);

        CustomerDTO result = customerService.createCustomer(inputDTO);

        assertSame(resultDTO, result);
        verify(customerMapper).toEntity(inputDTO);
        verify(customerRepository).save(customer);
        verify(customerMapper).toDTO(savedCustomer);
    }
}