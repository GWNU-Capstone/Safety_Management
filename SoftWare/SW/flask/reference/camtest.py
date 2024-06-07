from flask_cors import CORS
from flask import Flask, request, jsonify, send_file
import serial
from heartrate_monitor import HeartRateMonitor
from smbus2 import SMBus
from mlx90614 import MLX90614
from picamera2 import Picamera2
import time
from datetime import datetime
import math
import threading
import requests
import json
import as608_combo_lib3 as as608
import adc as adc

app = Flask(__name__)
CORS(app) #Frontend CORS Error. 주석처리하면 프론트에서 에러!


camera = Picamera2()

camera.configure(camera.create_still_configuration())

@app.route('/camera', methods=['GET'])
def take_a_picture():
    camera.start()
    current_time = datetime.now()
    timestamp_str = current_time.strftime("%Y%m%d_%H%M%S")
    file_name = f"/home/capstone/Desktop/camera/{timestamp_str}.jpg"
    camera.capture_file(file_name)
    print(f"Image captured as {file_name}")
    camera.stop()
    return send_file(file_name,mimetype='image/jpeg')
    
#threading.Thread(target=post_sensor_data, daemon=True).start()
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
