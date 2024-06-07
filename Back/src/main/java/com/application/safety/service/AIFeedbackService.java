package com.application.safety.service;

import com.application.safety.dto.AIFeedbackDTO;
import com.application.safety.dto.chatgpt.ChatGPT;
import com.application.safety.entity.AIFeedback;
import com.application.safety.entity.UserData;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.AIFeedbackRepository;
import com.application.safety.repository.SiteEnvironmentRepository;
import com.application.safety.repository.UserDataRepository;
import com.application.safety.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AIFeedbackService {
    private final AIFeedbackRepository aiFeedbackRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserDataRepository userDataRepository;
    private final SiteEnvironmentRepository siteEnvironmentRepository;
    private final WebClient webClient;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.api.url}")
    private String apiURL;

    public List<AIFeedbackDTO> getAIFeedback() {
        List<AIFeedback> aiFeedbacks = aiFeedbackRepository.findAll();
        List<AIFeedbackDTO> aiFeedbackDTOS = new ArrayList<>();

        for(AIFeedback aiFeedback : aiFeedbacks) {
            AIFeedbackDTO dto = new AIFeedbackDTO();
            dto.setFeedbackId(aiFeedback.getFeedbackId());

            AIFeedbackDTO.Feedback feedback = new AIFeedbackDTO.Feedback();
            feedback.setTitle("\uD83E\uDD16 [AI 분석 결과]");
            feedback.setContents(aiFeedback.getContents());

            dto.setFeedback(feedback);

            aiFeedbackDTOS.add(dto);
        }

        return aiFeedbackDTOS;
    }

    public void processAIResponse() {
        // chatGPT message 설정
        ChatGPT.Request request = new ChatGPT.Request(model, createMessage());

        Mono<ChatGPT.Response> responseMono = webClient.post()
                .uri(apiURL)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(ChatGPT.Response.class);

        ChatGPT.Response response = responseMono.block();
        String GPTMessage = response != null ? response.getChoices().get(0).getMessage().getContent() : null;

        // 답변 데이터 베이스 전체 초기화
        aiFeedbackRepository.deleteAll();

        // 답변 데이터 베이스 저장
        messageSave(GPTMessage);
    }

    // chatGPT 보내는 메시지 설정
    public String createMessage() {

        LocalDate nowDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
        List<UserProfile> userProfileList = userProfileRepository.findAll();
        List<UserData> userDataList = userDataRepository.findByDate(nowDate);

        Optional<Double> avgTemperature = siteEnvironmentRepository.findAverageTemperatureByDate(nowDate);
        Optional<Double> avgHumidity = siteEnvironmentRepository.findAverageHumidityByDate(nowDate);
        Optional<Double> avgFineDust = siteEnvironmentRepository.findAverageFineDustByDate(nowDate);
        Optional<Double> avgSunshine = siteEnvironmentRepository.findAverageSunshineByDate(nowDate);

        return "GPT 너는 지금부터 공사장 관리자야. \n" +
                "아래는 공사장 근로자 정보.\n" +
                userProfileList +
                "\n \n 아래는 근로자의 오늘 출근 데이터. \n" +
                userDataList +
                "\n\n아래는 근로 장소의 오늘 평균 온도, 습도, 미세먼지, 일조량.\n" +
                "온도: " + avgTemperature.orElse(Double.NaN) + "\n" +
                "습도: " + avgHumidity.orElse(Double.NaN) + "\n" +
                "미세먼지: " + avgFineDust.orElse(Double.NaN) + "\n" +
                "일조량: " + avgSunshine.orElse(Double.NaN) + "\n\n" +
                "와 같은 공사장 데이터가 존재해. \n" +
                "공사장 데이터를 가지고 현재 근로자, 근로 장소 등 다양하게 주의사항 및 피드백 해줘." +
                "다른 답변 내용은 필요없어 피드백만 부탁할게. \n" +
                "피드백 수는 3 ~ 6개 사이로 해줘. \n " +
                "문장을 구분할 수 있도록 구분자도 추가해줘. 문장마다 NEXT 표시. \n" +
                "또한, 1. 2. 이런 번호 및 \\n은 쓰지마. \n" +
                "ex) 하늘은 곱다 NEXT 하늘은 푸르다 NEXT 이런식으로 해줘. \n" +
                "데이터 길이는 간략하게만 해줘. 1개 피드백당 50자 제한.";
    }

    // 답변 분리 후 메시지 저장
    private void messageSave(String gptMessage) {
        String[] messages = gptMessage.split(" NEXT ");

        for(int i = 0; i < messages.length; i++) {
            AIFeedback aiFeedback = new AIFeedback();
            aiFeedback.setFeedbackId((long) (i+1));
            aiFeedback.setContents(messages[i]);

            aiFeedbackRepository.save(aiFeedback);
        }
    }
}