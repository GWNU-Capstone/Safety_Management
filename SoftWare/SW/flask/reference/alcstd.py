import time
import sys
import adc as adc

arg = 0.00

if len(sys.argv) == 2:
    try:
        arg = float(sys.argv[1])
    except ValueError:
        print("Error: The argument bust be a float.")
        sys.exit(1)
print(f"Argument: {arg}")
while True:
	print(adc.get_alcvalue(arg))
	time.sleep(0.5)
	
