package com.hospital.management.services;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

import com.hospital.management.dto.AppointmentsPerDoctorDTO;
import com.hospital.management.models.Appointment;
import com.hospital.management.models.User;
import com.hospital.management.repositories.UserRepository;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
public class AggregationService {

    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private UserRepository userRepository;

    public List<AppointmentsPerDoctorDTO> getAppointmentsPerDoctor() {
        Aggregation agg = newAggregation(
            group("doctorId").count().as("appointmentCount"),
            project("appointmentCount").and("doctorId").previousOperation()
        );

        AggregationResults<AppointmentsPerDoctorDTO> results = mongoTemplate.aggregate(agg, Appointment.class, AppointmentsPerDoctorDTO.class);
        List<AppointmentsPerDoctorDTO> dtoList = results.getMappedResults();
        
        // Enrich with doctor names
        List<String> doctorIds = dtoList.stream().map(AppointmentsPerDoctorDTO::getDoctorId).collect(Collectors.toList());
        List<User> doctors = (List<User>) userRepository.findAllById(doctorIds);
        Map<String, String> doctorNameMap = doctors.stream().collect(Collectors.toMap(User::getId, User::getName));
        
        dtoList.forEach(dto -> dto.setDoctorName(doctorNameMap.getOrDefault(dto.getDoctorId(), "Unknown")));
        
        return dtoList;
    }
}
