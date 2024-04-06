package com.application.safety.controller;

import com.application.safety.dto.UserProfileDTO;
import com.application.safety.entity.UserData;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.UserDataRepository;
import com.application.safety.repository.UserProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MemberController {

    // 사진(아직x), 이름, 사원번호
    private final UserProfileRepository userProfileRepository;

    private final UserDataRepository userDataRepository;

    @GetMapping("/members/{user_no}")
    public UserProfileDTO getUserData(@PathVariable("user_no") int user_no) {
        UserProfile userProfile = userProfileRepository.findById(user_no).orElseThrow(() -> new EntityNotFoundException("Not Found Id"));

        UserProfileDTO dto = new UserProfileDTO();
        dto.setUserNoPk(userProfile.getUserNoPk());
        dto.setUserName(userProfile.getUserName());


        return dto;

    }



}

