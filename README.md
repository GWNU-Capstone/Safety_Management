# 👷🏻 SMART GATE - Safety_Management
> 공사장 출입시스템을 개발해 근로자의 건강 상태 및 근로 환경을 모니터링 하는 시스템 🔥

<p align="center">
  <img width="70%" alt="applogo" src="https://github.com/GWNU-Capstone/Safety_Management/assets/118153233/671cc4b6-7c42-4748-8177-fbf60292f9f9">
  <br><br>
  <img alt="Static Badge" src="https://img.shields.io/badge/Spring%20Boot-Back-%6DB33F?style=for-the-badge&logo=springboot&logoSize=auto">
  <img alt="Static Badge" src="https://img.shields.io/badge/React-Front-%2361DAFB?style=for-the-badge&logo=React&logoSize=auto">
  <img alt="Static Badge" src="https://img.shields.io/badge/Raspberry%20Pi-Hardware-%23A22846?style=for-the-badge&logo=raspberrypi&logoSize=auto">
  <img alt="Static Badge" src="https://img.shields.io/badge/Arduino-Hardware-%2300878F?style=for-the-badge&logo=arduino&logoSize=auto">
</p>

<br>

## 📑 프로젝트 설명
건설 현장에서의 안전 관리 중요성은 매년 점점 증가하고 있습니다.

이러한 문제에 대응하기 위해, 출입 관리와 건강 상태 모니터링을 통합한 시스템을 개발 목표로 선정했습니다.

<br>

## 🕒 개발 기간
* 2024.03.11일 ~

<br>

## 👩🏻‍💻🧑🏻‍💻 프로젝트 멤버
|<img src="https://avatars.githubusercontent.com/u/118153233?v=4" width="100" height="100"/>|<img src="https://avatars.githubusercontent.com/u/163621982?v=4" width="100" height="100"/>|<img src="https://avatars.githubusercontent.com/u/99818847?v=4" width="100" height="100"/>|<img src="https://avatars.githubusercontent.com/u/132491134?v=4" width="100" height="100"/>|<img src="https://avatars.githubusercontent.com/u/148872743?v=4" width="100" height="100"/>|<img src="https://avatars.githubusercontent.com/u/149156628?v=4" width="100" height="100"/>|
|:-:|:-:|:-:|:-:|:-:|:-:|
|[@taek2222](https://github.com/taek2222)|[@chaewon9472](https://github.com/chaewon9472)|[@02present](https://github.com/02present)|[@Yunwendy](https://github.com/Yunwendy)|[@fullmoon1219](https://github.com/fullmoon1219)|[@sapang123](https://github.com/sapang123)|
|✔️ PM - Back |✔️ Back |✔️ Hardware |✔️ Hardware |✔️ Front |✔️ Front |

<br>

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
| **근로자 출근현황 요청**      | GET  | '/today/user-status'           | 출근자, 퇴근자, 미출근자 수와 각각의 목록을 반환한다.     |
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


  
