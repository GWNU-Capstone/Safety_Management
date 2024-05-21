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
| **지문 측정결과**       | GET    | '/fingerprint'       | 지문 인식을 통해 사용자 아이디를 반환한다.     |
| **지문 등록정보**       | GET    | '/fingerprint/info'  | 지문 인식기에 등록되어있는 정보를 확인한다.     |
| **지문 등록**         | GET    | '/fingerprint/add/?location=' | 지문을 등록한다. ?location= 뒤에 번호를 입력하면 특정 위치에 등록할 수 있다. </br>없는경우 0번부터 순서대로 입력됨.     |
| **지문 제거**         | GET    | '/fingerprint/rm/?location='       | 지문을 삭제한다. ?location= 뒤에 삭제할 번호를 입력해야 작동한다.     |
| ~**지문 전체제거**~       | ~GET~    | ~'/fingerprint/rmall'~       | ~지문인식센서에 등록된 모든 지문을 삭제한다~ </br>**<u>보안 문제로 프론트에서 구현은 하지 말아주세요</u>**     |
| **음주 측정결과**      | GET    | '/drink'              | 음주 센서에서의 측정값을 반환한다.           |
| **체온 및 심박 측정결과**| GET    | '/tempheart'          | 체온 및 심박 센서에서의 측정값을 반환한다.     |
| **심박센서 켜기**| GET    | '/hrstart'          | 심박센서를 켠다 (서버 실행시 기본으로 켜짐)     |
| **심박센서 끄기**| GET    | '/hrstop'          | 심박센서를 끈다 (심박센서 오류발생시 대처용)     |


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
    {
      "code": 103,
      "userImage": "1.png" (사진)
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
      "memo": "메모" (메모)
    }
    ```

* * *

### 📕(Back) 근로자 등록
- **URL**: `/user/crate`
- **Method**: POST
- **전송 데이터**:
  - **Params**
    ```json
    {
        "userNo" : 7, 
        "userPosition" : "사장",
        "userName" : "홍길동", 
        "userAge" : 33,
        "userGender" : "남성",
        "userTelNo" : "01012345678",
        "userEmail" : "1abc@naver.com",
        "userAddress" : "강원도"
    }
    ```  
- **성공 응답**:
  - **Content**:
    ```json
    {
        "userNo" : 7, 
        "userPosition" : "사장",
        "userName" : "홍길동", 
        "userAge" : 33,
        "userGender" : "남성",
        "userTelNo" : "01012345678",
        "userEmail" : "1abc@naver.com",
        "userAddress" : "강원도"
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
      "userOxygen" : 89 (산소포화도)
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
      "userOxygen": 89,
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
      "userNo" : 3,
      "userName" : "홍길동",
      "userImage" : "11.png",
      "userResidentNum" : "123456-1234567",
      "userAge" : 60,
      "userTelNo" : "01044444441",
      "userGender" : "남성",
      "userPosition": "사장",
      "userEmail": "1abc@naver.com",
      "userAddress": "강원도",
      "userBank" : "국민은행",
      "userAccount": "123-4567-1234",
      "userJoinDate": "2024-04-28"
      "memo" : "example"
    }
    ```
    
- **성공 응답**:
  - **Content**:
    ```json
    {
      "userNo": 3,
      "userImage": "11.png",
      "userResidentNum": "123456-1234567",
      "userAge": 60,
      "userTelNo": "01044444441",
      "userGender": "남성",
      "userPosition": "사장",
      "userEmail": "1abc@naver.com",
      "userAddress": "강원도",
      "userBank": "국민은행",
      "userAccount": "123-4567-1234",
      "userJoinDate": "2024-04-28",
      "memo": "example",
      "userProfile": {
        "userName": "홍길동",
        "userNo": 3
    }
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


## 🗂️ API 상세 정보
### 📘 Software 아두이노(Arduino) + 라즈베리파이(Raspberry Pi)
- **URL**: `/users/fingerprint`
- **Method**: GET
- **성공 응답**:
  - **사용자 검색 실패**:
    ```json
    {"fingerprint_results":"Not Found"}
    ```
  - **사용자 검색 시간초과**:
    ```json
    {"fingerprint_results":"No Response"}
    ```
  - **사용자 검색 성공**:
    ```json
    {"fingerprint_results":0} 
    ```

- **URL**: `/users/fingerprint/rm?location=`
- **Method**: GET
- **성공 응답**:
  - **사용자 삭제 성공**:
    ```json
    {"fingerprint_removeresults":"Template at location 1 deleted successfully."}
    ```

- **URL**: `/users/fingerprint/add?location=`
- **Method**: GET
- **성공 응답**:
  - **사용자 등록 성공**:
    ```json
    {"fingerprint_addresults":"Stored model at #1"}
    ```
  - **사용자 등록 실패**:
    ```json
    {"fingerprint_addresults":"False"}
    ```  

- **URL**: `/users/fingerprint/tempheart`
- **Method**: GET
- **성공 응답**:
  - **성공**:
    ```json
    {"userHeartRate":120.032,"userSpo2":99.982,"userTemp":37.0}
    ```

- **URL**: `/users/fingerprint/drink`
- **Method**: GET
- **성공 응답**:
  - **성공**:
    ```json
    {"userdrink":0.01}
    ```