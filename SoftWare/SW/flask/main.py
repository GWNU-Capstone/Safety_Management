from flask_cors import CORS
from flask import Flask, request, jsonify
import serial
from heartrate_monitor import HeartRateMonitor
import time
import as608_combo_lib as as608

app = Flask(__name__)
CORS(app) #Frontend CORS Error. 주석처리하면 프론트에서 에러!

session = as608.connect_serial_session("/dev/ttyUSB0") # 지문인식기 Serial
print(session)

#Heartrate Sensor
hrm = HeartRateMonitor()
hrm.start_sensor()

#지문 센서 정보 확인 엔드포인트
@app.route('/fingerprint/info', methods=['GET'])
def get_sensor_info_fp():
    result_info = {}
    result_info['templates_list'] = as608.get_templates_list(session)
    result_info['templates_countes'] = as608.get_templates_count(session)
    return jsonify(result_info)

#지문 검색 엔드포인트
@app.route('/fingerprint', methods=['GET'])
def get_sensor_data_fp():
    return str(as608.search_fingerprint_on_device(session, as608))

#지문 등록 엔드포인트
@app.route('/fingerprint/add/', methods=['GET'])
def fingerprint_add():
    location = int(request.args.get('location'))
    return str(as608.enroll_finger_to_device(session, as608, location))

#지문 전체 삭제 엔드포인트
@app.route('/fingerprint/rmall/', methods=['GET'])
def fingerprint_remove_all():
    return as608.delete_all_templates(session)

@app.route('/fingerprint/rm/', methods=['GET'])
def fingerprint_remove():
    location = request.args.get('location')
    return str(as608.delete_templates(session,location))

#음주 엔드포인트, 일정 압력이 들어왔을 때 수치 리턴해야 함.
@app.route('/drink', methods=['GET'])
def get_sensor_data_alc():
    if press > 0:
        return alcsensor_value
    else:
        return "airflow is not detected"

#체온 심박 엔드포인트
@app.route('/tempheart', methods=['GET'])
def get_sensor_data_temp():
    result = {}
    result['userTemp'] = 25.0
    bpm = hrm.bpm
    spo2 = hrm.spo2

    if bpm < 30:
        result['userHeartRate'] = "finger is not detected"
    else:
        result['userHeartRate'] = bpm
    if spo2 < 90:
        result['userSpo2'] = "finger is not detected"
    else:
        result['userSpo2'] = spo2
   # result['userHeartRate'] = "250.0" #임시값
   # result['userSpo2'] = "98.0" #임시값
    return jsonify(result) 
    
@app.route('/hrstart', methods=['GET'])
def startsensor():
    hrm.start_sensor()
    return "OK"

@app.route('/hrstop', methods=['GET'])
def stopsensor():
    hrm.stop_sensor()
    return "OK"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
