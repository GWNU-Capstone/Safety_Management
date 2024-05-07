package com.application.safety.service;

import com.application.safety.dto.UserDataDTO;
import com.application.safety.entity.UserData;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.UserDataRepository;
import com.application.safety.repository.UserProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class UserDataService {
    private final UserDataRepository userDataRepository;
    private final UserProfileRepository userProfileRepository;

    @Transactional
    public UserData addUserData(UserDataDTO userDataDTO) {
        // 요청의 userNo 번호를 토대로 UserProfile 에서 사용자 정보 탐색
        UserProfile userProfile = userProfileRepository.findById(userDataDTO.getUserNo())
                .orElseThrow(() -> new EntityNotFoundException("[UserDataService] Not Found UserProfile : " + userDataDTO.getUserNo()));

        //시간,날짜
        ZoneId seoulTimeZone = ZoneId.of("Asia/Seoul");
        LocalDate currentDate = LocalDate.now(seoulTimeZone);
        LocalTime currentTime = LocalTime.now(seoulTimeZone);

        // 시간 포맷(HH:mm:ss)
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        String formattedTime = currentTime.format(timeFormatter);

        UserData userData = userDataDTO.toEntity();
        userData.setUserProfile(userProfile);

        // 요청 일자, 시간 설정
        userData.setDate(currentDate);
        userData.setUserStart(LocalTime.parse(formattedTime));

        // 데이터 저장
        userDataRepository.save(userData);

        return userData;
    }
}
