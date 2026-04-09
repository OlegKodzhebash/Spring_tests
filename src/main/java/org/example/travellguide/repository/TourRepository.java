package org.example.travellguide.repository;

import org.example.travellguide.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourRepository extends JpaRepository<Tour, Long> {
    boolean existsByGuideId(Long guideId);
}