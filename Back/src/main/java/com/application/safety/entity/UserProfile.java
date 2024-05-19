package com.application.safety.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "user_profile")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserProfile {
    @Id
    @Column(name = "USER_NO")
    private int UserNo; // 사원 번호

    @Column(name = "USER_NAME")
    private String UserName; // 이름

    // cascade 추가
    @OneToOne(mappedBy = "UserProfile", cascade = CascadeType.ALL)
    private UserInfo userInfo;

    // cascade 추가
    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL)
    private List<UserData> userDataList;
}
