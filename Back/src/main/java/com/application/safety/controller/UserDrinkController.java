package com.application.safety.controller;


import com.application.safety.dto.UserDataDTO;
import com.application.safety.entity.UserData;
import com.application.safety.repository.UserDataRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

// 음주

@RestController
@RequiredArgsConstructor
public class UserDrinkController {

    private final UserDataRepository userDataRepository;
    // . -> / 수정
    @GetMapping("/members/{user_no}/drink")
    public UserDataDTO getUserData(@PathVariable("user_no") int user_no) {
        UserData userData = userDataRepository.findById(user_no).orElseThrow(() -> new EntityNotFoundException("Not Found Id"));

        UserDataDTO dto = new UserDataDTO();
        dto.setUserDrink(userData.getUserDrink());

        return dto;

    }



}
