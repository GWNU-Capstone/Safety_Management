package com.application.safety.controller;

import com.application.safety.dto.UserAllDTO;
import com.application.safety.dto.UserInfoDTO;
import com.application.safety.entity.UserInfo;
import com.application.safety.service.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserInfoController {
    private final UserInfoService userInfoService;

    // 사원 정보 전체 조회
    @GetMapping("/user/all")
    public List<UserAllDTO> getUserInfoAll() {
        return userInfoService.getUserInfoAll();
    }

    // 사원정보(상세) 조회
    @GetMapping("/detail/{user_no}")
    public ResponseEntity<UserInfoDTO> getUserInfo(@PathVariable("user_no") int user_no) {
        UserInfoDTO userInfoResponseDTO = userInfoService.getUserInfo(user_no);
        return ResponseEntity.ok(userInfoResponseDTO);
    }

    // 사원정보(상세) 수정
    @PatchMapping("/update/{user_no}")
    public ResponseEntity<UserInfo> updateUserInfo(@PathVariable("user_no") int user_no, @RequestBody UserInfoDTO userInfoDTO) {
        userInfoDTO.setUserNo(user_no);
        UserInfo updatedUserInfo = userInfoService.updateUserInfo(userInfoDTO);
        return ResponseEntity.ok(updatedUserInfo);
    }

    // 사원 삭제
    @DeleteMapping("/delete/{user_no}")
    public ResponseEntity<Void> deleteUser(@PathVariable("user_no") int user_no) {
        userInfoService.deleteUser(user_no);
        return ResponseEntity.noContent().build();
    }
}

