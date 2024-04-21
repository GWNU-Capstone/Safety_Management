package com.application.safety.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
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
    private int UserDataNo;

    @ManyToOne
    @JoinColumn(name = "USER_NO")
    private UserProfile userProfile;

    @Column(name="USER_DRINK")
    private float UserDrink;

    @Column(name="USER_HEARTRATE")
    private int UserHeartRate;

    @Column(name="USER_TEMP")
    private float UserTemp;

    @Column(name = "DATE")
    private LocalDate date;

    @Column(name="USER_START")
    private LocalTime UserStart;

    @Column(name="USER_END")
    private LocalTime UserEnd;

    @Builder
    public UserData(float userDrink, int userHeartRate, float userTemp, LocalDate date, LocalTime userStart, LocalTime userEnd) {
        this.UserDrink = userDrink;
        this.UserHeartRate = userHeartRate;
        this.UserTemp = userTemp;
        this.date = date;
        this.UserStart = userStart;
        this.UserEnd = userEnd;
    }
}
