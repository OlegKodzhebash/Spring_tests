package org.example.travellguide.controller;

import jakarta.servlet.http.HttpSession;
import org.example.travellguide.dto.LoginRequest;
import org.example.travellguide.dto.RegisterRequest;
import org.example.travellguide.dto.UserResponse;
import org.example.travellguide.exception.BadRequestException;
import org.example.travellguide.exception.ResourceNotFoundException;
import org.example.travellguide.model.AppUser;
import org.example.travellguide.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final String SESSION_USER_ID = "USER_ID";

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request, HttpSession session) {
        if (request.getLogin() == null || request.getLogin().isBlank()) {
            throw new BadRequestException("Login is required");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password is required");
        }

        if (request.getPhone() == null || request.getPhone().isBlank()) {
            throw new BadRequestException("Phone is required");
        }

        if (appUserRepository.existsByLogin(request.getLogin())) {
            throw new BadRequestException("Login already exists");
        }

        if (appUserRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone already exists");
        }

        AppUser user = new AppUser();
        user.setLogin(request.getLogin());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        AppUser savedUser = appUserRepository.save(user);

        session.setAttribute(SESSION_USER_ID, savedUser.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(new UserResponse(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request, HttpSession session) {
        AppUser user = appUserRepository.findByLogin(request.getLogin())
                .orElseThrow(() -> new BadRequestException("Invalid login or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid login or password");
        }

        session.setAttribute(SESSION_USER_ID, user.getId());

        return ResponseEntity.ok(new UserResponse(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(HttpSession session) {
        Object userIdObj = session.getAttribute(SESSION_USER_ID);

        if (userIdObj == null) {
            throw new ResourceNotFoundException("User is not authenticated");
        }

        Long userId = ((Number) userIdObj).longValue();

        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return ResponseEntity.ok(new UserResponse(user));
    }
}