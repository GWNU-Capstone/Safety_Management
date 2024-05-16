from flask_cors import CORS
from flask import Flask, request, jsonify
import serial
from heartrate_monitor import HeartRateMonitor
from smbus2 import SMBus
from mlx90614 import MLX90614
import time
import as608_combo_lib3 as as608

app = Flask(__name__)
CORS(app) #Frontend CORS Error. 주석처리하면 프론트에서 에러!

session = as608.connect_serial_session("/dev/ttyUSB0") # 지문인식기 Serial
print(session)

#Heartrate Sensor
hrm = HeartRateMonitor()
hrm.start_sensor()

#tempsensor
bus = SMBus(1)
tempsensor = MLX90614(bus,address=0x5A)

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
    result_found = {}
    result_found['fingerprint_results'] = 1 #as608.search_fingerprint_on_device(session, as608)
    return jsonify(result_found)

#지문 등록 엔드포인트
@app.route('/fingerprint/add/', methods=['GET'])
def fingerprint_add():
    result_add = {}
    location_arg = request.args.get('location')
    location = int(location_arg) if location_arg.strip() != '' else None
    result_add['fingerprint_addresults'] = str(as608.enroll_finger_to_device(session, as608, location))
    return jsonify(result_add)

#지문 전체 삭제 엔드포인트
#@app.route('/fingerprint/rmall/', methods=['GET'])
#def fingerprint_remove_all():
#    return as608.delete_all_templates(session)

@app.route('/fingerprint/rm/', methods=['GET'])
def fingerprint_remove():
    result_delete = {}
    location = request.args.get('location')
    result_delete['fingerprint_removeresults'] = str(as608.delete_templates(session,location))
    return jsonify(result_delete)

#음주 엔드포인트, 일정 압력이 들어왔을 때 수치 리턴해야 함.
@app.route('/drink', methods=['GET'])
def get_sensor_data_alc():
    result_drink = {}
    press = 1
    if press > 0:
        result_drink['userdrink'] = 250
    else:
        result_drink['userdrink'] = airflow is not detected
    result_drink['press_sensor'] = press
    return jsonify(result_drink)

#체온 심박 엔드포인트
@app.route('/tempheart', methods=['GET'])
def get_sensor_data_temp():
    result = {}
    result['userTemp'] = 36.7#tempsensor.get_obj_temp()
    bpm = 120.0
    spo2 = 95.0

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
