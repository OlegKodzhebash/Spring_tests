package org.example.travellguide.controller;

import org.example.travellguide.dto.TourRequest;
import org.example.travellguide.exception.BadRequestException;
import org.example.travellguide.exception.ResourceNotFoundException;
import org.example.travellguide.model.Guide;
import org.example.travellguide.model.Tour;
import org.example.travellguide.model.TourImage;
import org.example.travellguide.repository.BookingRepository;
import org.example.travellguide.repository.GuideRepository;
import org.example.travellguide.repository.ReviewRepository;
import org.example.travellguide.repository.TourRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/tours")
@CrossOrigin(origins = "http://localhost:5173")
public class TourController {

    private final TourRepository tourRepository;
    private final GuideRepository guideRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    public TourController(TourRepository tourRepository,
                          GuideRepository guideRepository,
                          BookingRepository bookingRepository,
                          ReviewRepository reviewRepository) {
        this.tourRepository = tourRepository;
        this.guideRepository = guideRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
    }

    @GetMapping
    public ResponseEntity<List<Tour>> getAllTours() {
        return ResponseEntity.ok(tourRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> getTourById(@PathVariable Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour with id " + id + " not found"));
        return ResponseEntity.ok(tour);
    }

    @PostMapping
    public ResponseEntity<Tour> createTour(@RequestBody TourRequest request) {
        Guide guide = guideRepository.findById(request.getGuideId())
                .orElseThrow(() -> new ResourceNotFoundException("Guide with id " + request.getGuideId() + " not found"));

        Tour tour = new Tour();
        applyTourFields(tour, request, guide);

        Tour savedTour = tourRepository.save(tour);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTour);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tour> updateTour(@PathVariable Long id, @RequestBody TourRequest request) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour with id " + id + " not found"));

        Guide guide = guideRepository.findById(request.getGuideId())
                .orElseThrow(() -> new ResourceNotFoundException("Guide with id " + request.getGuideId() + " not found"));

        applyTourFields(tour, request, guide);

        Tour savedTour = tourRepository.save(tour);
        return ResponseEntity.ok(savedTour);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour with id " + id + " not found"));

        if (bookingRepository.existsByTourId(id)) {
            throw new BadRequestException("Cannot delete tour with id " + id + " because it is used in bookings");
        }

        if (reviewRepository.existsByTourId(id)) {
            throw new BadRequestException("Cannot delete tour with id " + id + " because it is used in reviews");
        }

        tourRepository.delete(tour);
        return ResponseEntity.noContent().build();
    }

    private void applyTourFields(Tour tour, TourRequest request, Guide guide) {
        tour.setTitle(request.getTitle());
        tour.setDestination(request.getDestination());
        tour.setPrice(request.getPrice());
        tour.setDurationDays(request.getDurationDays());
        tour.setGuide(guide);

        tour.setDescription(request.getDescription());
        tour.setHotelName(request.getHotelName());
        tour.setFoodType(request.getFoodType());
        tour.setRating(request.getRating());
        tour.setAvailablePlaces(request.getAvailablePlaces());
        tour.setPricePerDay(request.getPricePerDay());

        List<TourImage> images = new ArrayList<>();
        if (request.getImageUrls() != null) {
            for (String url : request.getImageUrls()) {
                if (url != null && !url.isBlank()) {
                    TourImage image = new TourImage();
                    image.setUrl(url.trim());
                    images.add(image);
                }
            }
        }
        tour.setImages(images);

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            tour.setImageUrl(request.getImageUrls().get(0));
        } else {
            tour.setImageUrl(request.getImageUrl());
        }
    }
}