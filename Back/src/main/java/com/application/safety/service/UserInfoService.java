package com.application.safety.service;

import com.application.safety.dto.UserDTO;
import com.application.safety.dto.UserInfoDTO;
import com.application.safety.entity.UserInfo;
import com.application.safety.entity.UserProfile;
import com.application.safety.repository.UserDataRepository;
import com.application.safety.repository.UserInfoRepository;
import com.application.safety.repository.UserProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserInfoService {
    private final UserInfoRepository userInfoRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserDataRepository userDataRepository;

    /**
     * 새로운 근로자 등록
     * 등록에 필요한 데이터를 DTO로 받아서 저장
     *
     * @param dto 근로자의 정보를 담고 있는 요청 DTO
     */
    @Transactional
    public void addUser(UserDTO.Request dto) {
        // UserProfile 새로운 객체 생성 후 값 삽입
        UserProfile userProfile = new UserProfile();
        userProfile.setUserNo((long) dto.getUserNo());
        userProfile.setUserName(dto.getUserName());

        UserProfile saveUserProfile = userProfileRepository.save(userProfile);

        // UserInfo 새로운 객체 생성 후 값 삽입
        UserInfo userInfo = new UserInfo();
        userInfo.setUserProfile(saveUserProfile);
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

    /**
     * 모든 근로자의 정보를 전체 조회
     * 각 근로자의 정보를 UserDTO.Response 객체로 변환하여 리스트로 반환
     *
     * @return 모든 근로자의 정보를 가지고 있는 UserDTO.Response 객체의 리스트
     */
    @Transactional(readOnly = true)
    public List<UserDTO.Response> getUserInfoAll() {
        List<UserInfo> userInfoList = userInfoRepository.findAll();

        return userInfoList.stream().map(userInfo -> {
            UserDTO.Response dto = new UserDTO.Response();
            dto.setUserNo(Math.toIntExact(userInfo.getUserNo()));
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


    /**
     * 근로자 정보 -상세 조회 (사원번호 userNo를 기준)
     * 조회된 정보는 이름, 연령, 성별, 주민등록번호, 전화번호, 이메일, 주소, 직위, 입사 일자, 은행명, 계좌번호, 메모
     *
     * @param userNo 근로자의 고유 사원번호
     * @return 근로자의 상세 정보를 담고 있는 UserInfoDTO 객체
     */
    @Transactional(readOnly = true)
    public UserInfoDTO getUserInfo(int userNo) {
        UserInfo userInfo = getUserInfoEntity(userNo);
        UserProfile userProfile = userInfo.getUserProfile();
        UserInfoDTO userInfoDTO = new UserInfoDTO();

        // userProfile 조회 및 이름 설정
        userInfoDTO.setUserNo(Math.toIntExact(userInfo.getUserNo()));
        userInfoDTO.setUserName(userProfile.getUserName());

        userInfoDTO.setUserAge(userInfo.getUserAge());
        userInfoDTO.setUserGender(userInfo.getUserGender());
        userInfoDTO.setUserResidentNum(userInfo.getUserResidentNum());
        userInfoDTO.setUserTelNo(userInfo.getUserTelNo());
        userInfoDTO.setUserImage(userInfo.getUserImage());
        userInfoDTO.setUserEmail(userInfo.getUserEmail());
        userInfoDTO.setUserAddress(userInfo.getUserAddress());
        userInfoDTO.setUserPosition(userInfo.getUserPosition());
        userInfoDTO.setUserJoinDate(userInfo.getUserJoinDate());
        userInfoDTO.setUserBank(userInfo.getUserBank());
        userInfoDTO.setUserAccount(userInfo.getUserAccount());
        userInfoDTO.setMemo(userInfo.getMemo());

        return userInfoDTO;
    }


    /**
     * 근로자의 상세 정보 수정
     * 수정할 데이터는 사원번호를 제외한 나머지 개인 정보
     * 이름, 연령, 성별, 주민등록번호, 전화번호, 이메일, 주소, 직위, 입사 일자, 은행명, 계좌번호, 메모
     *
     * @param userInfoDTO 수정할 상세 정보 데이터를 담고 있는 DTO
     * @return 수정된 사용자 정보를 담고 있는 UserInfo 객체
     */
    @Transactional
    public UserInfo updateUserInfo(UserInfoDTO userInfoDTO) {
        UserInfo userInfo = getUserInfoEntity(userInfoDTO.getUserNo());

        // userProfile 조회 및 이름 설정
        UserProfile userProfile = userInfo.getUserProfile();
        userProfile.setUserName(userInfoDTO.getUserName());

        userInfo.setUserImage(userInfoDTO.getUserImage());
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
        userInfo.setMemo(userInfoDTO.getMemo());

        userInfoRepository.save(userInfo);

        return userInfo;
    }

    /**
     * 근로자 삭제 (사원번호 userNo를 기준)
     * 연관된 다른 엔티티(UserData, UserInfo)의 데이터도 삭제 처리
     *
     * @param userNo 삭제할 사원번호
     */
    @Transactional
    public void deleteUser(int userNo) {
        UserProfile userProfile = userProfileRepository.findById(userNo).orElseThrow();

        userDataRepository.deleteByUserProfile(userProfile);
        userInfoRepository.deleteById(userNo);
        userProfileRepository.deleteById(userNo);

    }

    // 사원 번호 기반 Entity 조회
    public UserInfo getUserInfoEntity(int userNo) {
        return userInfoRepository.findById(userNo)
                .orElseThrow(() -> new EntityNotFoundException("[UserInfoService] UserInfo Not Found : " + userNo));
    }
}


