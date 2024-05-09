# Safety_Management
[GWNU] 공사장 안전 관리 시스템

## 🗂️ API 명세서
### 📕 Backend(Spring Boot)
| 포인트 역할             | Method | URL                           | 요약 설명                              |
|:--------------------:|:------:|:------------------------------|--------------------------------------|
| **사용자 정보 요청**     | GET    | '/user/fingerprint/{사용자 ID}' | 지문 인식 요청을 통해 사용자 아이디를 반환한다. |
| **출근 등록 요청**      | POST   | '/user/go'                     | 각종 센서 측정을 마친 후 출근을 등록한다.     |
| **사용자 상세정보 수정**   | PATCH  | '/update/{사용자ID}'     | 사용자 상세조회 화면으로 사용자 정보를 반환한다.     |
| **사용자 정보 삭제**       | DELETE  | '/delete/{사용자ID}'    | 사용자 정보를 삭제한다.   |





### 📘 Software 아두이노(Arduino) + 라즈베리파이(Raspberry Pi)
| 포인트 역할             | Method | URL                 | 요약 설명                              |
|:--------------------:|:------:|:--------------------|--------------------------------------|


## 🗂️ API 상세 정보
### 📕(Back) 지문 인식 요청
- **URL**: `/users/fingerprint/{사용자 ID}`
- **Method**: GET
- **성공 응답**:
  - **출근 O / 퇴근 X**:
    ```json
    {
      "code": 101,
      "userEnd": "21:43:51" (퇴근 기록 시간)
    }
    ```
  - **출근 O / 퇴근 O**:
    ```json
    {
      "code": 102
    }
    ```
  - **출근 X / 퇴근 X**:
    ```json
    "code": 103,
    "UserInfo": {
      "userImage": "1.png" (사원 사진)
    },
    "userProfile": {
      "userNo": 1, (사원 번호)
      "userName": "홍길동" (사원 이름)
    }
      ```

### 📕(Back) 출근 등록 요청
- **URL**: `/user/go`
- **Method**: POST
- **전송 데이터**:
  - **Params**
    ```json
    {
      "userNo": 1, (사원 번호)
      "userDrink" : 0.05, (음주 측정)
      "userHeartRate": 69, (심박수)
      "userTemp": 29.8, (체온)
    }
    ```  
- **성공 응답**:
  - **Content**:
    ```json
    {
      "userProfile": {
        "userName": "홍길동",
        "userNo": 1
      },
      "date": "2024-04-13", (출근 날짜)
      "userEnd": null, (퇴근 시간)
      "userDrink": 0.05, 
      "userTemp": 29.8,
      "userHeartRate": 69,
      "userDataNo": 14, (데이터 번호)
      "userStart": "18:30:00"
    }
    ```

### 📕(Back) 사용자 상세정보 수정
- **URL**: `/update/{사용자ID}`
- **Method**: PATCH
- **전송 데이터**:
  - **Params**
    ```json
    {
    "UserNo": 1,
    "UserAge": 60,
    "UserTelNo": "010-9999-9999",
    "UserGender": "남성",
    "UserAddress": "서울시 강남구",
    "UserBank": "국민은행",
    "UserAccount": "123-456-7890",
    "UserJoinDate": "2023-01-01"
    }
    ```
    
### 📕(Back) 사용자 정보 삭제
- **URL**: `/delete/{사용자ID}`
- **Method**: DELETE
- **전송 데이터**:
  - **Params**
    ```json
    {
    "userNo": 1,
    "userAge": 60,
    "userTelNo": "010-9999-9999",
    "userGender": "남성",
    "userAddress": "서울시",
    "userBank": "sc제일은행",
    "userAccount": "999-99-9999",
    "userJoinDate": "2026-12-31"
    }
    ```  


