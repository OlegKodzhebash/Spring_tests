package org.example.travellguide.controller;

import org.example.travellguide.model.Guide;
import org.example.travellguide.repository.GuideRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/guides")
public class GuideController {

    private final GuideRepository guideRepository;

    public GuideController(GuideRepository guideRepository) {
        this.guideRepository = guideRepository;
    }

    @GetMapping
    public List<Guide> getAllGuides() {
        return guideRepository.findAll();
    }

    @GetMapping("/{id}")
    public Guide getGuideById(@PathVariable Long id) {
        return guideRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Guide createGuide(@RequestBody Guide guide) {
        return guideRepository.save(guide);
    }

    @PutMapping("/{id}")
    public Guide updateGuide(@PathVariable Long id, @RequestBody Guide updatedGuide) {
        Guide guide = guideRepository.findById(id).orElseThrow();

        guide.setName(updatedGuide.getName());
        guide.setLanguage(updatedGuide.getLanguage());
        guide.setExperienceYears(updatedGuide.getExperienceYears());

        return guideRepository.save(guide);
    }

    @DeleteMapping("/{id}")
    public String deleteGuide(@PathVariable Long id) {
        guideRepository.deleteById(id);
        return "Guide deleted successfully";
    }
}