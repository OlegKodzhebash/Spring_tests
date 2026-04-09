package org.example.travellguide.controller;

import org.example.travellguide.dto.ReviewRequest;
import org.example.travellguide.exception.BadRequestException;
import org.example.travellguide.exception.ResourceNotFoundException;
import org.example.travellguide.model.Customer;
import org.example.travellguide.model.Review;
import org.example.travellguide.model.Tour;
import org.example.travellguide.repository.CustomerRepository;
import org.example.travellguide.repository.ReviewRepository;
import org.example.travellguide.repository.TourRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final TourRepository tourRepository;
    private final CustomerRepository customerRepository;

    public ReviewController(ReviewRepository reviewRepository,
                            TourRepository tourRepository,
                            CustomerRepository customerRepository) {
        this.reviewRepository = reviewRepository;
        this.tourRepository = tourRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review with id " + id + " not found"));
        return ResponseEntity.ok(review);
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<Review>> getReviewsByTour(@PathVariable Long tourId) {
        if (!tourRepository.existsById(tourId)) {
            throw new ResourceNotFoundException("Tour with id " + tourId + " not found");
        }
        return ResponseEntity.ok(reviewRepository.findByTourId(tourId));
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest request) {
        validateRating(request.getRating());

        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour with id " + request.getTourId() + " not found"));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer with id " + request.getCustomerId() + " not found"));

        Review review = new Review();
        review.setText(request.getText());
        review.setRating(request.getRating());
        review.setCreatedAt(LocalDate.now());
        review.setTour(tour);
        review.setCustomer(customer);

        Review savedReview = reviewRepository.save(review);

        updateTourRating(tour.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody ReviewRequest request) {
        validateRating(request.getRating());

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review with id " + id + " not found"));

        Long oldTourId = review.getTour().getId();

        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour with id " + request.getTourId() + " not found"));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer with id " + request.getCustomerId() + " not found"));

        review.setText(request.getText());
        review.setRating(request.getRating());
        review.setTour(tour);
        review.setCustomer(customer);

        Review savedReview = reviewRepository.save(review);

        updateTourRating(tour.getId());

        if (!oldTourId.equals(tour.getId())) {
            updateTourRating(oldTourId);
        }

        return ResponseEntity.ok(savedReview);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review with id " + id + " not found"));

        Long tourId = review.getTour().getId();

        reviewRepository.delete(review);

        updateTourRating(tourId);

        return ResponseEntity.noContent().build();
    }

    private void validateRating(Integer rating) {
        if (rating == null) {
            throw new BadRequestException("Rating is required");
        }

        if (rating < 1 || rating > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }
    }

    private void updateTourRating(Long tourId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour with id " + tourId + " not found"));

        List<Review> reviews = reviewRepository.findByTourId(tourId);

        if (reviews.isEmpty()) {
            tour.setRating(0.0);
        } else {
            double average = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);

            double rounded = Math.round(average * 10.0) / 10.0;
            tour.setRating(rounded);
        }

        tourRepository.save(tour);
    }
}