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

import java.time.Duration;
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

    /**
     * 사원 상세 조회 - 우측 화면에 사용되는 메서드
     * 출력할 데이터는 날짜, 출근 시간, 퇴근 시간, 알콜 농도, 체온, 심박수, 산소포화도, 상태를 포함
     *
     * @param userProfile 사용자의 프로필 정보
     * @return 데이터 번호를 기준으로 해당 데이터 Map
     */
    @Transactional(readOnly = true)
    public Map<Integer, Object> getUserDataList(Optional<UserProfile> userProfile) {
        Map<Integer, Object> userDataList = new HashMap<>();

        List<UserData> userDataAll = userDataRepository.findByUserProfile(userProfile);

        for (UserData userData : userDataAll) {
            Map<String, Object> response = new HashMap<>();
            String state;

            UserDataDTO dto = new UserDataDTO();
            dto.setDate(userData.getDate());
            dto.setUserStart(userData.getUserStart());
            dto.setUserDrink(userData.getUserDrink());
            dto.setUserTemp(userData.getUserTemp());
            dto.setUserHeartRate(userData.getUserHeartRate());
            dto.setUserOxygen(userData.getUserOxygen());

            if (userData.getUserEnd() == null) {
                dto.setUserEnd(LocalTime.of(0, 0, 0));
                state = "출근";
            } else {
                dto.setUserEnd(userData.getUserEnd());
                state = "퇴근";
            }

            response.put("userData", dto);
            response.put("state", state);

            userDataList.put(Math.toIntExact(userData.getUserDataNo()), response);
        }

        return userDataList;
    }

    /**
     * 출근 기록
     * 주어진 사원 데이터 DTO를 기반으로 출근 기록을 수행
     *
     * @param userDataDTO 출근 기록시 필요한 데이터 (출근시간 및 건강 데이터 측정값)
     * @return 추가된 출근 기록을 담고 있는 UserData 객체
     * @throws EntityNotFoundException 주어진 사원 번호에 해당하는 데이터를 찾을 수 없는 경우
     */
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

    /**
     * 출근 현황
     * 오늘의 출근자 수, 결근자 수, 출근자 목록, 퇴근자 목록, 미출근자 목록을 반환
     *
     * @return 위의 데이터가 포함된 Map 객체
     */
    public Map<String, Object> getTodayUserStatus() {
        List<UserProfile> allUsers = userProfileRepository.findAll();

        LocalDate today = LocalDate.now();
        List<UserData> todayUserData = userDataRepository.findByDate(today);

        // 출근자 목록 (userStart만 값 o)
        List<UserProfile> presentUsers = todayUserData.stream()
                .filter(userData -> userData.getUserStart() != null && userData.getUserEnd() == null)
                .map(UserData::getUserProfile)
                .distinct()
                .collect(Collectors.toList());

        // 퇴근자 목록 (userEnd에 값 o)
        List<UserProfile> departedUsers = todayUserData.stream()
                .filter(userData -> userData.getUserStart() != null && userData.getUserEnd() != null)
                .map(UserData::getUserProfile)
                .distinct()
                .collect(Collectors.toList());

        // 미출근자 목록 (userStart, userEnd에 값 x)
        List<UserProfile> yetStartedUsers = allUsers.stream()
                .filter(user -> presentUsers.stream().noneMatch(presentUser -> Objects.equals(presentUser.getUserNo(), user.getUserNo()))
                        && departedUsers.stream().noneMatch(departedUser -> Objects.equals(departedUser.getUserNo(), user.getUserNo())))
                .collect(Collectors.toList());

        int presentCount = presentUsers.size();
        int departedCount = departedUsers.size();
        int yetStartedCount = yetStartedUsers.size();

        Map<String, Object> response = new HashMap<>();
        response.put("presentCount", presentCount);
        response.put("departedCount", departedCount);
        response.put("yetStartedCount", yetStartedCount);

        response.put("presentUsersList", presentUsers);
        response.put("departedUsersList", departedUsers);
        response.put("yetStartedUsersList", yetStartedUsers);

        return response;
    }

    /**
     * 오늘의 근로자 종합데이터를 반환
     * 각 근로자의 상태를 정상, 주의, 심각으로 분류하여 인원 수와 세부 정보를 반환
     *
     * @return 정상, 주의, 심각 상태의 근로자 수와 세부 정보(각 항목의 정상/주의/심각 판별)
     * @throws EntityNotFoundException 사원정보를 찾을 수 없는 경우
     */
    public Map<String, Object> getTodayUserHealthStatus() {
        LocalDate today = LocalDate.now();

        List<UserData> todayUserData = userDataRepository.findByDate(today);

        // 종합상태 카운팅 초기화
        Map<String, Integer> totalResultCount = new HashMap<>();
        totalResultCount.put("정상", 0);
        totalResultCount.put("주의", 0);
        totalResultCount.put("심각", 0);

        // 사용자 데이터 가져오기
        List<Map<String, String>> userStatusList = todayUserData.stream().map(userData -> {
            UserProfile userProfile = userProfileRepository.findById(Math.toIntExact(userData.getUserProfile().getUserNo()))
                    .orElseThrow(() -> new EntityNotFoundException("UserProfile not found for userNo: " + userData.getUserProfile().getUserNo()));

            // 각 항목의 기준 수치대로 상태 판별 결과 저장
            String userDrinkStatus = getUserDrinkStatus(userData.getUserDrink());
            String userOxygenStatus = getUserOxygenStatus(userData.getUserOxygen());
            String userTempStatus = getUserTempStatus(userData.getUserTemp());
            String userHeartRateStatus = getUserHeartRateStatus(userData.getUserHeartRate());

            // 종합 상태 totalResult(정상,주의,심각)에 따라 totalResultCount값 +1
            String totalResult = calculateTotalResult(userDrinkStatus, userOxygenStatus, userTempStatus, userHeartRateStatus);
            totalResultCount.put(totalResult, totalResultCount.get(totalResult) + 1);

            Map<String, String> response = new HashMap<>();
            response.put("userName", userProfile.getUserName());
            response.put("userNo", String.valueOf(userData.getUserProfile().getUserNo()));
            response.put("userDrink", userDrinkStatus);
            response.put("userOxygen", userOxygenStatus);
            response.put("userTemp", userTempStatus);
            response.put("userHeartRate", userHeartRateStatus);
            response.put("totalResult", totalResult);
            return response;

        }).collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("totalResultCount", totalResultCount);
        result.put("userStatusList", userStatusList);

        return result;
    }

    // 알코올 상태 판별
    private String getUserDrinkStatus(float userDrink) {
        if (userDrink >= 0.03f) {
            return "심각";
        }
        return "정상";
    }

    // 산소포화도 상태 판별
    private String getUserOxygenStatus(int userOxygen) {
        if (userOxygen >= 95) return "정상";
        if (userOxygen > 90) return "주의";
        return "심각";
    }

    // 체온 상태 판별
    private static final double EPSILON = 0.0001;

    private boolean isApproximatelyEqual(double a, double b) {
        return Math.abs(a - b) < EPSILON;
    }

    private String getUserTempStatus(float userTemp) {
        if ((userTemp >= 35.1 && userTemp <= 37.2) || isApproximatelyEqual(userTemp, 35.1) || isApproximatelyEqual(userTemp, 37.2)) {
            return "정상";
        } else if ((userTemp >= 37.3 && userTemp <= 38.0) || isApproximatelyEqual(userTemp, 37.3) || isApproximatelyEqual(userTemp, 38.0)) {
            return "주의";
        } else if (userTemp >= 38.1 || isApproximatelyEqual(userTemp, 38.1)) {
            return "심각";
        } else {
            return "심각";
        }
    }

    // 심박수 상태 판별
    private String getUserHeartRateStatus(int userHeartRate) {
        if (userHeartRate >= 60 && userHeartRate <= 100) return "정상";
        if ((userHeartRate >= 50 && userHeartRate < 60) || (userHeartRate > 100 && userHeartRate <= 120)) {
            return "주의";
        }
        return "심각";
    }

    // 종합상태 (정상, 주의, 심각) 반환하는 메서드
    private String calculateTotalResult(String... statuses) {
        boolean hasCaution = false;
        boolean hasSerious = false;


        // 심각을 우선으로 탐색 후, 주의 탐색
        for (String status : statuses) {
            if (status.equals("심각")) {
                hasSerious = true;
                break;
            }
            if (status.equals("주의")) {
                hasCaution = true;
            }
        }

        if (hasSerious) return "심각";
        if (hasCaution) return "주의";
        return "정상";
    }

    /**
     * 오늘의 알코올 이상자 수와 목록을 반환
     *
     * @return 오늘의 알코올 이상자 수와 목록을 담고 있는 Map 객체
     */
    public Map<String, Object> getAlcoholAbusers() {

        LocalDate today = LocalDate.now();

        List<UserProfile> alcoholAbusers = userDataRepository.findByDate(today).stream()
                // 0.03일 경우에만 데이터가 안 들어가는 이유 . 부동소수점
                .filter(userData -> Math.abs(userData.getUserDrink() - 0.03) < 1e-6 || userData.getUserDrink() > 0.03)
                .map(UserData::getUserProfile)
                .distinct()
                .collect(Collectors.toList());

        int alcoholAbuserCount = alcoholAbusers.size();

        Map<String, Object> response = new HashMap<>();
        response.put("alcoholAbuserCount", alcoholAbuserCount);
        response.put("alcoholAbusers", alcoholAbusers);

        return response;
    }

    /**
     * 오늘의 근로자 측정값의 평균 수치(체온, 심박수, 산소포화도)를 반환
     *
     * @return 오늘의 체온, 심박수, 산소포화도의 평균 값을 담고 있는 Map 객체
     */
    public Map<String, Double> getTodayUserAverages() {
        LocalDate today = LocalDate.now();

        List<UserData> todayUserData = userDataRepository.findAll().stream()
                .filter(userData -> userData.getDate().isEqual(today))
                .toList();

        // 심박수 평균
        OptionalDouble averageHeartRate = todayUserData.stream()
                .mapToInt(UserData::getUserHeartRate)
                .average();

        // 체온 평균
        OptionalDouble averageTemp = todayUserData.stream()
                .mapToDouble(UserData::getUserTemp)
                .average();

        // 산소포화도 평균
        OptionalDouble averageOxygen = todayUserData.stream()
                .mapToInt(UserData::getUserOxygen)
                .average();

        Map<String, Double> averages = new HashMap<>();
        averages.put("averageHeartRate", FirstDecimal(averageHeartRate.isPresent() ? averageHeartRate.getAsDouble() : 0.0));
        averages.put("averageTemp", FirstDecimal(averageTemp.isPresent() ? averageTemp.getAsDouble() : 0.0));
        averages.put("averageOxygen", FirstDecimal(averageOxygen.isPresent() ? averageOxygen.getAsDouble() : 0.0));

        return averages;
    }

    /**
     * 건강데이터 측정값 평균 수치 계산에 활용되는 메서드
     * 측정값의 평균 수치를 소수 첫째 자리까지만 출력
     *
     * @param value 평균 수치 값
     * @return 소수 첫째 자리까지 반올림된 값
     */
    private double FirstDecimal(double value) {
        return Math.round(value * 10) / 10.0;
    }


    /**
     * 전날의 평균 근로시간을 반환
     * 전날 날짜 기준으로 데이터베이스에서 출퇴근 시간을 계산하여 평균 반환
     *
     * @return 전날의 평균 근로시간
     */
    public Map<String, Object> getYesterdayAverageWorkTime() {
        // 하루 전 데이터
        LocalDate yesterday = LocalDate.now().minusDays(1);

        List<UserData> yesterdayUserData = userDataRepository.findAll().stream()
                .filter(userData -> userData.getDate().isEqual(yesterday))
                // 출퇴근 값이 존재하는 데이터만 출력
                .filter(userData -> userData.getUserStart() != null && userData.getUserEnd() != null)
                .toList();

        Map<String, Object> response = new HashMap<>();

        List<Duration> workDurations = yesterdayUserData.stream()
                .map(userData -> Duration.between(userData.getUserStart(), userData.getUserEnd()))
                .toList();

        if (workDurations.isEmpty()) {
            response.put("message", "전 날 측정된 근로시간 데이터가 없습니다.");
            return response;
        }

        Duration totalWorkDuration = workDurations.stream()
                .reduce(Duration.ZERO, Duration::plus);

        // 평균 근로시간
        double averageWorkHours = (double) totalWorkDuration.toMinutes() / workDurations.size() / 60;
        long averageHours = (long) averageWorkHours;
        long averageMinutes = Math.round((averageWorkHours - averageHours) * 60);

        response.put("hours", averageHours);
        response.put("minutes", averageMinutes);
        return response;
    }
}

