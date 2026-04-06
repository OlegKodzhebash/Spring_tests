package org.example.travellguide.controller;

import org.example.travellguide.model.Booking;
import org.example.travellguide.model.Customer;
import org.example.travellguide.model.Tour;
import org.example.travellguide.repository.BookingRepository;
import org.example.travellguide.repository.CustomerRepository;
import org.example.travellguide.repository.TourRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final CustomerRepository customerRepository;

    public BookingController(BookingRepository bookingRepository,
                             TourRepository tourRepository,
                             CustomerRepository customerRepository) {
        this.bookingRepository = bookingRepository;
        this.tourRepository = tourRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Booking createBooking(@RequestBody BookingRequest request) {
        Tour tour = tourRepository.findById(request.getTourId()).orElseThrow();
        Customer customer = customerRepository.findById(request.getCustomerId()).orElseThrow();

        Booking booking = new Booking();
        booking.setTour(tour);
        booking.setCustomer(customer);
        booking.setBookingDate(LocalDate.parse(request.getBookingDate()));
        booking.setNumberOfPeople(request.getNumberOfPeople());

        return bookingRepository.save(booking);
    }

    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id, @RequestBody BookingRequest request) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        Tour tour = tourRepository.findById(request.getTourId()).orElseThrow();
        Customer customer = customerRepository.findById(request.getCustomerId()).orElseThrow();

        booking.setTour(tour);
        booking.setCustomer(customer);
        booking.setBookingDate(LocalDate.parse(request.getBookingDate()));
        booking.setNumberOfPeople(request.getNumberOfPeople());

        return bookingRepository.save(booking);
    }

    @DeleteMapping("/{id}")
    public String deleteBooking(@PathVariable Long id) {
        bookingRepository.deleteById(id);
        return "Booking deleted successfully";
    }

    public static class BookingRequest {
        private Long tourId;
        private Long customerId;
        private String bookingDate;
        private int numberOfPeople;

        public Long getTourId() {
            return tourId;
        }

        public void setTourId(Long tourId) {
            this.tourId = tourId;
        }

        public Long getCustomerId() {
            return customerId;
        }

        public void setCustomerId(Long customerId) {
            this.customerId = customerId;
        }

        public String getBookingDate() {
            return bookingDate;
        }

        public void setBookingDate(String bookingDate) {
            this.bookingDate = bookingDate;
        }

        public int getNumberOfPeople() {
            return numberOfPeople;
        }

        public void setNumberOfPeople(int numberOfPeople) {
            this.numberOfPeople = numberOfPeople;
        }
    }
}