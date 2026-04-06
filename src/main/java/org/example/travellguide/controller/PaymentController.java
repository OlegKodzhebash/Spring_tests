package org.example.travellguide.controller;

import org.example.travellguide.model.Booking;
import org.example.travellguide.model.Payment;
import org.example.travellguide.repository.BookingRepository;
import org.example.travellguide.repository.PaymentRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentController(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable Long id) {
        return paymentRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Payment createPayment(@RequestBody PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId()).orElseThrow();

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(LocalDate.parse(request.getPaymentDate()));
        payment.setMethod(request.getMethod());

        return paymentRepository.save(payment);
    }

    @PutMapping("/{id}")
    public Payment updatePayment(@PathVariable Long id, @RequestBody PaymentRequest request) {
        Payment payment = paymentRepository.findById(id).orElseThrow();
        Booking booking = bookingRepository.findById(request.getBookingId()).orElseThrow();

        payment.setBooking(booking);
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(LocalDate.parse(request.getPaymentDate()));
        payment.setMethod(request.getMethod());

        return paymentRepository.save(payment);
    }

    @DeleteMapping("/{id}")
    public String deletePayment(@PathVariable Long id) {
        paymentRepository.deleteById(id);
        return "Payment deleted successfully";
    }

    public static class PaymentRequest {
        private Long bookingId;
        private double amount;
        private String paymentDate;
        private String method;

        public Long getBookingId() {
            return bookingId;
        }

        public void setBookingId(Long bookingId) {
            this.bookingId = bookingId;
        }

        public double getAmount() {
            return amount;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }

        public String getPaymentDate() {
            return paymentDate;
        }

        public void setPaymentDate(String paymentDate) {
            this.paymentDate = paymentDate;
        }

        public String getMethod() {
            return method;
        }

        public void setMethod(String method) {
            this.method = method;
        }
    }
}