package com.hospital.management.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.models.Role;
import com.hospital.management.models.User;
import com.hospital.management.repositories.UserRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/doctors")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public ResponseEntity<List<User>> getDoctors() {
        List<User> doctors = userRepository.findByRole(Role.DOCTOR);
        // Do not return passwords in production, we could map to a DTO here
        doctors.forEach(d -> d.setPassword(null));
        return ResponseEntity.ok(doctors);
    }
}
