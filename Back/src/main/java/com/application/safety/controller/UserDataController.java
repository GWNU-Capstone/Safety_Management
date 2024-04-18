package com.application.safety.controller;

import com.application.safety.dto.UserDataDTO;
import com.application.safety.entity.UserData;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.UserDataRepository;
import com.application.safety.repository.UserProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserDataController {
    private final UserDataRepository userDataRepository;
    private final UserProfileRepository userProfileRepository;

    // 출근 기록 요청
    /*
    {
        "userNo": 1,
        "userDrink" : 0.05,
        "userHeartRate": 69,
        "userTemp": 29.8,
    }
    위와 같은 요청이 Front 에서 전달해서 올 예정입니다.
    여기에 date, userStart 의 값을 요청 기준으로 값을 삽입해서 데이터 베이스에 넣어주시면 됩니다.
    */
    @PostMapping("/user/go")
    public ResponseEntity<UserData> userGoToWork(@RequestBody UserDataDTO userDataDTO) {
        // 요청의 userNo 번호를 토대로 UserProfile 에서 사용자 정보 탐색
        UserProfile userProfile = userProfileRepository.findById(userDataDTO.getUserNo()).orElseThrow(() -> new EntityNotFoundException("Not Found UserProfile"));

        // DTO -> 변환 -> 객체 및 객체의 UserProfile 설정
        UserData userData = userDataDTO.toEntity();
        userData.setUserProfile(userProfile);

        userDataRepository.save(userData);

        return ResponseEntity.ok(userData);
    }
}
