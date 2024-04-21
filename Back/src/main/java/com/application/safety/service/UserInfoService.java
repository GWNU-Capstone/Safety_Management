package com.application.safety.service;

import com.application.safety.dto.UserInfoDTO;
import com.application.safety.entity.UserInfo;
import com.application.safety.repository.UserInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserInfoService {
    private final UserInfoRepository userInfoRepository;

    // UserInfo DTO
    public UserInfoDTO getInfo(int user_no) {
        UserInfo userInfo = userInfoRepository.findById(user_no).orElseThrow();

        UserInfoDTO userInfoDTO = new UserInfoDTO();
        userInfoDTO.setUserImage(userInfo.getUserImage());

        return userInfoDTO;
    }
}
