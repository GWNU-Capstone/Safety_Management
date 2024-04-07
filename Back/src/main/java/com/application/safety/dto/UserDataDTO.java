package com.application.safety.dto;

import com.application.safety.entity.UserProfile;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class UserDataDTO {
    private int userNo;
    private float userDrink;
    private int userHeartRate;
    private float userTemp;
    private LocalTime userStart;
    private LocalTime userEnd;
}
