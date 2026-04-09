package org.example.travellguide.controller;

import org.example.travellguide.exception.BadRequestException;
import org.example.travellguide.exception.ResourceNotFoundException;
import org.example.travellguide.model.Customer;
import org.example.travellguide.repository.BookingRepository;
import org.example.travellguide.repository.CustomerRepository;
import org.example.travellguide.repository.ReviewRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    public CustomerController(CustomerRepository customerRepository,
                              BookingRepository bookingRepository,
                              ReviewRepository reviewRepository) {
        this.customerRepository = customerRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer with id " + id + " not found"));
        return ResponseEntity.ok(customer);
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        Customer savedCustomer = customerRepository.save(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer updatedCustomer) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer with id " + id + " not found"));

        customer.setName(updatedCustomer.getName());
        customer.setEmail(updatedCustomer.getEmail());
        customer.setPhone(updatedCustomer.getPhone());

        Customer savedCustomer = customerRepository.save(customer);
        return ResponseEntity.ok(savedCustomer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer with id " + id + " not found"));

        if (bookingRepository.existsByCustomerId(id)) {
            throw new BadRequestException("Cannot delete customer with id " + id + " because it is used in bookings");
        }

        if (reviewRepository.existsByCustomerId(id)) {
            throw new BadRequestException("Cannot delete customer with id " + id + " because it is used in reviews");
        }

        customerRepository.delete(customer);
        return ResponseEntity.noContent().build();
    }
}