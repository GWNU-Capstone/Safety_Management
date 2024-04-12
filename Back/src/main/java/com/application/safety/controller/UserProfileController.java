package com.application.safety.controller;

import com.application.safety.dto.UserInfoDTO;
import com.application.safety.dto.UserProfileDTO;
import com.application.safety.entity.UserData;
import com.application.safety.entity.UserInfo;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.UserDataRepository;
import com.application.safety.repository.UserInfoRepository;
import com.application.safety.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileRepository userProfileRepository;
    private final UserInfoRepository userInfoRepository;
    private final UserDataRepository userDataRepository;
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

        Map<String, Object> responseData = new HashMap<>();

        // 사원 번호, 사용자 이름 DTO
        UserProfile userProfile = userProfileRepository.findById(user_no).orElseThrow();
        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setUserNo(userProfile.getUserNo());
        userProfileDTO.setUserName(userProfile.getUserName());

        // 오늘 날짜 [출근 O 퇴근 X : 퇴근 기록 후 코드 반환] [출근 O 퇴근 O : 퇴근 완료 코드 반환]
        // 현재 한국 시간
        LocalDate nowDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
        Optional<UserData> optionalUserData = userDataRepository.findByUserProfileAndDate(userProfile , nowDate);

        // 오늘 날짜 기준으로 해당 지문의 사람의 출퇴근 기록 조회.
        if(optionalUserData.isPresent()) {
            UserData userData = optionalUserData.get();

            // 출근은 했으나, 퇴근 여부 확인
            if (userData.getUserEnd() == null) {
                // 아직 퇴근 전 이므로, 요청 시간을 기준으로 퇴근 기록 설정.
                LocalTime now = LocalTime.now();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
                String formatedNow = now.format(formatter);
                userData.setUserEnd(LocalTime.parse(formatedNow));
                userDataRepository.save(userData);

                responseData.put("code", 101);
                responseData.put("userEnd", userData.getUserEnd());
                return ResponseEntity.ok().body(responseData);
            }
            else {
                // 퇴근 이후 이므로, 퇴근 처리가 이미 되었다는 신호 전달
                responseData.put("code", 102);
                return ResponseEntity.ok().body(responseData);
            }
        }

        // 사용자 사진 DTO
        UserInfo userInfo = userInfoRepository.findById(user_no).orElseThrow();
        UserInfoDTO userInfoDTO = new UserInfoDTO();
        userInfoDTO.setUserImage(userInfo.getUserImage());

        // Map 활용으로 2개 DTO 합쳐서 반환
        responseData.put("code", 103);
        responseData.put("userProfile", userProfileDTO);
        responseData.put("UserInfo", userInfoDTO);

        return ResponseEntity.ok().body(responseData);
    }
}

