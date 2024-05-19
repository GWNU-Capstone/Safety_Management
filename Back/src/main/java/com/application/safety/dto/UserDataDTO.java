package com.application.safety.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDataDTO {
<<<<<<< HEAD
=======
    private int userNo;
    private float userDrink;
    private int userHeartRate;
    private float userTemp;
    private int userOxygen;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
>>>>>>> c4ad9b752471d9e2712faeea09d239ecde3a3be3


    private float UserDrink;
    private float UserTemp;
    private int UserHeartRate;

<<<<<<< HEAD
=======
    public UserData toEntity() {
        return UserData.builder()
                .userDrink(userDrink)
                .userHeartRate(userHeartRate)
                .userTemp(userTemp)
                .userOxygen(userOxygen)
                .date(date)
                .userStart(userStart)
                .userEnd(userEnd)
                .build();
    }
>>>>>>> c4ad9b752471d9e2712faeea09d239ecde3a3be3
}
