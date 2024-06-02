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
    private Long feedbackId;

    @Column(name = "CONTENTS")
    private String contents;
}