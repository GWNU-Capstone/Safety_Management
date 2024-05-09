package com.application.safety.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Entity
@Table(name = "user_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {
    @Id
    @Column(name="USER_NO")
    private int UserNo;

    @Column(name = "USER_IMAGE")
    private String UserImage;

    // 주민등록번호 추가
    @Column(name = "USER_RESIDENT_NUM")
    private String UserResidentNum;

    @Column(name="USER_AGE")
    private int UserAge;

    @Column(name="USER_TELNO")
    private String UserTelNo;

    // 추가 (성별, 직위, 이메일, 주소, 은행명, 계좌번호, 입사일자, 근무날짜, 비고)

    @Column(name="USER_GENDER")
    private String UserGender;

    @Column(name="USER_POSITION")
    private String UserPosition;

    @Column(name="USER_EMAIL")
    private String UserEmail;

    @Column(name="USER_ADDRESS")
    private String UserAddress;

    @Column(name="USER_BANK")
    private String UserBank;

    @Column(name="USER_ACCOUNT")
    private String UserAccount;

    @Column(name="USER_JOIN_DATE")
    private LocalDate UserJoinDate;

    @Column(name="USER_WORK_DATE")
    private LocalDate UserWorkDate;

    @Column(name="USER_NOTE")
    private String UserNote;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "USER_NO", referencedColumnName = "USER_NO")
    private UserProfile UserProfile;

}
