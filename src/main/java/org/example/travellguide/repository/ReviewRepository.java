package org.example.travellguide.repository;

import org.example.travellguide.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTourId(Long tourId);
    boolean existsByTourId(Long tourId);
    boolean existsByCustomerId(Long customerId);
}