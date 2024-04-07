package com.application.safety.controller;

import com.application.safety.dto.UserInfoDTO;
import com.application.safety.dto.UserProfileDTO;
import com.application.safety.entity.UserInfo;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.UserInfoRepository;
import com.application.safety.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class MemberController {
    private final UserProfileRepository userProfileRepository;
    private final UserInfoRepository userInfoRepository;

    @GetMapping("/members/{user_no}")
    public ResponseEntity<Map<String, Object>> getUserData(@PathVariable("user_no") int user_no) {

        // 사원 번호, 사용자 이름 DTO
        UserProfile userProfile = userProfileRepository.findById(user_no).orElseThrow();
        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setUserNoPk(userProfile.getUserNo());
        userProfileDTO.setUserName(userProfile.getUserName());

        // 사용자 사진 DTO
        UserInfo userInfo = userInfoRepository.findById(user_no).orElseThrow();
        UserInfoDTO userInfoDTO = new UserInfoDTO();
        userInfoDTO.setUserImage(userInfo.getUserImage());

        // Map 활용으로 2개 DTO 합쳐서 반환
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("userProfile", userProfileDTO);
        responseData.put("UserInfo", userInfoDTO);

        return ResponseEntity.ok().body(responseData);
    }
}

