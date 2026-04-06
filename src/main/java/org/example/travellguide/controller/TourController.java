package org.example.travellguide.controller;

import org.example.travellguide.model.Guide;
import org.example.travellguide.model.Tour;
import org.example.travellguide.repository.GuideRepository;
import org.example.travellguide.repository.TourRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tours")
public class TourController {

    private final TourRepository tourRepository;
    private final GuideRepository guideRepository;

    public TourController(TourRepository tourRepository, GuideRepository guideRepository) {
        this.tourRepository = tourRepository;
        this.guideRepository = guideRepository;
    }

    @GetMapping
    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    @GetMapping("/{id}")
    public Tour getTourById(@PathVariable Long id) {
        return tourRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Tour createTour(@RequestBody TourRequest request) {
        Guide guide = guideRepository.findById(request.getGuideId()).orElseThrow();

        Tour tour = new Tour();
        tour.setTitle(request.getTitle());
        tour.setDestination(request.getDestination());
        tour.setPrice(request.getPrice());
        tour.setDurationDays(request.getDurationDays());
        tour.setGuide(guide);

        return tourRepository.save(tour);
    }

    @PutMapping("/{id}")
    public Tour updateTour(@PathVariable Long id, @RequestBody TourRequest request) {
        Tour tour = tourRepository.findById(id).orElseThrow();
        Guide guide = guideRepository.findById(request.getGuideId()).orElseThrow();

        tour.setTitle(request.getTitle());
        tour.setDestination(request.getDestination());
        tour.setPrice(request.getPrice());
        tour.setDurationDays(request.getDurationDays());
        tour.setGuide(guide);

        return tourRepository.save(tour);
    }

    @DeleteMapping("/{id}")
    public String deleteTour(@PathVariable Long id) {
        tourRepository.deleteById(id);
        return "Tour deleted successfully";
    }

    public static class TourRequest {
        private String title;
        private String destination;
        private double price;
        private int durationDays;
        private Long guideId;

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDestination() {
            return destination;
        }

        public void setDestination(String destination) {
            this.destination = destination;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }

        public int getDurationDays() {
            return durationDays;
        }

        public void setDurationDays(int durationDays) {
            this.durationDays = durationDays;
        }

        public Long getGuideId() {
            return guideId;
        }

        public void setGuideId(Long guideId) {
            this.guideId = guideId;
        }
    }
}