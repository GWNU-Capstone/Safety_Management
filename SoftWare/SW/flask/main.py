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

#camera = Picamera2()

#camera.configure(camera.create_still_configuration())

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

#전역변수
g_hr = -1.000
g_spo2 = -1.000
g_temp = -1.0
#status = 0 : 측정전   1 : 심각      2 : 주의      3 : 정상
bpm_status = 0
spo2_status = 0
usertemp_status = 0
re = False

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
    global re
    re = True
    usertemp_status = 0
    time.sleep(0.5)
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
    


#음주 엔드포인트
@app.route('/drink', methods=['GET'])
def drinkreturn():
    return get_sensor_data_alc()
    
def read_temperature():
    try:
        data = bus.read_i2c_block_data(0x5A,0x07,3)
        
        temp = (data[1] << 8) | data[0]
        
        temp = temp * 0.02 - 273.15
        return temp
        
    except Exception as e:
        print(f"Error reading from sensor: {e}" )
        return None
        
def get_sensor_data_tempheart():
    hrm.start_sensor()
    #status = 0 : 측정전   1 : 심각      2 : 주의      3 : 정상
    global g_hr, g_spo2, g_temp, bpm_status, spo2_status, usertemp_status, re
    print(f"global value: {g_hr} {g_spo2} {g_temp} {bpm_status} {spo2_status} {usertemp_status}")
    while True:
        #hrm.start_sensor()
        if re == True:
            g_hr = -1.000
            g_spo2 = -1.000
            g_temp = -1.0
            bpm_status = 0
            spo2_status = 0
            usertemp_status = 0
            time.sleep(0.3)
            re = False
        time.sleep(0.5)
        bpm = hrm.bpm
        spo2 = hrm.spo2
        usertemp = read_temperature()
        
        #bpm
        if g_hr == -1.000 and bpm > 30.000: #측정전
            g_hr = bpm
            print(f"global value: {g_hr} {g_spo2} {g_temp} {bpm_status} {spo2_status} {usertemp_status}")
        if (30 < bpm < 50 or bpm > 120) and bpm_status <= 1: #심각
            g_hr = bpm
            bpm_status = 1
            print(f"global value: {g_hr} {g_spo2} {g_temp} {bpm_status} {spo2_status} {usertemp_status}")
        if (50 <= bpm <= 59 or 101 <= bpm <= 120) and bpm_status < 2 : # 주의
            g_hr = bpm
            bpm_status = 2
            print(f"global value: {g_hr} {g_spo2} {g_temp} {bpm_status} {spo2_status} {usertemp_status}")
        if 60 <= bpm <= 100 and bpm_status <= 3 : #정상
            g_hr = bpm
            bpm_status = 3
            print(f"global value: {g_hr} {g_spo2} {g_temp} {bpm_status} {spo2_status} {usertemp_status}")
            
        #spo2
        if g_spo2 == -1.000 and spo2 > 85.000: #측정전
            g_spo2 = spo2
            print(f"global value: {g_hr} {g_spo2} {g_temp} {bpm_status} {spo2_status} {usertemp_status}")
        if 85 < spo2 <= 90 and spo2_status <= 1: #심각
            g_spo2 = spo2
            spo2_status = 1
            print("changed spo2 1")
            print(f"global value: {g_hr} {g_spo2} {g_temp} {bpm_status} {spo2_status} {usertemp_status}")
        if 90 < spo2 < 95 and spo2_status < 2 : # 주의
            g_spo2 = spo2
            spo2_status = 2
            print("changed spo2 2")
            print(f"global value: {g_hr} {g_spo2} {g_temp} {bpm_status} {spo2_status} {usertemp_status}")
        if spo2 >= 95.000 and spo2_status <= 3 : #정상
            g_spo2 = spo2
            spo2_status = 3
            print("changed spo2 3")
            print(f"global value: {g_hr} {g_spo2} {g_temp} {bpm_status} {spo2_status} {usertemp_status}")

        #temp
        if g_temp == -1.0 and usertemp > 20.0 and usertemp < 50: #측정전
            g_temp = usertemp
            print(f"global value: {g_hr} {g_spo2} {g_temp} {bpm_status} {spo2_status} {usertemp_status}")
        if 35.0 <= usertemp <= 38.1 and usertemp_status < 1:#심각
            g_temp = usertemp
            usertemp_status = 1
            print("changed temp 1")
            print(f"global value: {g_hr} {g_spo2} {g_temp} {bpm_status} {spo2_status} {usertemp_status}")
        if 37.3 <= usertemp <= 38.0 and usertemp_status < 2:# 주의
            g_temp = usertemp
            usertemp_status = 2
            print("changed temp 2")
            print(f"global value: {g_hr} {g_spo2} {g_temp} {bpm_status} {spo2_status} {usertemp_status}")
        if 35.1 <= usertemp <= 37.2 and usertemp_status <= 3 : #정상
            g_temp = usertemp
            usertemp_status = 3
            print("changed temp 3")
            print(f"global value: {g_hr} {g_spo2} {g_temp} {bpm_status} {spo2_status} {usertemp_status}")
    return 0 
    
threading.Thread(target=get_sensor_data_tempheart, daemon=True).start()
#체온 심박 엔드포인트
@app.route('/tempheart', methods=['GET'])
def tempheart_return():
    global g_hr, g_spo2, g_temp, bpm_status, spo2_status, usertemp_status
    
    while True:
        if bpm_status >= 1 and spo2_status >= 1: #and usertemp_status >= 1:
                result_tempheart = {}
                result_tempheart['userHeartRate'] = g_hr
                result_tempheart['userSpo2'] = round(g_spo2,3)
                result_tempheart['userTemp'] = 36.5#round(g_temp,1)
                return jsonify(result_tempheart)

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

def ardu_sensor_data():
    while True:
        try:
            time.sleep(5)
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').rstrip()
                print(line)
                p_values = line.split()
                
                # p_values ?? ??
                if len(p_values) < 11:  # ??? ??? ?? 10 ???? ??
                    print("Error: Not enough data in line")
                    continue  # ??? ???? ??? ?? ???? ???

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
                        return 0
                    else:
                        print(f'Server error: {response.status_code}')
                except Exception as e:
                    print(f'Request failed: {e}')
        
        except Exception as e:
            print(f'Error occurred: {e}')
            time.sleep(5) 
def post_sensor_data():
    while True:
        time.sleep(30)
        ardu_sensor_data()
        
threading.Thread(target=post_sensor_data, daemon=True).start()
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
