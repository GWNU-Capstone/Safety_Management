package com.application.safety.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_profile")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserProfile {
    @Id
    @Column(name = "USER_NO")
    private int UserNoPk;

    @Column(name = "USER_NAME")
    private String UserName;
}
