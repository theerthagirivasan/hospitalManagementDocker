package com.hospital.management.models;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "appointments")
public class Appointment {
    
    @Id
    private String id;
    
    private String patientId;
    
    private String doctorId;
    
    private LocalDate appointmentDate;
    
    private LocalTime startTime;
    
    private LocalTime endTime;
    
    private AppointmentStatus status = AppointmentStatus.BOOKED;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
