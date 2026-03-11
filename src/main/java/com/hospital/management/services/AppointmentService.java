package com.hospital.management.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.management.models.Appointment;
import com.hospital.management.models.AppointmentStatus;
import com.hospital.management.repositories.AppointmentRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public boolean hasOverlap(String doctorId, String patientId, Appointment newAppointment) {
        // Business Rules:
        // - Cannot book overlapping time slots for the same doctor
        // - Patient cannot book multiple appointments at the same time
        
        List<Appointment> doctorAppointments = appointmentRepository.findByDoctorId(doctorId);
        List<Appointment> patientAppointments = appointmentRepository.findByPatientId(patientId);

        // Check Doctor Overlap
        boolean doctorOverlap = doctorAppointments.stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
                .filter(a -> a.getAppointmentDate().equals(newAppointment.getAppointmentDate()))
                .anyMatch(a -> isTimeOverlapping(a, newAppointment));
                
        if (doctorOverlap) return true;

        // Check Patient Overlap
        boolean patientOverlap = patientAppointments.stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
                .filter(a -> a.getAppointmentDate().equals(newAppointment.getAppointmentDate()))
                .anyMatch(a -> isTimeOverlapping(a, newAppointment));

        return patientOverlap;
    }

    private boolean isTimeOverlapping(Appointment existing, Appointment newAppt) {
        return newAppt.getStartTime().isBefore(existing.getEndTime()) && 
               newAppt.getEndTime().isAfter(existing.getStartTime());
    }

    public Appointment createAppointment(Appointment appointment) throws Exception {
        if (hasOverlap(appointment.getDoctorId(), appointment.getPatientId(), appointment)) {
            throw new Exception("Time slot is overlapping with an existing appointment.");
        }
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsForPatient(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsForDoctor(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public Optional<Appointment> getAppointmentById(String id) {
        return appointmentRepository.findById(id);
    }
    
    public Appointment updateStatus(Appointment appointment, AppointmentStatus status) {
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }
}
