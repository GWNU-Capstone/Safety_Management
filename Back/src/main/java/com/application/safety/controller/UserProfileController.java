package com.application.safety.controller;

import com.application.safety.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService userProfileService;

    // 지문 인식 요청 API
    @GetMapping("/user/fingerprint/{user_no}")
    public ResponseEntity<Map<String, Object>> getUserFinger(@PathVariable("user_no") int user_no) {
        return ResponseEntity.ok().body(userProfileService.getWorkState(user_no));
    }
}

