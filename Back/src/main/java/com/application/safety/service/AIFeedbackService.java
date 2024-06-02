package com.application.safety.service;

import com.application.safety.dto.AIFeedbackDTO;
import com.application.safety.dto.chatgpt.ChatGPT;
import com.application.safety.entity.AIFeedback;
import com.application.safety.repository.AIFeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AIFeedbackService {
    private final AIFeedbackRepository aiFeedbackRepository;
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
        return "임의로 3~10개 문장 만들어줘. \n" +
                "문장 구분하는 구분자는 NEXT 이렇게 표시해줘. \n" +
                "ex) 하늘은 곱다 NEXT 하늘은 푸르다 NEXT 이런식으로 해줘.";
    }

    // 답변 분리 후 메시지 저장
    private void messageSave(String gptMessage) {
        String[] messages = gptMessage.split("NEXT ");

        for(int i = 0; i < messages.length; i++) {
            AIFeedback aiFeedback = new AIFeedback();
            aiFeedback.setFeedbackId((long) (i+1));
            aiFeedback.setContents(messages[i]);

            aiFeedbackRepository.save(aiFeedback);
        }
    }
}