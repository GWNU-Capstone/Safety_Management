package com.application.safety.dto;

import lombok.Getter;
import lombok.Setter;

public class UserDTO {

    @Getter
    @Setter
    public static class Request {
        private int userNo; // 사원 번호
        private String userPosition; // 직위
        private String userName; // 이름
        private int userAge; // 나이
        private String userGender; // 성별
        private String userTelNo; // 전화번호
        private String userEmail; // 이메일
        private String userAddress; // 주소
    }

    @Getter
    @Setter
    public static class Response {
        private int userNo; // 사원 번호
        private String userPosition; // 직위
        private String userName; // 이름
        private int userAge; // 나이
        private String userGender; // 성별
        private String userTelNo; // 전화번호
        private String userEmail; // 이메일
        private String userAddress; // 주소
    }
}