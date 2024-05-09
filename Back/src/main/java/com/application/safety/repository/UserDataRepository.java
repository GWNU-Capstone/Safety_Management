package com.application.safety.repository;

import com.application.safety.entity.UserData;
import com.application.safety.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface UserDataRepository extends JpaRepository<UserData, Integer> {
    Optional<UserData> findByUserProfileAndDate(UserProfile userProfile, LocalDate date);
    void deleteByUserProfile(UserProfile userProfile);
}
