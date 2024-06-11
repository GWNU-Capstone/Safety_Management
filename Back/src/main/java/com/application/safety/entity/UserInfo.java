package com.application.safety.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDate;


@Entity
@Table(name = "user_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {
    @Id
    @Column(name="USER_NO")
    private Long userNo; // 사원 번호

    @Column(name = "USER_IMAGE")
    private String userImage; // 사진

    @NotNull
    @Column(name = "USER_RESIDENT_NUM")
    private String userResidentNum; // 주민등록번호

    @Column(name="USER_AGE")
    private int userAge; // 나이

    @NotNull
    @Column(name="USER_TELNO")
    private String userTelNo; // 전화번호

    @NotNull
    @Column(name="USER_GENDER")
    private String userGender; // 성별

    @Column(name="USER_POSITION")
    private String userPosition; // 직위

    @Column(name="USER_EMAIL")
    private String userEmail; // 이메일

    @Column(name="USER_ADDRESS")
    private String userAddress; // 주소

    @Column(name="USER_BANK")
    private String userBank; // 은행

    @Column(name="USER_ACCOUNT")
    private String userAccount; // 계좌번호

    @Column(name="USER_JOIN_DATE")
    private LocalDate userJoinDate; // 입사 일자

    @Column(name="MEMO")
    private String memo; // 메모

    @MapsId
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "USER_NO")
    private UserProfile UserProfile;
}
