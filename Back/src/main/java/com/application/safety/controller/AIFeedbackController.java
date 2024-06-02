package com.application.safety.controller;

import com.application.safety.dto.AIFeedbackDTO;
import com.application.safety.entity.AIFeedback;
import com.application.safety.service.AIFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AIFeedbackController {
    private final AIFeedbackService aiFeedbackService;

    @GetMapping
    public ResponseEntity<List<AIFeedbackDTO>> getFeedback() {
        List<AIFeedbackDTO> responses = aiFeedbackService.getAIFeedback();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/refresh")
    public ResponseEntity<Void> AIFeedbackRefresh() {
        aiFeedbackService.processAIResponse();
        return ResponseEntity.noContent().build();
    }
}