package com.udea.lab1arq.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Objects;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="customers")
@Getter
@Setter
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    protected Long id;
    @Column(unique = true, nullable = false)
    protected String accountNumber;
    @Column(nullable = false, length = 50)
    protected String firstName;
    @Column(nullable = false, length = 50)
    protected String lastName;
    @Column(nullable = false)
    protected Double balance;

    public Customer() {
    }

    @JsonCreator
    public Customer(@JsonProperty("id") Long id,
                    @JsonProperty("accountNumber") String accountNumber,
                    @JsonProperty("firstName")String firstName,
                    @JsonProperty("lastName") String lastName,
                    @JsonProperty("balance") Double balance) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.balance = balance;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Customer customer = (Customer) o;
        return Objects.equals(id, customer.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Customer{" +
                "id=" + id +
                ", accountNumber='" + accountNumber + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", balance=" + balance +
                '}';
    }
}