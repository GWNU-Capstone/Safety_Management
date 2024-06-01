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

    // Today 출근자,결근자 수, 목록
    @GetMapping("/today/user-status")
    public Map<String, Object> getTodayUserCountsAndList() {
        return userDataService.getTodayUserStatus();
    }

    // 근로자 알코올 이상자 수, 목록
    @GetMapping("/today/alcohol-abusers")
    public Map<String, Object> getAlcoholAbusers() {
        return userDataService.getAlcoholAbusers();
    }

    // 근로자 평균수치 (체온, 심박수, 산소포화도)
    @GetMapping("/today/data-average")
    public Map<String, Double> getTodayAverages() {
        return userDataService.getTodayUserAverages();
    }

    // 근로자 종합데이터 상태(정상, 주의, 심각)인원, 세부정보
    @GetMapping("/today/user-health-status")
    public Map<String, Object> getTodayUserHealthStatus() {
        return userDataService.getTodayUserHealthStatus();
    }

    // 전날 평균 근로시간
    @GetMapping("/yesterday/average-worktime")
    public Map<String, Object> getYesterdayAverageWorkTime() {
        return userDataService.getYesterdayAverageWorkTime();
    }
}
