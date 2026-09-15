package com.udea.lab1arq.mapper;

import com.udea.lab1arq.DTO.CustomerDTO;
import com.udea.lab1arq.entity.Customer;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-14T20:40:05-0500",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class CustomerMapperImpl implements CustomerMapper {

    @Override
    public CustomerDTO toDTO(Customer customer) {
        if ( customer == null ) {
            return null;
        }

        Long id = null;
        String firstName = null;
        String lastName = null;
        String accountNumber = null;
        Double balance = null;

        id = customer.getId();
        firstName = customer.getFirstName();
        lastName = customer.getLastName();
        accountNumber = customer.getAccountNumber();
        balance = customer.getBalance();

        CustomerDTO customerDTO = new CustomerDTO( id, firstName, lastName, accountNumber, balance );

        return customerDTO;
    }

    @Override
    public Customer toEntity(CustomerDTO customerDTO) {
        if ( customerDTO == null ) {
            return null;
        }

        Customer customer = new Customer();

        customer.setId( customerDTO.getId() );
        customer.setAccountNumber( customerDTO.getAccountNumber() );
        customer.setFirstName( customerDTO.getFirstName() );
        customer.setLastName( customerDTO.getLastName() );
        customer.setBalance( customerDTO.getBalance() );

        return customer;
    }
}
