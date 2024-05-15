package com.application.safety.controller;

import com.application.safety.dto.UserDataDTO;
import com.application.safety.entity.UserData;
import com.application.safety.entity.UserProfile;
import com.application.safety.service.MessageService;
import com.application.safety.service.UserDataService;
import com.application.safety.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;


@RestController
@RequiredArgsConstructor
public class UserDataController {
    private final UserProfileService userProfileService;
    private final UserDataService userDataService;
    private final MessageService messageService;

    // 근로자 데이터 조회
    @GetMapping("/user/data/{user_no}")
    public ResponseEntity<Map<Integer, Object>> getUserDataList(@PathVariable("user_no") int user_no) {
        Optional<UserProfile> userProfile = userProfileService.getUserProfile(user_no);
        return ResponseEntity.ok().body(userDataService.getUserDataList(userProfile));
    }

    // 출근 기록 요청
    @PostMapping("/user/go")
    public ResponseEntity<UserData> userGoToWork(@RequestBody UserDataDTO userDataDTO) {

        UserData userData = userDataService.addUserData(userDataDTO);
        messageService.sendSMS("출근", userDataDTO.getUserNo());

        return ResponseEntity.ok(userData);
    }
}
