# Safety_Management
[GWNU] 공사장 안전 관리 시스템

## 🗂️ API 명세서
### 📕 Backend(Spring Boot)
| 포인트 역할             | Method | URL                           | 요약 설명                              |
|:--------------------:|:------:|:------------------------------|--------------------------------------|
| **근로자 일부 정보 요청** | GET    | '/user/fingerprint/{사용자 ID}' | 근로자 ID 기반 요청을 통해 일부 정보를 반환한다.|
| **근로자 전체 정보 요청** | GET    | '/user/all'                   | 근로자 전체에 대한 일부 데이터 정보를 반환한다. |
| **근로자 상세 정보 요청** | GET    | '/detail/{사용자 ID}'           | 근로자에 대한 상세 데이터 정보를 반환한다.     |
| **근로자 등록**         | POST   | '/user/crate'                 | 새로운 근로자를 데이터베이스에 등록한다.       |
| **출근 등록 요청**      | POST   | '/user/go'                     | 각종 센서 측정을 마친 후 출근을 등록한다.     |
| **사용자 상세정보 수정**  | PATCH  | '/update/{사용자ID}'            | 근로자 상세조회 화면으로 사용자 정보를 반환한다. |
| **사용자 정보 삭제**     | DELETE  | '/delete/{사용자ID}'           | 근로자 정보를 삭제한다.                   |





### 📘 Software 아두이노(Arduino) + 라즈베리파이(Raspberry Pi)
| 포인트 역할             | Method | URL                 | 요약 설명                              |
|:--------------------:|:------:|:--------------------|--------------------------------------|


## 🗂️ API 상세 정보
### 📕(Back) 근로자 일부 정보 요청
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
      "userImage": "1.png" (사진)
    },
    "userProfile": {
      "userNo": 1, (사원 번호)
      "userName": "홍길동" (이름)
    }
      ```
* * *

### 📕(Back) 근로자 전체 정보 요청
- **URL**: `/users/all`
- **Method**: GET
- **성공 응답**:
  - **Content**:
    ```json
    {
      "userNo": 1,
      "userPosition": "관리직", (근로자 관직)
      "userName": "홍길동", 
      "userAge": 25, (나이)
      "userGender": "남성", (성별)
      "userTelNo": "01012345678", (전화번호)
      "userEmail": "abc@naver.com", (이메일)
      "userAddress": "강원특별자치도 원주시" (주소)
    }
    ...
    ```

* * *

### 📕(Back) 근로자 상세 정보 요청
- **URL**: `/detail/{사용자 ID}`
- **Method**: GET
- **성공 응답**:
  - **Content**:
    ```json
    {
      "userNo": 1,
      "userName": "홍길동",
      "userImage": "1.png",
      "userResidentNum": "000000-1234567",
      "userAge": 25,
      "userTelNo": "01012345678",
      "userGender": "남성",
      "userPosition": "관리직",
      "userEmail": "1abc@naver.com",
      "userAddress": "강원특별자치도 원주시",
      "userBank": "우리은행", (은행)
      "userAccount": "1002-123-456789", (계좌 번호)
      "userJoinDate": "2024-03-01", (입사 일자)
      "userWorkDate": "2024-04-30", (마지막 근무 일자)
      "userNote": "비고1" (비고)
    }
    ```

* * *

### 📕(Back) 근로자 등록 // 수정해야함
- **URL**: `/user/crate`
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

* * *

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

* * *

### 📕(Back) 사용자 상세정보 수정
- **URL**: `/update/{사용자ID}`
- **Method**: PATCH
- **전송 데이터**:
  - **Params**
    ```json
    {
      "UserNo": 1,
      "UserAge": 60,
      "UserTelNo": "01099999999",
      "UserGender": "남성",
      "UserAddress": "서울시 강남구",
      "UserBank": "국민은행",
      "UserAccount": "123-456-7890",
      "UserJoinDate": "2023-03-03"
    }
    ```

- **성공 응답**:
  - **Content**:
    ```json
    {
      "userNo": 1,
      "userProfile": {
          "userNo": 1,
          "userName": null
    },
      "userTelNo": "01099999999",
      "userPosition": null,
      "userEmail": null,
      "userAddress": "서울시 강남구",
      "userGender": "남성",
      "userAge": 60,
      "userJoinDate": "2023-03-03",
      "userAccount": "123-456-7890",
      "userImage": "4.png",
      "userResidentNum": null,
      "userBank": "국민은행",
      "userNote": "비고1",
      "userWorkDate": "2023-03-05"
    }
    ```

* * *
    
### 📕(Back) 사용자 정보 삭제
- **URL**: `/delete/{사용자ID}`
- **Method**: DELETE
- **응답 상태**:
- 
  성공 시 204 No Content
  
  오류발생 시 500 Internal Server Error 등


