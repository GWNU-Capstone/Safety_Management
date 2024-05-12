package com.application.safety.service;

import com.application.safety.dto.UserDataDTO;
import com.application.safety.entity.UserData;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.UserDataRepository;
import com.application.safety.repository.UserProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDataService {
    private final UserDataRepository userDataRepository;
    private final UserProfileRepository userProfileRepository;

    // 출력할 데이터 날짜, 출근 시간, 퇴근 시간, 알콜올 농도, 체온, 심박수, 산소포화도, 상태
    public List<Map<String, Object>> getUserDataList() {
        List<Map> userDataList = new ArrayList<>();

        List<UserData> userDataAll = userDataRepository.findAll();

        userDataAll.stream().map(userData -> {
            Map<String, Object> response = new HashMap<>();

            UserDataDTO dto = new UserDataDTO();
            dto.setDate(userData.getDate());
            dto.setUserStart(userData.getUserStart());
            dto.setUserEnd(userData.getUserEnd());
            dto.setUserDrink(userData.getUserDrink());
            dto.setUserTemp(userData.getUserTemp());
            dto.setUserHeartRate(userData.getUserHeartRate());
            dto.setUserOxygen(userData.getUserOxygen());

            response.put("userData", dto);

            if(userData.getUserEnd() == null)
                response.put("state", "출근");
            else
                response.put("state", "퇴근");

            userDataList.add(response);
        });

        return userDataList;
    }

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
