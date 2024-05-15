package com.application.safety.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserInfoDTO {
    // UserProfile
    private int userNo;
    private String userName;

    // UserInfo
    private String userImage;
    private String userResidentNum;
    private int userAge;
    private String userTelNo;
    private String userGender;
    private String userPosition;
    private String userEmail;
    private String userAddress;
    private String userBank;
    private String userAccount;
    private LocalDate userJoinDate;
    private String memo;
}
