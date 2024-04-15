from flask import Flask
import serial

app = Flask(__name__)
ser = serial.Serial('/dev/ttyUSB0', 9600)  # 아두이노가 연결된 시리얼 포트

#지문 엔드포인트
@app.route('/user/fingerprint', methods=['GET'])
def get_sensor_data():
    fingerprint_value = 0 #임시값 입니다.
    #ser.write(b'ReadSensor\n')  # 아두이노로 센서값 요청
    #sensor_value = ser.readline().strip().decode()  # 아두이노로부터 센서값 읽기
    return fingerprint_value

#음주 엔드포인트
@app.route('/user/drink', methods=['GET'])
def get_sensor_data():
    ser.write(b'alc\n')  # 아두이노로 센서값 요청
    alcsensor_value = ser.readline().strip().decode()  # 아두이노로부터 센서값 읽기
    return alcsensor_value

#체온 심박 엔드포인트
@app.route('/user/tempheart', methods=['GET'])
def get_sensor_data():
    ser.write(b'temp\n')  # 아두이노로 센서값 요청
    tempsensor_value = ser.readline().strip().decode()  # 아두이노로부터 센서값 읽기
    return tempsensor_value


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)