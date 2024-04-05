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
    private int UserDataNo;

    @ManyToOne
    @JoinColumn(name = "USER_NO")
    private UserProfile userProfile;

    @Column(name="USER_DRINK")
    private float UserDrink;

    // 혈압-> 심박수로 변경
    @Column(name="USER_HEART_RATE")
    private int UserHeartRate;

    @Column(name="USER_TEMP")
    private float UserTemp;

    @Column(name="USER_START")
    private LocalTime UserStart;

    @Column(name="USER_END")
    private LocalTime UserEnd;

}
