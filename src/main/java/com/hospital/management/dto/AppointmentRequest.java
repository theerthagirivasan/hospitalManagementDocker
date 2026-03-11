package com.hospital.management.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AppointmentRequest {
    
    @NotNull
    private String doctorId;
    
    @NotNull
    private LocalDate appointmentDate;
    
    @NotNull
    private LocalTime startTime;
    
    @NotNull
    private LocalTime endTime;
}
