package com.application.safety.dto;

import lombok.Data;

@Data
public class UserShowDto {

    // profile
    private String UserName;

    //info
    private int UserAge;
    private String UserTelNo;

    //data
    private double UserTemp;
    private float UserDrink;
}

