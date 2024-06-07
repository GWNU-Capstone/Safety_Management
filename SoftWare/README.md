## 🗂️ API 상세 정보
### 📘 Software 아두이노(Arduino) + 라즈베리파이(Raspberry Pi)
### 📘(Software) 지문 정보 요청
- **URL**: `/users/fingerprint`
- **Method**: GET
- **성공 응답**:
  - **지문 검색 실패**:
    ```json
    {"fingerprint_results":"Not Found"}
    ```
  - **지문 검색 시간초과**:
    ```json
    {"fingerprint_results":"No Response"}
    ```
  - **지문 검색 성공**:
    ```json
    {"fingerprint_results":0} 
    ```
* * *
### 📘(Software) 지문 추가 요청
- **URL**: `/users/fingerprint/add?location=`
- **Method**: GET
- **성공 응답**:
  - **지문 등록 성공**:
    ```json
    {"fingerprint_addresults":"Stored model at #1"}
    ```
  - **지문 등록 실패**:
    ```json
    {"fingerprint_addresults":"False"}
    ```  
* * *
### 📘(Software) 지문 삭제 요청
- **URL**: `/users/fingerprint/rm?location=`
- **Method**: GET
- **성공 응답**:
  - **지문 삭제 성공**:
    ```json
    {"fingerprint_removeresults":"Template at location 1 deleted successfully."}
    ```
  - **지문 삭제 실패 (location에 아무것도 입력되지 않은 경우)**:
    ```json
    {"fingerprint_removeresults":"location value is none"}
    ```
  - **지문 삭제 실패 (location에 0부터 127 사이의 정수가 입력되지 않은 경우)**:
    ```json
    {"fingerprint_removeresults":"Invalid location. Please provide a location between 0 and 127."}
    ```
* * *
### 📘(Software) 심박, 산소포화도 요청
- **URL**: `/users/fingerprint/tempheart`
- **Method**: GET
- **성공 응답**:
  - **성공**:
    ```json
    {"userHeartRate":120.032,"userSpo2":99.982,"userTemp":37.0}
    ```
* * *
### 📘(Software) 음주 정보 요청
- **URL**: `/users/fingerprint/drink`
- **Method**: GET
- **성공 응답**:
  - **성공**:
    ```json
    {"userdrink":0.01}
    ```
