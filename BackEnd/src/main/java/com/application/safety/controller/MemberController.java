package com.application.safety.controller;

import com.application.safety.dto.UserShowDto;
import com.application.safety.entity.UserData;
import com.application.safety.entity.UserInfo;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.UserDataRepository;
import com.application.safety.repository.UserInfoRepository;
import com.application.safety.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController

public class MemberController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private UserDataRepository userDataRepository;

    @GetMapping("members/")
    public List<Map<String, Object>> getUserData() {
        // 각 엔티티에서 사용자 데이터를 가져옴
        List<UserProfile> userProfiles = userProfileRepository.findAll();

        // 사용자 번호를 기준으로 데이터를 묶음
        Map<Integer, Map<String, Object>> userDataMap = new HashMap<>();


    }



}

