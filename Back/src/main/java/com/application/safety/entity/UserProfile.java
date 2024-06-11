package com.application.safety.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.util.List;

@Entity
@Table(name = "user_profile")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserProfile {
    @Id
    @Column(name = "USER_NO")
    private Long UserNo; // 사원 번호

    @NotNull
    @Column(name = "USER_NAME")
    private String UserName; // 이름

}
