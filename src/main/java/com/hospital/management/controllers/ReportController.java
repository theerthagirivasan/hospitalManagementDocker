package com.hospital.management.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.AppointmentsPerDoctorDTO;
import com.hospital.management.services.AggregationService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private AggregationService aggregationService;

    @GetMapping("/appointments-per-doctor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentsPerDoctorDTO>> getAppointmentsPerDoctor() {
        return ResponseEntity.ok(aggregationService.getAppointmentsPerDoctor());
    }
    
    // Additional aggregations like revenue per department can be added here
}
