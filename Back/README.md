## 🗂️ API 명세서
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
          "presentCount": 2,
          "departedCount": 0,
          "yetStartedCount": 4,
    
          "presentUsersList": [
          {
              "userName": "이채원",
              "userNo": 4
          },
          {
              "userName": "박광수",
              "userNo": 3
          }
       ],

          "departedUsersList": [],
  
          "yetStartedUsersList": [
          {
              "userName": "오연택",
              "userNo": 1
          },
          {
              "userName": "김민서",
              "userNo": 2
          },
          {
              "userName": "윤예지",
              "userNo": 5
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
