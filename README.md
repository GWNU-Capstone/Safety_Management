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
| **근로자 상세정보 수정**  | PATCH  | '/update/{사용자ID}'            | 근로자 상세조회 화면으로 근로자 정보를 반환한다. |
| **근로자 정보 삭제**     | DELETE  | '/delete/{사용자ID}'           | 근로자 정보를 삭제한다.                   |
| **근로자 출근현황 요청**      | GET  | '/today/user-status'           | 출근자,결근자 수와 각각의 목록을 반환한다.     |
| **근로자 알코올 이상자 정보 요청**  | GET  | '/today/alcohol-abusers'   | 알코올 기준수치를 초과한 근로자 수와 그의 목록을 반환한다. |
| **근로자 측정값 평균 요청**     | GET  | '/today/data-average'           | 근로자들의 측정값(체온, 심박수, 산소포화도) 각각의 평균을 반환한다.   |
| **근로자 종합 데이터 요청**     | GET  | '/today/user-health-status'           | 근로자 상태(정상,주의,심각)에 대한 인원 수와 사용자 각각에 대한 상태 데이터를 반환한다.   |
| **전날 평균 근로시간 요청**     | GET  | '/yesterday/average-worktime'           | 전날 데이터를 기준으로 근로자들의 근로시간의 평균을 반환한다.  |






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
* * *

### 📕(Back) 근로자 출근현황 요청
- **URL**: `/today/user-status`
- **Method**: GET
- **성공 응답**:
  - **Content**:
    ```json
    {
       "presentCount": 4,
       "absentCount": 2,

       "presentUsers": [
            {
                "userName": "오연택",
                "userNo": 1
            },
            {
                "userName": "김민서",
                "userNo": 2
  
            },
            {
                "userName": "이채원",
                "userNo": 4
            },
            {
                "userName": "윤예지",
                "userNo": 5
            }
        ],
    
       "absentUsers": [
          {
              "userName": "박광수",
              "userNo": 3
          },
          {
              "userName": "박현재",
              "userNo": 6
          }
        ]  
    }
    ```

 * * *

### 📕(Back) 근로자 알코올 이상자 정보 요청
- **URL**: `/today/alcohol-abusers`
- **Method**: GET
- **성공 응답**:
   - **Content**:
    ```json
    {
      "alcoholAbuserCount": 2,
      "alcoholAbusers": [
          {
              "userName": "이채원",
              "userNo": 4
          },
          {
              "userName": "윤예지",
              "userNo": 5
          }
      ]
  }
  ```

* * *

### 📕(Back) 근로자 측정값 평균 요청
- **URL**: `/today/data-average`
- **Method**: GET
- **성공 응답**:
   - **Content**:
    ```json
    {
      "averageOxygen": 95.0,
      "averageHeartRate": 91.3,
      "averageTemp": 37.4
   } 
    ```
    
* * *

### 📕(Back) 근로자 종합 데이터 요청
- **URL**: `/today/user-health-status`
- **Method**: GET
- **성공 응답**:
   - **Content**:
    ```json
    {
      "totalResultCount": {
          "정상": 2,
          "주의": 2,
          "심각": 2
      },
    
      "userStatusList": [
          {
              "userNo": "1",
              "userName": "오연택",
              "totalResult": "정상", 
              "userDrink": "정상",
              "userTemp": "정상",
              "userOxygen": "정상",
              "userHeartRate": "정상"
    
          },
          {
              "userNo": "2",
              "userName": "김민서",
              "totalResult": "주의", 
              "userDrink": "정상",
              "userTemp": "정상",
              "userOxygen": "정상",
              "userHeartRate": "주의"
              
          },
          {
              "userNo": "3",
              "userName": "박광수",
              "totalResult": "심각",
              "userDrink": "정상",
              "userTemp": "심각",
              "userOxygen": "정상",
              "userHeartRate": "정상"
              
          },
          {
              "userNo": "4",
              "userName": "이채원",
              "totalResult": "심각",
              "userDrink": "심각",
              "userTemp": "정상",
              "userOxygen": "정상",
              "userHeartRate": "정상"
              
          },
          {
              "userNo": "5",
              "userName": "윤예지",
              "totalResult": "주의",
              "userDrink": "정상",
              "userTemp": "정상",
              "userOxygen": "정상",
              "userHeartRate": "주의"
              
          },
          {
              "userNo": "6",
              "userName": "박현재",
              "totalResult": "정상",
              "userDrink": "정상",
              "userTemp": "정상",
              "userOxygen": "정상",
              "userHeartRate": "정상"
              
            }
        ]
     }
    ```

 * * *
### 📕(Back) 전날 평균 근로시간 요청
- **URL**: `/yesterday/average-worktime`
- **Method**: GET
- **성공 응답**:
   - **Content**:
    ```json
    {
       "hours": 8,
       "minutes": 36
   } 
    ```


  
