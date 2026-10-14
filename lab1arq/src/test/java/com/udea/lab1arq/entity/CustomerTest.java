package com.udea.lab1arq.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CustomerTest {

    @Test
    void noArgsConstructorCreatesCustomer() {
        Customer customer = new Customer();

        assertNotNull(customer);
        assertNull(customer.getId());
        assertNull(customer.getAccountNumber());
        assertNull(customer.getFirstName());
        assertNull(customer.getLastName());
        assertNull(customer.getBalance());
    }

    @Test
    void constructorSetsAllFields() {
        Customer customer = new Customer(
                1L, "1001", "Ana", "Lopez", 500.0
        );

        assertEquals(1L, customer.getId());
        assertEquals("1001", customer.getAccountNumber());
        assertEquals("Ana", customer.getFirstName());
        assertEquals("Lopez", customer.getLastName());
        assertEquals(500.0, customer.getBalance());
    }

    @Test
    void settersUpdateAllFields() {
        Customer customer = new Customer();

        customer.setId(2L);
        customer.setAccountNumber("2002");
        customer.setFirstName("Carlos");
        customer.setLastName("Perez");
        customer.setBalance(750.0);

        assertEquals(2L, customer.getId());
        assertEquals("2002", customer.getAccountNumber());
        assertEquals("Carlos", customer.getFirstName());
        assertEquals("Perez", customer.getLastName());
        assertEquals(750.0, customer.getBalance());
    }

    @Test
    void equalsReturnsTrueForSameObject() {
        Customer customer = new Customer(
                1L, "1001", "Ana", "Lopez", 500.0
        );

        assertEquals(customer, customer);
    }

    @Test
    void equalsReturnsFalseForNull() {
        Customer customer = new Customer(
                1L, "1001", "Ana", "Lopez", 500.0
        );

        assertNotEquals(null, customer);
    }

    @Test
    void equalsReturnsFalseForDifferentClass() {
        Customer customer = new Customer(
                1L, "1001", "Ana", "Lopez", 500.0
        );

        assertNotEquals("Customer", customer);
    }

    @Test
    void equalsReturnsTrueForCustomersWithSameId() {
        Customer first = new Customer(
                1L, "1001", "Ana", "Lopez", 500.0
        );

        Customer second = new Customer(
                1L, "9999", "Carlos", "Perez", 900.0
        );

        assertEquals(first, second);
        assertEquals(first.hashCode(), second.hashCode());
    }

    @Test
    void equalsReturnsFalseForCustomersWithDifferentIds() {
        Customer first = new Customer(
                1L, "1001", "Ana", "Lopez", 500.0
        );

        Customer second = new Customer(
                2L, "1002", "Ana", "Lopez", 500.0
        );

        assertNotEquals(first, second);
    }

    @Test
    void customersWithNullIdsAreEqual() {
        Customer first = new Customer(
                null, "1001", "Ana", "Lopez", 500.0
        );

        Customer second = new Customer(
                null, "1002", "Carlos", "Perez", 800.0
        );

        assertEquals(first, second);
        assertEquals(first.hashCode(), second.hashCode());
    }

    @Test
    void hashCodeReturnsSameValueForSameId() {
        Customer first = new Customer(
                10L, "1001", "Ana", "Lopez", 500.0
        );

        Customer second = new Customer(
                10L, "1002", "Carlos", "Perez", 800.0
        );

        assertEquals(first.hashCode(), second.hashCode());
    }

    @Test
    void toStringContainsCustomerFields() {
        Customer customer = new Customer(
                1L, "1001", "Ana", "Lopez", 500.0
        );

        String result = customer.toString();

        assertTrue(result.contains("id=1"));
        assertTrue(result.contains("accountNumber='1001'"));
        assertTrue(result.contains("firstName='Ana'"));
        assertTrue(result.contains("lastName='Lopez'"));
        assertTrue(result.contains("balance=500.0"));
    }
}