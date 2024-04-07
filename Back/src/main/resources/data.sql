-- 사용자 이름 등록
INSERT INTO user_profile(USER_NO, USER_NAME) values (1,'오연택');
INSERT INTO user_profile(USER_NO, USER_NAME) values (2,'김민서');
INSERT INTO user_profile(USER_NO, USER_NAME) values (3,'박광수');
INSERT INTO user_profile(USER_NO, USER_NAME) values (4,'이채원');
INSERT INTO user_profile(USER_NO, USER_NAME) values (5,'윤예지');
INSERT INTO user_profile(USER_NO, USER_NAME) values (6,'박현재');

-- 사용자 상세 정보
INSERT INTO user_info(USER_NO, USER_IMAGE, USER_FINGER_PRINT, USER_AGE, USER_TELNO) values (1, '1.png', 'Oh.png', 25, '010-8621-6609');
INSERT INTO user_info(USER_NO, USER_IMAGE, USER_FINGER_PRINT, USER_AGE, USER_TELNO) values (2, '2.png', 'Kim.png', 25, '010-3655-4209');
INSERT INTO user_info(USER_NO, USER_IMAGE, USER_FINGER_PRINT, USER_AGE, USER_TELNO) values (3, '3.png', 'Park_1.png', 25, '010-1234-5678');
INSERT INTO user_info(USER_NO, USER_IMAGE, USER_FINGER_PRINT, USER_AGE, USER_TELNO) values (4, '4.png','Lee.png', 24, '010-5136-7490');
INSERT INTO user_info(USER_NO, USER_IMAGE, USER_FINGER_PRINT, USER_AGE, USER_TELNO) values (5, '5.png','Yun.png', 24, '010-8555-3544');
INSERT INTO user_info(USER_NO, USER_IMAGE, USER_FINGER_PRINT, USER_AGE, USER_TELNO) values (6, '6.png','Park_2.png', 23, '010-9137-9513');

-- 사용자 데이터 정보
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, DATE, USER_START, USER_END) values (1, 0.01, 79, 35.1, '2024-04-01', '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, DATE, USER_START, USER_END) values (1, 0.02, 91, 37.4, '2024-04-01', '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, DATE, USER_START, USER_END) values (2, 0.00, 89, 36.1, '2024-04-01', '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, DATE, USER_START, USER_END) values (2, 0.01, 92, 37.4, '2024-04-01', '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, DATE, USER_START, USER_END) values (3, 0.01, 79, 35.1, '2024-04-01', '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, DATE, USER_START, USER_END) values (3, 0.02, 91, 37.4, '2024-04-01', '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, DATE, USER_START, USER_END) values (4, 0.01, 79, 35.1, '2024-04-01', '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, DATE, USER_START, USER_END) values (4, 0.02, 91, 37.4, '2024-04-01', '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, DATE, USER_START, USER_END) values (5, 0.01, 79, 35.1, '2024-04-01', '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, DATE, USER_START, USER_END) values (5, 0.02, 91, 37.4, '2024-04-01', '08:30:00', '19:30:00');

INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, DATE, USER_START, USER_END) values (6, 0.01, 79, 35.1, '2024-04-01', '08:30:00', '19:30:00');
INSERT INTO user_data(USER_NO, USER_DRINK, USER_HEARTRATE, USER_TEMP, DATE, USER_START, USER_END) values (6, 0.02, 91, 37.4, '2024-04-01', '08:30:00', '19:30:00');