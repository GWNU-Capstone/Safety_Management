from flask_cors import CORS
from flask import Flask, request, jsonify, send_file
import serial
from heartrate_monitor import HeartRateMonitor
from smbus2 import SMBus
from mlx90614 import MLX90614
import time
import math
import threading
import requests
import json
import as608_combo_lib3 as as608
import adc as adc

app = Flask(__name__)
CORS(app) #Frontend CORS Error. 주석처리하면 프론트에서 에러!

#session = as608.connect_serial_session("/dev/ttyUSB0") # 지문인식기 Serial
#print(session)

#ser = serial.Serial('/dev/ttyACM0',9600,timeout=1)

#Heartrate Sensor
#hrm = HeartRateMonitor()
#hrm.start_sensor()

#tempsensor
#bus = SMBus(3)
#tempsensor = MLX90614(bus,address=0x5A)

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
    result_found['fingerprint_results'] = 2 #as608.search_fingerprint_on_device(session, as608)
    time.sleep(3)
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

#음주 엔드포인트
@app.route('/drink', methods=['GET'])
def get_sensor_data_alc():
    result_drink = {}
    time.sleep(1.5)
    result_drink['userdrink'] = 0.01
    time.sleep(3)
    return jsonify(result_drink)
"""
@app.route('/tempheart', methods=['GET'])
def get_sensor_data_temp():
    result = {}
    result['userTemp'] = 36.5#tempsensor.get_obj_temp()
    bpm = hrm.bpm
    spo2 = hrm.spo2

    if bpm < 30:
        result['userHeartRate'] = "finger is not detected"
    else:
        result['userHeartRate'] = round(bpm,3)
    if spo2 < 90:
        result['userSpo2'] = "finger is not detected"
    else:
        result['userSpo2'] = round(spo2,3)
   # result['userHeartRate'] = "250.0" #임시값
   # result['userSpo2'] = "98.0" #임시값
    return jsonify(result) 
"""
#체온 심박 엔드포인트
@app.route('/tempheart', methods=['GET'])
def get_sensor_data_temp():
    result = {}
    result['userHeartRate'] = 120.032
    result['userSpo2'] = 99.982
    result['userTemp'] = 37.0
    time.sleep(3)
    return jsonify(result) 

@app.route('/hrstart', methods=['GET'])
def startsensor():
    hrm.start_sensor()
    return "OK"

@app.route('/hrstop', methods=['GET'])
def stopsensor():
    hrm.stop_sensor()
    return "OK"
    
@app.route('/camera', methods=['GET'])
def take_a_picture():
    file_name = "/home/capstone/Desktop/camera/temp.jpg"
    return send_file(file_name,mimetype='image/jpeg')
    
    
#H2 Server
H2_SERVER_URL = "http://192.168.0.3"
"""
def post_sensor_data():
    while True:
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').rstrip()
            print(line)
            p_values = line.split()
            postdata = {
                'PM1.0' : p_values[1],
                'PM2.5' : p_values[3],
                'PM10' : p_values[5],
                'Temperature' : p_values[7],
                'Humidity' : p_values[9]
            }
            try:
                response = requests.post(H2_SERVER_URL, data=json.dumps(postdata), headers={'Content-Type': 'application/json'})
                if response.status_code == 200:
                    print('Data Sent')
                else:
                    print(f'Server error: {response.status_code}')
            except Exception as e:
                print(f'요청 실패: {e}')
            time.sleep(10)
   """     
#threading.Thread(target=post_sensor_data, daemon=True).start()
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
