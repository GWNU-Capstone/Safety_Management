package com.application.safety.controller;

import com.application.safety.dto.UserDataDTO;
import com.application.safety.entity.UserData;
import com.application.safety.service.UserDataService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class UserDataController {
    private final UserDataService userDataService;

    // 출근 기록 요청
    /*
    {
        "userNo": 1,
        "userDrink" : 0.05,
        "userHeartRate": 69,
        "userTemp": 29.8,
    }
    위와 같은 요청이 Front 에서 전달해서 올 예정입니다.
    여기에 date, userStart 의 값을 요청 기준으로 값을 삽입해서 데이터 베이스에 넣어주시면 됩니다.
    */

    @PostMapping("/user/go")
    public ResponseEntity<UserData> userGoToWork(@RequestBody UserDataDTO userDataDTO) {

        UserData userData = userDataService.userDataStart(userDataDTO);


        return ResponseEntity.ok(userData);
    }
}
