package com.application.safety.repository;

import com.application.safety.entity.AIFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AIFeedbackRepository extends JpaRepository<AIFeedback, Long> {
}
