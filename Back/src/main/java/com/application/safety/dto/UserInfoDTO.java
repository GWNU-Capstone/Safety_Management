package com.application.safety.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserInfoDTO {
    private int UserNo;
    private String userImage;
    private int UserAge;
    private String UserTelNo;
    private String UserGender;
    private String UserPosition;
    private String UserEmail;
    private String UserAddress;
    private String UserBank;
    private String UserAccount;
    private LocalDate UserJoinDate;
    private LocalDate UserWorkDate;
    private String UserNote;

}
