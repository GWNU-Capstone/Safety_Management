import time
import spidev
import math

spi = spidev.SpiDev()
spi.open(0,0)
spi.max_speed_hz=1000000
MQ3 = 0
press = 1

R0 = 16000
R2 = 2000

def ReadVol(vol):
   adc = spi.xfer2([1,(8+vol)<<4,0])
   data = ((adc[1]&3)<<8)+adc[2]
   return data
"""
def get_alcvalue():
   time.sleep(2)
   bacsum = 0
   for i in range(10):
      a_0 = ReadVol(0)
      sensorValue = int(a_0)
      sensor_volt = sensorValue / 1024 * 3.0
      RS_gas = ((3.0 * R2) / sensor_volt) - R2
   
      ratio = RS_gas / R0
      x = 0.4 * ratio
      BAC = pow(x, -1.431)
      BAC_gDL = BAC * 0.001
      print("BAC = {:.3f} g/DL".format(BAC_gDL))
      time.sleep(0.3)
      bacsum += BAC_gDL
   return round(bacsum/10, 3)
"""

def get_alcvalue():
   a_0 = ReadVol(0)
   sensorValue = int(a_0)
   sensor_volt = sensorValue / 1024 * 3.0
   RS_gas = ((3.0 * R2) / sensor_volt) - R2
   
   ratio = RS_gas / R0
   x = 0.4 * ratio
   BAC = pow(x, -1.431)
   BAC_gDL = BAC * 0.001
   print("BAC = {:.3f} g/DL".format(BAC_gDL))
   return BAC_gDL

def is_within_range(value,target,tolerance):
   return target * (1-tolerance) <= value <= target * (1 + tolerance)
      
def get_press_sensor():
   return ReadVol(1)
