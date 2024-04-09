package com.application.safety.controller;

import com.application.safety.dto.UserDataDTO;
import com.application.safety.entity.UserData;
import com.application.safety.repository.UserDataRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserDrinkTempHeartController {

    private final UserDataRepository userDataRepository;
    @GetMapping("/members/{user_no}/drink")
    public UserDataDTO getUserData1(@PathVariable("user_no") int user_no) {
        UserData userData = userDataRepository.findById(user_no).orElseThrow(() -> new EntityNotFoundException("Not Found Id"));

        UserDataDTO dto = new UserDataDTO();
        dto.setUserDrink(userData.getUserDrink());

        return dto;
    }

    // TempHeart 클래스의 코드 가져오기
    // 매핑 주소 소문자로 변경
    @GetMapping("/members/{user_no}/tempheart")
    public UserDataDTO getUserData2(@PathVariable("user_no") int user_no) {
        UserData userData = userDataRepository.findById(user_no).orElseThrow(() -> new EntityNotFoundException("Not Found Id"));

        UserDataDTO dto = new UserDataDTO();
        dto.setUserTemp(userData.getUserTemp());
        dto.setUserHeartRate(userData.getUserHeartRate());

        return dto;
    }
}
