package org.example.travellguide.controller;

import org.example.travellguide.dto.BookingRequest;
import org.example.travellguide.exception.BadRequestException;
import org.example.travellguide.exception.ResourceNotFoundException;
import org.example.travellguide.model.Booking;
import org.example.travellguide.model.Customer;
import org.example.travellguide.model.Tour;
import org.example.travellguide.repository.BookingRepository;
import org.example.travellguide.repository.CustomerRepository;
import org.example.travellguide.repository.PaymentRepository;
import org.example.travellguide.repository.TourRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final CustomerRepository customerRepository;
    private final PaymentRepository paymentRepository;

    public BookingController(BookingRepository bookingRepository,
                             TourRepository tourRepository,
                             CustomerRepository customerRepository,
                             PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.tourRepository = tourRepository;
        this.customerRepository = customerRepository;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking with id " + id + " not found"));
        return ResponseEntity.ok(booking);
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request) {
        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour with id " + request.getTourId() + " not found"));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer with id " + request.getCustomerId() + " not found"));

        Booking booking = new Booking();
        booking.setTour(tour);
        booking.setCustomer(customer);
        booking.setBookingDate(LocalDate.parse(request.getBookingDate()));
        booking.setNumberOfPeople(request.getNumberOfPeople());

        Booking savedBooking = bookingRepository.save(booking);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBooking);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody BookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking with id " + id + " not found"));

        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour with id " + request.getTourId() + " not found"));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer with id " + request.getCustomerId() + " not found"));

        booking.setTour(tour);
        booking.setCustomer(customer);
        booking.setBookingDate(LocalDate.parse(request.getBookingDate()));
        booking.setNumberOfPeople(request.getNumberOfPeople());

        Booking savedBooking = bookingRepository.save(booking);
        return ResponseEntity.ok(savedBooking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking with id " + id + " not found"));

        if (paymentRepository.existsByBookingId(id)) {
            throw new BadRequestException("Cannot delete booking with id " + id + " because it is used in payments");
        }

        bookingRepository.delete(booking);
        return ResponseEntity.noContent().build();
    }
}