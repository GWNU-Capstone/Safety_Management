package com.application.safety.repository;

import com.application.safety.entity.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
@Repository
public interface UserDataRepository extends JpaRepository<UserData, Integer> {


=======
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserDataRepository extends JpaRepository<UserData, Integer> {
    Optional<UserData> findByUserProfileAndDate(UserProfile userProfile, LocalDate date);

    void deleteByUserProfile(UserProfile userProfile);

    List<UserData> findByUserProfile(Optional<UserProfile> userProfile);
>>>>>>> c4ad9b752471d9e2712faeea09d239ecde3a3be3
}
