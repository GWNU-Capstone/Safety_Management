from flask import Flask
import serial

app = Flask(__name__)


@app.route('/')
def index():
    ser = serial.Serial('/dev/cu.usbmodem111101', 9600)  # 시리얼 포트 열기
    ADSerial = ser.readline().decode().strip()  # 시리얼에서 데이터 읽기
    ser.close()  # 시리얼 포트 닫기
    print(ADSerial)

    values = ADSerial.split()

    # Spring 서버로 온도 값을 전달 (GET)
    import requests
    spring_server_url = '127.0.0.1:8080'

    if (values[0] != "nan"):
        requests.get(spring_server_url + '/temperature', params={'value': values[0]}) #작업장 온도
    if (values[1] != "nan"):
        requests.get(spring_server_url + '/humidity', params={'value': values[1]}) #작업장 습도
    if (values[2] != "nan"):
        requests.get(spring_server_url + '/objecttemp', params={'value': values[2]}) #작업자 체온
    if (values[3] != "nan"):
        requests.get(spring_server_url + '/alcohol', params={'value': values[3]}) #작업자 음주
    if (values[4] != "nan"):
        requests.get(spring_server_url + '/bpm', params={'value': values[4]}) #작업자 심박
    if (values[5] != "nan"):
        requests.get(spring_server_url + '/sp02', params={'value': values[5]}) #작업자 산소포화도

    return 'Data sent to Spring server: ' + ADSerial


if __name__ == '__main__':
    app.run(debug=True)
