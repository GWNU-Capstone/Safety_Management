-- 사용자 이름 등록
INSERT INTO user_profile(USER_NO, USER_NAME) values (1,'오연택');
INSERT INTO user_profile(USER_NO, USER_NAME) values (2,'김민서');
INSERT INTO user_profile(USER_NO, USER_NAME) values (3,'박광수');
INSERT INTO user_profile(USER_NO, USER_NAME) values (4,'이채원');
INSERT INTO user_profile(USER_NO, USER_NAME) values (5,'윤예지');
INSERT INTO user_profile(USER_NO, USER_NAME) values (6,'박현재');

-- 사용자 상세 정보
INSERT INTO user_info(USER_NO, USER_FINGER_PRINT, USER_AGE, USER_TELNO) values (1, 'Oh.png', 25, '010-8621-6609');
INSERT INTO user_info(USER_NO, USER_FINGER_PRINT, USER_AGE, USER_TELNO) values (2, 'Kim.png', 25, '010-3655-4209');
INSERT INTO user_info(USER_NO, USER_FINGER_PRINT, USER_AGE, USER_TELNO) values (3, 'Park_1.png', 25, '010-1234-5678');
INSERT INTO user_info(USER_NO, USER_FINGER_PRINT, USER_AGE, USER_TELNO) values (4, 'Lee.png', 24, '010-5136-7490');
INSERT INTO user_info(USER_NO, USER_FINGER_PRINT, USER_AGE, USER_TELNO) values (5, 'Yun.png', 24, '010-8555-3544');
INSERT INTO user_info(USER_NO, USER_FINGER_PRINT, USER_AGE, USER_TELNO) values (6, 'Park_2.png', 23, '010-9137-9513');

-- 사용자 데이터 정보
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_START, USER_END) values (1, 0.01, 79, 35.1, '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_START, USER_END) values (1, 0.02, 91, 37.4, '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_START, USER_END) values (2, 0.00, 89, 36.1, '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_START, USER_END) values (2, 0.01, 92, 37.4, '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_START, USER_END) values (3, 0.01, 79, 35.1, '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_START, USER_END) values (3, 0.02, 91, 37.4, '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_START, USER_END) values (4, 0.01, 79, 35.1, '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_START, USER_END) values (4, 0.02, 91, 37.4, '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_START, USER_END) values (5, 0.01, 79, 35.1, '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_START, USER_END) values (5, 0.02, 91, 37.4, '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_START, USER_END) values (6, 0.01, 79, 35.1, '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, USER_START, USER_END) values (6, 0.02, 91, 37.4, '08:30:00', '19:30:00');