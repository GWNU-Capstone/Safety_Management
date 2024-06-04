from flask_cors import CORS
from flask import Flask, request, jsonify, send_file
import serial
from heartrate_monitor import HeartRateMonitor
from smbus2 import SMBus
from mlx90614 import MLX90614
from picamera2 import Picamera2
import time
import sys
from datetime import datetime
import math
import threading
import requests
import json
import as608_combo_lib3 as as608
import adc as adc

#import ssl
#import eventlet
#import eventlet.wsgi
arg = 0.01

if len(sys.argv) == 2:
    try:
        arg = float(sys.argv[1])
    except ValueError:
        print("Error: The argument bust be a float.")
        sys.exit(1)
print(f"Argument: {arg}")

app = Flask(__name__)
CORS(app) #Frontend CORS Error. 주석처리하면 프론트에서 에러!

session = as608.connect_serial_session("/dev/ttyUSB0") # 지문인식기 Serial
if session == False:
    session = as608.connect_serial_session("/dev/ttyUSB1") # 지문인식기 Serial
print(session)

camera = Picamera2()

camera.configure(camera.create_still_configuration())

ser = serial.Serial('/dev/ttyACM0',9600,timeout=1)

#Heartrate Sensor
hrm = HeartRateMonitor()
hrm.start_sensor()

#tempsensor
bus = SMBus(3)
tempsensor = MLX90614(bus,address=0x5A)

import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(17,GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(27,GPIO.IN, pull_up_down=GPIO.PUD_UP)

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
    result_found['fingerprint_results'] = as608.search_fingerprint_on_device(session, as608)
    return jsonify(result_found)

#지문 등록 엔드포인트
@app.route('/fingerprint/add/', methods=['GET'])
def fingerprint_add():
    result_add = {}
    location_arg = request.args.get('location')
    location = int(location_arg) if location_arg.strip() != '' else None
    result_add['fingerprint_addresults'] = str(as608.enroll_finger_to_device(session, as608, location))
    return jsonify(result_add)
"""
지문 전체 삭제 엔드포인트
@app.route('/fingerprint/rmall/', methods=['GET'])
def fingerprint_remove_all():
    return as608.delete_all_templates(session)
"""

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
    consecutive_count = 0
    required_consecutive_count = 3
    last_valid_value = None
    drink_first_value = adc.get_alcvalue(arg)
    time.sleep(2)
    print(f"first_value : {drink_first_value}")
    while True:
        time.sleep(0.7)
        sensor_value = adc.get_alcvalue(arg)
        drink_value = round(sensor_value,2)
        if drink_value <= 0.00:
            result_drink['userdrink'] = 0.00
            print("return1")
            return jsonify(result_drink)
        if not adc.is_within_range(drink_first_value, sensor_value, 0.3):
            if last_valid_value is None:
                last_valid_value = drink_value
                consecutive_count = 1
            elif drink_value == last_valid_value:
                consecutive_count += 1
                if consecutive_count == required_consecutive_count:
                    print(f"drink return successed: {drink_value}")
                result_drink['userdrink'] = math.floor(drink_value * 100) / 100
                break
            else:
                last_valid_value = drink_value
                consecutive_count = 1
                print(f"Within range: {drink_value} (Consecutive count: {consecutive_count})")
        elif drink_value == 0.00:
            result_drink['userdrink'] = 0.00
            print('return2')
            return jsonify(result_drink)
        else:
            print(f"drink return failed: {drink_value}")
            consecutive_count = 0
            last_valid_value = None
    print("return4")
    return jsonify(result_drink)
    
def read_temperature():
    try:
        data = bus.read_i2c_block_data(0x5A,0x07,3)
        
        temp = (data[1] << 8) | data[0]
        
        temp = temp * 0.02 - 273.15
        return temp
        
    except Exception as e:
        print(f"Error reading from sensor: {e}" )
        return None
#체온 심박 엔드포인트
@app.route('/tempheart', methods=['GET'])
def get_sensor_data_temp():
    hrm.start_sensor()
    result = {}
    while True:
        time.sleep(0.5)
        bpm = hrm.bpm
        spo2 = hrm.spo2
        usertemp = read_temperature()
        print(bpm,spo2, usertemp)
        if bpm < 30.0 or spo2 < 90.0 or usertemp < 30.0 or usertemp > 45.0 :
            pass
        else:
            result['userHeartRate'] = round(bpm,3)
            result['userSpo2'] = round(spo2,3)
            result['userTemp'] = round(usertemp,3)
            hrm.stop_sensor()
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
    camera.start()
    current_time = datetime.now()
    timestamp_str = current_time.strftime("%Y%m%d_%H%M%S")
    file_name = f"/home/capstone/Desktop/camera/{timestamp_str}.jpg"
    camera.capture_file(file_name)
    print(f"Image captured as {file_name}")
    camera.stop
    return send_file(file_name,mimetype='image/jpeg')
    
    
#H2 Server
H2_SERVER_URL = "http://3.38.71.65/data"

"""
def post_sensor_data():
    while True:
        postdata = {
            "temperature" : 40,
            "humidity": 60,
            "fineDust": 40,
            "sunshine": 65
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
def post_sensor_data():
    while True:
        time.sleep(60)
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').rstrip()
            print(line)
            p_values = line.split()
            postdata = {
                #'PM1.0' : p_values[1],
                #'PM2.5' : p_values[3],
                'fineDust' : p_values[6],
                'temperature' : p_values[8],
                'humidity' : p_values[10],
                'sunshine' : adc.get_bright_sensor()
            }
            print(postdata)
            try:
                response = requests.post(H2_SERVER_URL, data=json.dumps(postdata), headers={'Content-Type': 'application/json'})
                if response.status_code == 200 or response.status_code == 204:
                    print('Data Sent')
                else:
                    print(f'Server error: {response.status_code}')
            except Exception as e:
                print(f'요청 실패: {e}')
threading.Thread(target=post_sensor_data, daemon=True).start()
if __name__ == '__main__':
    #server = eventlet.wrap_ssl(eventlet.listen(('0.0.0.0', 9999)), certfile='./cert.pem', keyfile='./key.pem', server_side=True)
    #eventlet.wsgi.server(server, app)
    #ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS)
    #ssl_context.load_cert_chain(certfile='cert.pem', keyfile='key.pem', password='louie')
    #app.run(host="0.0.0.0", port=443, ssl_context=ssl_context)

    #app.run(host='0.0.0.0', port='443', ssl_context='adhoc')
    app.run(host='0.0.0.0', port=5051)
