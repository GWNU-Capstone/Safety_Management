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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileRepository userProfileRepository;
    private final UserInfoRepository userInfoRepository;
    private final WebClient webClient;

    // 지문 인식 요청 API
    @GetMapping("/user/fingerprint")
    public ResponseEntity<Map<String, Object>> getUserFinger() {
        // 아두이노, 라즈베리파이의 서버로 지문 인식 센서 요청
        UserProfileDTO DTO =
                webClient.get()
                        .uri("/finger")
                        .retrieve()
                        .bodyToMono(UserProfileDTO.class)
                        .timeout(Duration.ofSeconds(5))
                        .block();

        // 에러 처리를 다음과 같이 해두었지만,
        // 나중에 지문 인식 센서에서 잘못된 지문이 입력되었을 때,
        // 반환 되는 값을 보고 프론트로 잘못된 지문이 입력되었다는 걸
        // 화면에 출력 되도록 해야함.
        // 그 이후 프론트에서는 재측정을 요구하는 화면과 재요청 시행.
        int user_no = DTO != null ? DTO.getUserNo() : 0;

        // 사원 번호, 사용자 이름 DTO
        UserProfile userProfile = userProfileRepository.findById(user_no).orElseThrow();
        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setUserNo(userProfile.getUserNo());
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

