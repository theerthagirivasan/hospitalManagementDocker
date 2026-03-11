package com.hospital.management.dto;

import lombok.Data;

@Data
public class AppointmentsPerDoctorDTO {
    private String doctorId;
    private String doctorName;
    private long appointmentCount;
}
