package com.application.safety.service;

import com.application.safety.dto.UserDTO;
import com.application.safety.dto.UserInfoDTO;
import com.application.safety.entity.UserInfo;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.UserInfoRepository;
import com.application.safety.repository.UserProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserInfoService {
    private final UserInfoRepository userInfoRepository;
    private final UserProfileRepository userProfileRepository;

    // 근로자 등록 Create Service
    public void addUser(UserDTO.Request dto) {
        // UserProfile 새로운 객체 생성 후 값 삽입
        UserProfile userProfile = new UserProfile();
        userProfile.setUserNo(dto.getUserNo());
        userProfile.setUserName(dto.getUserName());

        UserProfile saveUserProfile = userProfileRepository.save(userProfile);

        // UserInfo 새로운 객체 생성 후 값 삽입
        UserInfo userInfo = new UserInfo();
        userInfo.setUserNo(saveUserProfile.getUserNo());
        userInfo.setUserPosition(dto.getUserPosition());
        userInfo.setUserAge(dto.getUserAge());
        userInfo.setUserGender(dto.getUserGender());
        userInfo.setUserTelNo(dto.getUserTelNo());
        userInfo.setUserEmail(dto.getUserEmail());
        userInfo.setUserAddress(dto.getUserAddress());

        // 가입 일자 = 요청 일자
        LocalDate localDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
        userInfo.setUserJoinDate(localDate);

        userInfoRepository.save(userInfo);
    }

    // 근로자 정보 전체 조회 Read Service
    public List<UserDTO.Response> getUserInfoAll() {
        List<UserInfo> userInfoList = userInfoRepository.findAll();

        return userInfoList.stream().map(userInfo -> {
            UserDTO.Response dto = new UserDTO.Response();
            dto.setUserNo(userInfo.getUserNo());
            dto.setUserPosition(userInfo.getUserPosition());
            dto.setUserName(userInfo.getUserProfile().getUserName());
            dto.setUserAge(userInfo.getUserAge());
            dto.setUserGender(userInfo.getUserGender());
            dto.setUserTelNo(userInfo.getUserTelNo());
            dto.setUserEmail(userInfo.getUserEmail());
            dto.setUserAddress(userInfo.getUserAddress());
            return dto;
        }).collect(Collectors.toList());
    }


    // 사원정보(상세) 조회
    // 이름, 연령, 성별, 주민등록번호, 전화번호, 이메일, 주소, 직위, 입사일자, 은행명, 계좌번호
    public UserInfoDTO getUserInfo(int userNo) {
        // userNo에 해당하는 UserInfo 엔티티 조회
        UserInfo userInfo = userInfoRepository.findById(userNo)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        UserInfoDTO userInfoDTO = new UserInfoDTO();

        userInfoDTO.setUserNo(userInfo.getUserNo());
        userInfoDTO.setUserAge(userInfo.getUserAge());
        userInfoDTO.setUserGender(userInfo.getUserGender());
        userInfoDTO.setUserResidentNum(userInfo.getUserResidentNum());
        userInfoDTO.setUserTelNo(userInfo.getUserTelNo());
        userInfoDTO.setUserEmail(userInfo.getUserEmail());
        userInfoDTO.setUserAddress(userInfo.getUserAddress());
        userInfoDTO.setUserPosition(userInfo.getUserPosition());
        userInfoDTO.setUserJoinDate(userInfo.getUserJoinDate());
        userInfoDTO.setUserBank(userInfo.getUserBank());
        userInfoDTO.setUserAccount(userInfo.getUserAccount());


        // UserName은 UserProfile 에서 가져옴
        UserProfile userProfile = userInfo.getUserProfile();
        userInfoDTO.setUserName(userProfile.getUserName());
        return userInfoDTO;
    }


    // 사원정보(상세) 수정
    // 연령, 성별, 주민등록번호, 전화번호, 이메일, 주소, 직위, 입사일자, 은행명, 계좌번호
    public UserInfo updateUserInfo(UserInfoDTO userInfoDTO) {
        // 회원 id로 UserInfo 찾기
        UserInfo userInfo = userInfoRepository.findById(userInfoDTO.getUserNo())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // 이름
        UserProfile userProfile = userInfo.getUserProfile();
        userProfile.setUserName(userInfoDTO.getUserName());

        userInfo.setUserAge(userInfoDTO.getUserAge());
        userInfo.setUserGender(userInfoDTO.getUserGender());
        userInfo.setUserResidentNum(userInfoDTO.getUserResidentNum());
        userInfo.setUserTelNo(userInfoDTO.getUserTelNo());
        userInfo.setUserEmail(userInfoDTO.getUserEmail());
        userInfo.setUserAddress(userInfoDTO.getUserAddress());
        userInfo.setUserPosition(userInfoDTO.getUserPosition());
        userInfo.setUserJoinDate(userInfoDTO.getUserJoinDate());
        userInfo.setUserBank(userInfoDTO.getUserBank());
        userInfo.setUserAccount(userInfoDTO.getUserAccount());

        userInfoRepository.save(userInfo);

        return userInfo;
    }

    // 사원 삭제
    public void deleteUser(int userNo) {
            // userNo에 해당하는 UserInfo 엔티티 찾기
        UserInfo userInfo = userInfoRepository.findById(userNo)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

            userProfileRepository.delete(userInfo.getUserProfile());
            userInfoRepository.delete(userInfo);
    }

}


