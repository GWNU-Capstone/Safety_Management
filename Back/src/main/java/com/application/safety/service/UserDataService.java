package com.application.safety.service;

import com.application.safety.dto.UserDataDTO;
import com.application.safety.entity.UserData;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.UserDataRepository;
import com.application.safety.repository.UserProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDataService {
    private final UserDataRepository userDataRepository;
    private final UserProfileRepository userProfileRepository;

    // 출력할 데이터 날짜, 출근 시간, 퇴근 시간, 알콜올 농도, 체온, 심박수, 산소포화도, 상태
    @Transactional(readOnly = true)
    public Map<Integer, Object> getUserDataList(Optional<UserProfile> userProfile) {
        Map<Integer, Object> userDataList = new HashMap<>();

        List<UserData> userDataAll = userDataRepository.findByUserProfile(userProfile);

        for(UserData userData : userDataAll) {
            Map<String, Object> response = new HashMap<>();
            String state;

            UserDataDTO dto = new UserDataDTO();
            dto.setDate(userData.getDate());
            dto.setUserStart(userData.getUserStart());
            dto.setUserDrink(userData.getUserDrink());
            dto.setUserTemp(userData.getUserTemp());
            dto.setUserHeartRate(userData.getUserHeartRate());
            dto.setUserOxygen(userData.getUserOxygen());

            if(userData.getUserEnd() == null) {
                dto.setUserEnd(LocalTime.of(0,0,0));
                state = "출근";
            }
            else {
                dto.setUserEnd(userData.getUserEnd());
                state = "퇴근";
            }

            response.put("userData", dto);
            response.put("state", state);

            userDataList.put(userData.getUserDataNo(),response);
        }

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

    // Today 출근자 수, 결근자 수, 목록
    public Map<String, Object> getTodayUserStatus() {
        List<UserProfile> allUsers = userProfileRepository.findAll();
        // 전체 사용자 수 totalUsers
        int totalUsers = allUsers.size();

        LocalDate today = LocalDate.now();

        // 출근자 목록
        List<UserProfile> presentUsers = userDataRepository.findAll().stream()
                .filter(userData -> userData.getUserStart() != null && userData.getDate().isEqual(today))
                .map(UserData::getUserProfile)
                .distinct()
                .collect(Collectors.toList());

        // 출근자 수
        int presentCount = presentUsers.size();
        // 결근자 수 -> 전체 사용자 - 출근자 수
        int absentCount = totalUsers - presentCount;

        // 결근자 목록
        List<UserProfile> absentUsers = allUsers.stream()
                .filter(user -> presentUsers.stream()
                        .noneMatch(presentUser -> presentUser.getUserNo() == user.getUserNo()))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("presentCount", presentCount);
        response.put("absentCount", absentCount);
        response.put("presentUsers", presentUsers);
        response.put("absentUsers", absentUsers);

        return response;
    }

    // 알코올 이상자 수, 목록
    public Map<String, Object> getAlcoholAbusers() {
        // 알코올 이상자 목록
        List<UserProfile> alcoholAbusers = userDataRepository.findAll().stream()
                .filter(userData -> userData.getUserDrink() >= 0.03)
                .map(UserData::getUserProfile)
                .distinct()
                .collect(Collectors.toList());

        // 알코올 이상자 수
        int alcoholAbuserCount = alcoholAbusers.size();

        Map<String, Object> response = new HashMap<>();
        response.put("alcoholAbuserCount", alcoholAbuserCount);
        response.put("alcoholAbusers", alcoholAbusers);

        return response;
    }


    // 근로자 측정값의 평균 수치 (체온, 심박수, 산소포화도)
    public Map<String, Double> getTodayUserAverages() {
        LocalDate today = LocalDate.now();

        List<UserData> todayUserData = userDataRepository.findAll().stream()
                .filter(userData -> userData.getDate().isEqual(today))
                .toList();

        OptionalDouble averageHeartRate = todayUserData.stream()
                .mapToInt(UserData::getUserHeartRate)
                .average();

        OptionalDouble averageTemp = todayUserData.stream()
                .mapToDouble(UserData::getUserTemp)
                .average();

        OptionalDouble averageOxygen = todayUserData.stream()
                .mapToInt(UserData::getUserOxygen)
                .average();

        Map<String, Double> averages = new HashMap<>();
        averages.put("averageHeartRate", FirstDecimal(averageHeartRate.isPresent() ? averageHeartRate.getAsDouble() : 0.0));
        averages.put("averageTemp", FirstDecimal(averageTemp.isPresent() ? averageTemp.getAsDouble() : 0.0));
        averages.put("averageOxygen", FirstDecimal(averageOxygen.isPresent() ? averageOxygen.getAsDouble() : 0.0));

        return averages;
    }

    // 평균값 소수 첫째짜리까지만 출력
    private double FirstDecimal(double value) {
        return Math.round(value * 10) / 10.0;
    }


}
