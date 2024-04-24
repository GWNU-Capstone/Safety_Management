-- 사용자 이름 등록
INSERT INTO user_profile(USER_NO, USER_NAME) values (1,'오연택');
INSERT INTO user_profile(USER_NO, USER_NAME) values (2,'김민서');
INSERT INTO user_profile(USER_NO, USER_NAME) values (3,'박광수');
INSERT INTO user_profile(USER_NO, USER_NAME) values (4,'이채원');
INSERT INTO user_profile(USER_NO, USER_NAME) values (5,'윤예지');
INSERT INTO user_profile(USER_NO, USER_NAME) values (6,'박현재');

-- 사용자 상세 정보
INSERT INTO user_info(USER_NO, USER_IMAGE, USER_AGE, USER_TELNO, USER_GENDER, USER_POSITION, USER_EMAIL, USER_ADDRESS, USER_BANK, USER_ACCOUNT, USER_JOIN_DATE, USER_WORK_DATE, USER_NOTE) values (1, '1.png', 25, '01086216609', '남', '관리직', '1abc@naver.com', '강원특별자치도 원주시 흥업면 남원로 151', '우리은행', '1002-123-456789', '2024-03-01', '2024-03-04', '비고1');
INSERT INTO user_info(USER_NO, USER_IMAGE, USER_AGE, USER_TELNO, USER_GENDER, USER_POSITION, USER_EMAIL, USER_ADDRESS, USER_BANK, USER_ACCOUNT, USER_JOIN_DATE, USER_WORK_DATE, USER_NOTE) values (2, '2.png', 25, '01036554209', '남', '관리직', '2abc@gogle.com', '강원특별자치도 원주시 흥업면 남원로 152', '국민은행', '233456-23-394285', '2024-03-02', '2024-03-04', '비고2');
INSERT INTO user_info(USER_NO, USER_IMAGE, USER_AGE, USER_TELNO, USER_GENDER, USER_POSITION, USER_EMAIL, USER_ADDRESS, USER_BANK, USER_ACCOUNT, USER_JOIN_DATE, USER_WORK_DATE, USER_NOTE) values (3, '3.png', 25, '01036957571', '남', '관리직', '3abc@naver.com', '강원특별자치도 원주시 흥업면 남원로 153', '신한은행', '342-535-682865', '2024-03-03', '2024-03-04', '비고3');
INSERT INTO user_info(USER_NO, USER_IMAGE, USER_AGE, USER_TELNO, USER_GENDER, USER_POSITION, USER_EMAIL, USER_ADDRESS, USER_BANK, USER_ACCOUNT, USER_JOIN_DATE, USER_WORK_DATE, USER_NOTE) values (4, '4.png', 24, '01051367490', '여', '관리직', '4abc@naver.com', '강원특별자치도 원주시 흥업면 남원로 154', '하나은행', '434-536842-47422', '2024-03-04', '2024-03-04', '비고4');
INSERT INTO user_info(USER_NO, USER_IMAGE, USER_AGE, USER_TELNO, USER_GENDER, USER_POSITION, USER_EMAIL, USER_ADDRESS, USER_BANK, USER_ACCOUNT, USER_JOIN_DATE, USER_WORK_DATE, USER_NOTE) values (5, '5.png', 24, '01085553544', '여', '관리직', '5abc@naver.com', '강원특별자치도 원주시 흥업면 남원로 155', '우리은행', '1003-633-453533', '2024-03-05', '2024-03-04', '비고5');
INSERT INTO user_info(USER_NO, USER_IMAGE, USER_AGE, USER_TELNO, USER_GENDER, USER_POSITION, USER_EMAIL, USER_ADDRESS, USER_BANK, USER_ACCOUNT, USER_JOIN_DATE, USER_WORK_DATE, USER_NOTE) values (6, '6.png', 23, '01091379513', '남', '관리직', '6abc@naver.com', '강원특별자치도 원주시 흥업면 남원로 156', '국민은행', '452644-64-247434', '2024-03-06', '2024-03-04', '비고6');

-- 사용자 데이터 정보
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_OXYGEN, DATE, USER_START, USER_END) values (1, 0.01, 79, 35.1, 94, '2024-04-01', '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_OXYGEN, DATE, USER_START, USER_END) values (1, 0.02, 91, 37.4, 94, '2024-04-02', '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_OXYGEN, DATE, USER_START, USER_END) values (2, 0.00, 89, 36.1, 95, '2024-04-01', '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_OXYGEN, DATE, USER_START, USER_END) values (2, 0.01, 92, 37.4, 95, '2024-04-02', '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_OXYGEN, DATE, USER_START, USER_END) values (3, 0.01, 79, 35.1, 96, '2024-04-01', '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_OXYGEN, DATE, USER_START, USER_END) values (3, 0.02, 91, 37.4, 96, '2024-04-02', '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_OXYGEN, DATE, USER_START, USER_END) values (4, 0.01, 79, 35.1, 97, '2024-04-01', '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_OXYGEN, DATE, USER_START, USER_END) values (4, 0.02, 91, 37.4, 97, '2024-04-02', '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_OXYGEN, DATE, USER_START, USER_END) values (5, 0.01, 79, 35.1, 98, '2024-04-01', '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_OXYGEN, DATE, USER_START, USER_END) values (5, 0.02, 91, 37.4, 98, '2024-04-02', '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_OXYGEN, DATE, USER_START, USER_END) values (6, 0.01, 79, 35.1, 99, '2024-04-01', '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_OXYGEN, DATE, USER_START, USER_END) values (6, 0.02, 91, 37.4, 99, '2024-04-02', '08:30:00', '19:30:00');