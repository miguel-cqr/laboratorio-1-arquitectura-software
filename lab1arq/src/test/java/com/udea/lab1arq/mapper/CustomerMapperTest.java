package com.udea.lab1arq.mapper;

import com.udea.lab1arq.dto.CustomerDTO;
import com.udea.lab1arq.entity.Customer;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CustomerMapperTest {

    private final CustomerMapper customerMapper = CustomerMapper.INSTANCE;

    @Test
    void toDTOMapsAllCustomerFields() {
        Customer customer = new Customer();
        customer.setId(1L);
        customer.setFirstName("Ana");
        customer.setLastName("Lopez");
        customer.setAccountNumber("1001");
        customer.setBalance(500.0);

        CustomerDTO result = customerMapper.toDTO(customer);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Ana", result.getFirstName());
        assertEquals("Lopez", result.getLastName());
        assertEquals("1001", result.getAccountNumber());
        assertEquals(500.0, result.getBalance());
    }

    @Test
    void toEntityMapsAllCustomerFields() {
        CustomerDTO customerDTO =
                new CustomerDTO(2L, "Carlos", "Perez", "2002", 750.0);

        Customer result = customerMapper.toEntity(customerDTO);

        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Carlos", result.getFirstName());
        assertEquals("Perez", result.getLastName());
        assertEquals("2002", result.getAccountNumber());
        assertEquals(750.0, result.getBalance());
    }

    @Test
    void toDTOReturnsNullWhenCustomerIsNull() {
        assertNull(customerMapper.toDTO(null));
    }

    @Test
    void toEntityReturnsNullWhenDTOIsNull() {
        assertNull(customerMapper.toEntity(null));
    }
}