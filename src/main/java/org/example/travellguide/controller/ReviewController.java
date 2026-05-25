package org.example.travellguide.controller;

import jakarta.servlet.http.HttpSession;
import org.example.travellguide.dto.ReviewRequest;
import org.example.travellguide.exception.BadRequestException;
import org.example.travellguide.exception.ResourceNotFoundException;
import org.example.travellguide.model.AppUser;
import org.example.travellguide.model.Review;
import org.example.travellguide.model.Tour;
import org.example.travellguide.repository.AppUserRepository;
import org.example.travellguide.repository.ReviewRepository;
import org.example.travellguide.repository.TourRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private static final String SESSION_USER_ID = "USER_ID";

    private final ReviewRepository reviewRepository;
    private final TourRepository tourRepository;
    private final AppUserRepository appUserRepository;

    public ReviewController(ReviewRepository reviewRepository,
                            TourRepository tourRepository,
                            AppUserRepository appUserRepository) {
        this.reviewRepository = reviewRepository;
        this.tourRepository = tourRepository;
        this.appUserRepository = appUserRepository;
    }

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewRepository.findAll());
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<Review>> getReviewsByTour(@PathVariable Long tourId) {
        if (!tourRepository.existsById(tourId)) {
            throw new ResourceNotFoundException("Tour with id " + tourId + " not found");
        }

        return ResponseEntity.ok(reviewRepository.findByTourId(tourId));
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest request, HttpSession session) {
        AppUser currentUser = getCurrentUser(session);
        validateRating(request.getRating());

        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour with id " + request.getTourId() + " not found"));

        Review review = new Review();
        review.setText(request.getText());
        review.setRating(request.getRating());
        review.setCreatedAt(LocalDate.now());
        review.setTour(tour);
        review.setUser(currentUser);

        Review savedReview = reviewRepository.save(review);

        updateTourRating(tour.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id,
                                               @RequestBody ReviewRequest request,
                                               HttpSession session) {
        AppUser currentUser = getCurrentUser(session);
        validateRating(request.getRating());

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review with id " + id + " not found"));

        if (!review.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can edit only your own review");
        }

        Long oldTourId = review.getTour().getId();

        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour with id " + request.getTourId() + " not found"));

        review.setText(request.getText());
        review.setRating(request.getRating());
        review.setTour(tour);

        Review savedReview = reviewRepository.save(review);

        updateTourRating(tour.getId());

        if (!oldTourId.equals(tour.getId())) {
            updateTourRating(oldTourId);
        }

        return ResponseEntity.ok(savedReview);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id, HttpSession session) {
        AppUser currentUser = getCurrentUser(session);

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review with id " + id + " not found"));

        if (!review.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can delete only your own review");
        }

        Long tourId = review.getTour().getId();

        reviewRepository.delete(review);

        updateTourRating(tourId);

        return ResponseEntity.noContent().build();
    }

    private AppUser getCurrentUser(HttpSession session) {
        Object userIdObj = session.getAttribute(SESSION_USER_ID);

        if (userIdObj == null) {
            throw new BadRequestException("Authentication required");
        }

        Long userId = ((Number) userIdObj).longValue();

        return appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
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