package com.application.safety.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


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

    @Column(name="USER_FINGER_PRINT")
    private String UserFingerPrint;

    @Column(name="USER_AGE")
    private int UserAge;

    @Column(name="USER_TELNO")
    private String UserTelNo;

    @OneToOne
    @MapsId
    @JoinColumn(name = "USER_NO")
    private UserProfile UserProfile;

}
