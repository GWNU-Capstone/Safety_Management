import serial
import time
ser = serial.Serial('/dev/ttyACM0',9600,timeout=1)

while True:
	line = ser.readline().decode('utf-8')
	time.sleep(3)
	print(line)
