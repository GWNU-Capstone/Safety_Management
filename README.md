# Safety_Management
[GWNU] 공사장 안전 관리 시스템

## 🗂️ API 명세서
### 📕 Backend(Spring Boot)
| 포인트 역할             | Method | URL                           | 요약 설명                              |
|:--------------------:|:------:|:------------------------------|--------------------------------------|
| **사용자 정보 요청**     | GET    | '/user/fingerprint/{사용자 ID}' | 지문 인식 요청을 통해 사용자 아이디를 반환한다. |
| **출근 등록 요청**      | POST   | '/user/go'                     | 각종 센서 측정을 마친 후 출근을 등록한다.     |

### 📘 Software 아두이노(Arduino) + 라즈베리파이(Raspberry Pi)
| 포인트 역할             | Method | URL                 | 요약 설명                              |
|:--------------------:|:------:|:--------------------|--------------------------------------|
| **지문 측정결과**       | GET    | '/fingerprint'       | 지문 인식을 통해 사용자 아이디를 반환한다.     |
| **지문 등록정보**       | GET    | '/fingerprint/info'  | 지문 인식기에 등록되어있는 정보를 확인한다.     |
| **지문 등록**         | GET    | '/fingerprint/add/?location=' | 지문을 등록한다. ?location= 뒤에 번호를 입력하면 특정 위치에 등록할 수 있다. 없는경우 0번부터 순서대로 입력됨.     |
| **지문 제거**         | GET    | '/fingerprint/rm/?location='       | 지문을 삭제한다. ?location= 뒤에 삭제할 번호를 입력해야 작동한다.     |
| ~**지문 전체제거**~       | ~GET~    | ~'/fingerprint/rmall'~       | ~지문인식센서에 등록된 모든 지문을 삭제한다~ </br>보안 문제로 프론트에서 구현은 하지 말아주세요     |
| **음주 측정결과**      | GET    | '/drink'              | 음주 센서에서의 측정값을 반환한다.           |
| **체온 및 심박 측정결과**| GET    | '/tempheart'          | 체온 및 심박 센서에서의 측정값을 반환한다.     |
| **심박센서 켜기**| GET    | '/hrstart'          | 심박센서를 켠다 (서버 실행시 기본으로 켜짐)     |
| **심박센서 끄기**| GET    | '/hrstop'          | 심박센서를 끈다 (심박센서 오류발생시 대처용)     |


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
