package com.application.safety.controller;

import com.application.safety.dto.UserProfileDTO;
import com.application.safety.entity.UserData;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.UserDataRepository;
import com.application.safety.repository.UserProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MemberController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserDataRepository userDataRepository;

    @GetMapping("/members/{user_no}")
    public UserProfileDTO getUserData(@PathVariable("user_no") int user_no) {
        UserProfile userProfile = userProfileRepository.findById(user_no).orElseThrow(() -> new EntityNotFoundException("Not Found Id"));

        UserProfileDTO dto = new UserProfileDTO();
        dto.setUserNoPk(userProfile.getUserNoPk());
        dto.setUserName(userProfile.getUserName());

        return dto;
        // 각 엔티티에서 사용자 데이터를 가져옴
//        return List<UserProfile> userProfiles = userProfileRepository.findAll();

//        // 사용자 번호를 기준으로 데이터를 묶음
//        Map<Integer, Map<String, Object>> userDataMap = new HashMap<>();
    }



}

