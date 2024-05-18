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
<<<<<<< HEAD
    private int UserNoPk;

    @Column(name = "USER_NAME")
    private String UserName;

=======
    private int UserNo; // 사원 번호

    @Column(name = "USER_NAME")
    private String UserName; // 이름
>>>>>>> c4ad9b752471d9e2712faeea09d239ecde3a3be3
}
