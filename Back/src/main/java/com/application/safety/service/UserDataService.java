package com.application.safety.service;

import com.application.safety.dto.UserDataDTO;
import com.application.safety.entity.UserData;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.UserDataRepository;
import com.application.safety.repository.UserProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
@Service
@RequiredArgsConstructor
public class UserDataService {
    private final UserDataRepository userDataRepository;
    private final UserProfileRepository userProfileRepository;

    public UserData userDataStart(UserDataDTO userDataDTO) {
        // 요청의 userNo 번호를 토대로 UserProfile 에서 사용자 정보 탐색
        UserProfile userProfile = userProfileRepository.findById(userDataDTO.getUserNo())
                .orElseThrow(() -> new EntityNotFoundException("Not Found UserProfile"));


        ZoneId seoulTimeZone = ZoneId.of("Asia/Seoul");
        LocalDate currentDate = LocalDate.now(seoulTimeZone);
        LocalTime currentTime = LocalTime.now(seoulTimeZone);


        UserData userData = userDataDTO.toEntity();
        userData.setUserProfile(userProfile);

        userData.setDate(currentDate);
        userData.setUserStart(currentTime);

        userDataRepository.save(userData);

        return userData;
    }
}
