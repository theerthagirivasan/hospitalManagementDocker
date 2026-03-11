package com.hospital.management.models;

import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlot {
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
}
