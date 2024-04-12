package com.application.safety.dto;

import com.application.safety.entity.UserData;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class UserDataDTO {
    private int userNo;
    private float userDrink;
    private int userHeartRate;
    private float userTemp;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime userStart;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime userEnd;

    public UserData toEntity() {
        return UserData.builder()
                .userDrink(userDrink)
                .userHeartRate(userHeartRate)
                .userTemp(userTemp)
                .date(date)
                .userStart(userStart)
                .userEnd(userEnd)
                .build();
    }
}
