package com.application.safety.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AIFeedbackDTO {
    private Long feedbackId;
    private Feedback feedback;

    @Getter
    @Setter
    public static class Feedback {
        private String title;
        private String contents;
    }
}