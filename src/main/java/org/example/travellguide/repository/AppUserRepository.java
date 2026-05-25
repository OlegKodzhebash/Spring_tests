package org.example.travellguide.repository;

import org.example.travellguide.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    boolean existsByLogin(String login);
    boolean existsByPhone(String phone);
    Optional<AppUser> findByLogin(String login);
}