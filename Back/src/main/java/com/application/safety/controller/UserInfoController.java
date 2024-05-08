package com.application.safety.controller;
import com.application.safety.dto.UserDTO;
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

    // 근로자 등록 Crate
    @PostMapping("/user/join")
    public ResponseEntity<UserDTO.Request> addUser(@RequestBody UserDTO.Request userDTO) {
        return ResponseEntity.ok(userDTO);
    }

    // 근로자 정보 전체 조회 Read
    @GetMapping("/user/all")
    public List<UserDTO.Response> getUserInfoAll() {
        return userInfoService.getUserInfoAll();
    }

    // 근로자 정보(상세) 조회 Read
    @GetMapping("/detail/{user_no}")
    public ResponseEntity<UserInfoDTO> getUserInfo(@PathVariable("user_no") int user_no) {
        UserInfoDTO userInfoResponseDTO = userInfoService.getUserInfo(user_no);
        return ResponseEntity.ok(userInfoResponseDTO);
    }

    // 근로자 정보(상세) 수정 Update
    @PatchMapping("/update/{user_no}")
    public ResponseEntity<UserInfo> updateUserInfo(@PathVariable("user_no") int user_no, @RequestBody UserInfoDTO userInfoDTO) {
        userInfoDTO.setUserNo(user_no);
        UserInfo updatedUserInfo = userInfoService.updateUserInfo(userInfoDTO);
        return ResponseEntity.ok(updatedUserInfo);
    }

    // 근로자 정보 삭제 Delete
    @DeleteMapping("/delete/{user_no}")
    public ResponseEntity<Void> deleteUser(@PathVariable("user_no") int user_no) {
        userInfoService.deleteUser(user_no);
        return ResponseEntity.noContent().build();
    }
}

