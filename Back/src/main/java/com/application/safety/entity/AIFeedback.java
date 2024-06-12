package com.application.safety.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "AI_FEEDBACK")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIFeedback {
    @Id
    @Column(name = "FEEDBACK_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId; // AI 메시지 데이터 번호

    @Column(name = "CONTENTS")
    private String contents; // AI 메시지 내용
}