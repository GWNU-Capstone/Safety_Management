package com.application.safety.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "user_info")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserInfo {
    @Id
    @Column(name="USER_NO")
    private int UserNoPk;

    // 얼굴 사진 경로 -> 지문 변경
    @Column(name="USER_FINGER_PRINT")
    private String UserFingerPrint;

    @Column(name="USER_AGE")
    private int UserAge;

    @Column(name="USER_TELNO")
    private String UserTelno;

    @OneToOne
    @MapsId
    @JoinColumn(name = "USER_NO")
    private UserProfile userProfile;

}
