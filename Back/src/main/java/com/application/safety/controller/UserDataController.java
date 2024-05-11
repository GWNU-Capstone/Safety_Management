package com.application.safety.controller;

import com.application.safety.dto.UserDataDTO;
import com.application.safety.entity.UserData;
import com.application.safety.service.MessageService;
import com.application.safety.service.UserDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
public class UserDataController {
    private final UserDataService userDataService;
    private final MessageService messageService;

    // 근로자 데이터 조회
    @GetMapping("/user/data")
    public ResponseEntity<Map<String, Object>> getUserDataList() {
        return ResponseEntity.ok().body(userDataService.getUserDataList());
    }

    // 출근 기록 요청
    @PostMapping("/user/go")
    public ResponseEntity<UserData> userGoToWork(@RequestBody UserDataDTO userDataDTO) {

        UserData userData = userDataService.addUserData(userDataDTO);
        messageService.sendSMS("출근", userDataDTO.getUserNo());

        return ResponseEntity.ok(userData);
    }
}
