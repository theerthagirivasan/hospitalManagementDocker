package com.hospital.management.controllers;

import java.util.List;
import java.util.Optional;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.hospital.management.dto.AppointmentRequest;
import com.hospital.management.dto.MessageResponse;
import com.hospital.management.models.Appointment;
import com.hospital.management.models.AppointmentStatus;
import com.hospital.management.security.UserDetailsImpl;
import com.hospital.management.services.AppointmentService;
import com.hospital.management.repositories.UserRepository;
import com.hospital.management.models.User;
import com.hospital.management.models.Role;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    AppointmentService appointmentService;
    
    @Autowired
    UserRepository userRepository;

    // PATIENT: Book an appointment
    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> bookAppointment(@Valid @RequestBody AppointmentRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Optional<User> doctorOpt = userRepository.findById(request.getDoctorId());
        if(doctorOpt.isEmpty() || doctorOpt.get().getRole() != Role.DOCTOR) {
             return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid Doctor ID"));
        }

        Appointment appointment = new Appointment();
        appointment.setDoctorId(request.getDoctorId());
        appointment.setPatientId(userDetails.getId());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setStartTime(request.getStartTime());
        appointment.setEndTime(request.getEndTime());
        appointment.setStatus(AppointmentStatus.BOOKED);

        try {
            Appointment created = appointmentService.createAppointment(appointment);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    // PATIENT: View their own schedule
    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<Appointment>> getPatientAppointments() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(appointmentService.getAppointmentsForPatient(userDetails.getId()));
    }

    // DOCTOR: View their own schedule
    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<Appointment>> getDoctorAppointments() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(appointmentService.getAppointmentsForDoctor(userDetails.getId()));
    }

    // DOCTOR: Confirm appointment
    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> confirmAppointment(@PathVariable String id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Optional<Appointment> opt = appointmentService.getAppointmentById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        
        Appointment appointment = opt.get();
        if(!appointment.getDoctorId().equals(userDetails.getId())) {
             return ResponseEntity.badRequest().body(new MessageResponse("Error: Not authorized to confirm this appointment"));
        }
        
        appointmentService.updateStatus(appointment, AppointmentStatus.CONFIRMED);
        return ResponseEntity.ok(new MessageResponse("Appointment confirmed successfully."));
    }

    // ADMIN: Cancel appointment
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cancelAppointment(@PathVariable String id) {
        Optional<Appointment> opt = appointmentService.getAppointmentById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        
        Appointment appointment = opt.get();
        appointmentService.updateStatus(appointment, AppointmentStatus.CANCELLED);
        return ResponseEntity.ok(new MessageResponse("Appointment cancelled successfully."));
    }
}
