package org.example.travellguide.repository;

import org.example.travellguide.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    boolean existsByBookingId(Long bookingId);
}