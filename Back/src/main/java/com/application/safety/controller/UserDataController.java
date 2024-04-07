package com.application.safety.controller;

import com.application.safety.dto.UserDataDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserDataController {

    @PostMapping("/user/go")
    public UserDataDTO userGoToWork(@RequestBody UserDataDTO userDataDTO) {
        //
        return userDataDTO;
    }

    /*
    {
         "userNo": 1,
         "userDrink" : 0.05,
         "userHeartRate": 69,
         "userTemp": 29.8,
         "date": "2024-04-02",
         "userStart": "18:30:00"
     }
    */
}
