package com.application.safety.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;


@Entity
@Table(name = "user_data")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="USER_DATA_NO")
    private int UserDataNo; // 데이터 번호

    @ManyToOne
    @JoinColumn(name = "USER_NO")
    private UserProfile userProfile;

    @Column(name="USER_DRINK")
    private float UserDrink; // 음주

    // 혈압-> 심박수로 변경
    // [Oh] 에러 USER_HEART_RATE -> USER_HEARTRATE
    @Column(name="USER_HEARTRATE")
    private int UserHeartRate; // 심박수

    @Column(name="USER_TEMP")
    private float UserTemp; // 온도

    @Column(name="USER_OXYGEN")
    private int UserOxygen; // 산소포화도

<<<<<<< HEAD
=======
    @Column(name = "DATE")
    private LocalDate date; // 날짜

>>>>>>> c4ad9b752471d9e2712faeea09d239ecde3a3be3
    @Column(name="USER_START")
    private LocalTime UserStart; // 출근 시간

    @Column(name="USER_END")
    private LocalTime UserEnd; // 퇴근 시간

<<<<<<< HEAD
=======
    @Builder
    public UserData(float userDrink, int userHeartRate, float userTemp, int userOxygen, LocalDate date, LocalTime userStart, LocalTime userEnd) {
        this.UserDrink = userDrink;
        this.UserHeartRate = userHeartRate;
        this.UserTemp = userTemp;
        this.UserOxygen = userOxygen;
        this.date = date;
        this.UserStart = userStart;
        this.UserEnd = userEnd;
    }
>>>>>>> c4ad9b752471d9e2712faeea09d239ecde3a3be3
}
