package com.hospital.management.repositories;

import com.hospital.management.models.User;
import com.hospital.management.models.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
}
