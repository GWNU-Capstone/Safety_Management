package com.application.safety.service;

import com.application.safety.dto.UserInfoDTO;
import com.application.safety.dto.UserProfileDTO;
import com.application.safety.entity.UserData;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.UserDataRepository;
import com.application.safety.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserProfileRepository userProfileRepository;
    private final UserDataRepository userDataRepository;
    private final UserInfoService userInfoService;
    private final MessageService messageService;

    // UserProfile DTO
    public UserProfileDTO getProfile(int user_no) {
        UserProfile userProfile = userProfileRepository.findById(user_no).orElseThrow();

        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setUserNo(userProfile.getUserNo());
        userProfileDTO.setUserName(userProfile.getUserName());

        return userProfileDTO;
    }

    // 출퇴근 검사
    public Map<String, Object> getWorkState(int user_no) {

        // 사원 번호, 사용자 이름 DTO
        UserProfileDTO userProfileDTO = getProfile(user_no);
        // 사용자 사진 DTO
        UserInfoDTO userInfoDTO = userInfoService.getInfo(user_no);

        // 응답 객체 생성
        Map<String, Object> responseData = new HashMap<>();

        // 오늘 날짜 [출근 O 퇴근 X : 퇴근 기록 후 코드 반환] [출근 O 퇴근 O : 퇴근 완료 코드 반환]
        // 현재 한국 시간
        LocalDate nowDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
        UserProfile userProfile = userProfileRepository.findById(user_no).orElseThrow();
        Optional<UserData> optionalUserData = userDataRepository.findByUserProfileAndDate(userProfile, nowDate);

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

                // 퇴근 문자 전송
                messageService.sendSMS("퇴근", user_no);

                responseData.put("code", 101);
                responseData.put("userEnd", userData.getUserEnd());
                return responseData;
            }
            else {
                // 퇴근 이후 이므로, 퇴근 처리가 이미 되었다는 신호 전달
                responseData.put("code", 102);
                return responseData;
            }
        }

        // Map 활용으로 2개 DTO 합쳐서 반환
        responseData.put("code", 103);
        responseData.put("userProfile", userProfileDTO);
        responseData.put("UserInfo", userInfoDTO);

        return responseData;
    }
}
