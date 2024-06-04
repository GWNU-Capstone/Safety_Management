import adc as adc
import time   
     
while True:
	print(adc.get_bright_sensor())
	time.sleep(1)
