package com.application.safety.service;

import lombok.RequiredArgsConstructor;
import com.application.safety.entity.UserData;
import com.application.safety.entity.UserInfo;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.UserDataRepository;
import com.application.safety.repository.UserInfoRepository;
import com.application.safety.repository.UserProfileRepository;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final UserDataRepository userDataRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserInfoRepository userInfoRepository;

    @Value("${coolsms.api.key}")
    private String apiKey;

    @Value("${coolsms.api.secret}")
    private String apiSecret;

    @Value("${coolsms.from}")
    private String from;

    public void sendSMS(String category, int userNo) {
        DefaultMessageService messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret, "https://api.coolsms.co.kr");
        UserProfile userProfile = userProfileRepository.findById(userNo).orElseThrow();
        UserInfo userInfo = userInfoRepository.findById(userNo).orElseThrow();

        // 오늘자 날짜로 데이터 검색
        LocalDate nowDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
        Optional<UserData> optionalUserData = userDataRepository.findByUserProfileAndDate(userProfile, nowDate);
        UserData userData = optionalUserData.get();

        // 수신번호, 발신번호
        Message coolSms = new Message();
        coolSms.setTo(userInfo.getUserTelNo());
        coolSms.setFrom(from);

        // 문자 제목, 내용
        coolSms.setSubject("[안전하죠(조)]");
        coolSms.setText(getSmsText(category, userProfile, userData));

        // 문자 전송 및 로그
        messageService.sendOne(new SingleMessageSendingRequest(coolSms));
    }

    public String getSmsText(String category, UserProfile userProfile, UserData userData) {
        String text = "";
        if(category.equals("출근")) {
            text = "*출근 완료*" +
                    "\n\n사원 번호 : " + userProfile.getUserNo() +
                    "\n사원 성함 : " + userProfile.getUserName() +
                    "\n\n알코올 수치 : " + userData.getUserDrink() +
                    "\n체온 : " + userData.getUserTemp() + "°C" +
                    "\n심박수: " + userData.getUserHeartRate() + "mmHg" +
                    "\n\n부디 건강을 해치는 일 없이 안전, " +
                    "\n또 안전하게 일 해주시길 바랍니다." +
                    "\n\n항상 감사합니다.";
        }
        if(category.equals("퇴근")) {
            LocalTime startTime = userData.getUserStart();
            LocalTime endTime = userData.getUserEnd();
            Duration duration = Duration.between(startTime, endTime);
            long hours = duration.toHours();
            long minutes = duration.toMinutesPart();
            String totalWorkTime = hours + "시간 " + minutes + "분";

            text = "*퇴근 완료*" +
                    "\n\n사원 번호 : " + userProfile.getUserNo() +
                    "\n사원 성함 : " + userProfile.getUserName() +
                    "\n\n출근 시간 : " + userData.getUserStart() +
                    "\n퇴근 시간 : " + userData.getUserEnd() +
                    "\n총 근무 시간 : " + totalWorkTime +
                    "\n\n안전 귀가 하시길 바라며," +
                    "\n오늘 근무도 고생하셨습니다. \n감사합니다.";
        }
        return text;
    }
}
