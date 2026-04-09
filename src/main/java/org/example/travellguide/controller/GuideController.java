package org.example.travellguide.controller;

import org.example.travellguide.exception.BadRequestException;
import org.example.travellguide.exception.ResourceNotFoundException;
import org.example.travellguide.model.Guide;
import org.example.travellguide.repository.GuideRepository;
import org.example.travellguide.repository.TourRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/guides")
@CrossOrigin(origins = "http://localhost:5173")
public class GuideController {

    private final GuideRepository guideRepository;
    private final TourRepository tourRepository;

    public GuideController(GuideRepository guideRepository, TourRepository tourRepository) {
        this.guideRepository = guideRepository;
        this.tourRepository = tourRepository;
    }

    @GetMapping
    public ResponseEntity<List<Guide>> getAllGuides() {
        return ResponseEntity.ok(guideRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Guide> getGuideById(@PathVariable Long id) {
        Guide guide = guideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guide with id " + id + " not found"));
        return ResponseEntity.ok(guide);
    }

    @PostMapping
    public ResponseEntity<Guide> createGuide(@RequestBody Guide guide) {
        Guide savedGuide = guideRepository.save(guide);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedGuide);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Guide> updateGuide(@PathVariable Long id, @RequestBody Guide updatedGuide) {
        Guide guide = guideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guide with id " + id + " not found"));

        guide.setName(updatedGuide.getName());
        guide.setLanguage(updatedGuide.getLanguage());
        guide.setExperienceYears(updatedGuide.getExperienceYears());

        Guide savedGuide = guideRepository.save(guide);
        return ResponseEntity.ok(savedGuide);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuide(@PathVariable Long id) {
        Guide guide = guideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guide with id " + id + " not found"));

        if (tourRepository.existsByGuideId(id)) {
            throw new BadRequestException("Cannot delete guide with id " + id + " because it is used in tours");
        }

        guideRepository.delete(guide);
        return ResponseEntity.noContent().build();
    }
}