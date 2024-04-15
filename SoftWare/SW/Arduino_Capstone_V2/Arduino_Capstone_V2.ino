#include <DHT.h>
#include <Adafruit_MLX90614.h>

#include <Wire.h>
#include "MAX30105.h"

#include "heartRate.h" //심박수
#include "spo2_algorithm.h" //산소포화도

#define DHTPIN 2          // DHT 센서 연결 핀
#define DHTTYPE DHT11     // DHT 타입
#define MQ3PIN A5
#define MAX_BIRGHTNESS 255

DHT dht(DHTPIN, DHTTYPE);
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
MAX30105 particleSensor;

/* 심박센서 */
#if defined(__AVR_ATmega328P__) || defined(__AVR_ATmega168__)
//Arduino Uno doesn't have enough SRAM to store 100 samples of IR led data and red led data in 32-bit format
//To solve this problem, 16-bit MSB of the sampled data will be truncated. Samples become 16-bit data.
uint16_t irBuffer[100]; //infrared LED sensor data
uint16_t redBuffer[100];  //red LED sensor data
#else
uint32_t irBuffer[100]; //infrared LED sensor data
uint32_t redBuffer[100];  //red LED sensor data
#endif

int32_t bufferLength; //data length
int32_t spo2; //SPO2 value
int8_t validSPO2; //indicator to show if the SPO2 calculation is valid
int32_t heartRate; //heart rate value
int8_t validHeartRate; //indicator to show if the heart rate calculation is valid

byte pulseLED = 11; //Must be on PWM pin
byte readLED = 13; //Blinks with each data read

void setup() {
  Serial.begin(9600); //심박센서가 115200이나, 다른 센서가 모두 9600이므로, 9600으로 설정했으나, 심박센서에서의 오류가 발생하면 115200으로 변경 고려
  dht.begin(); // 온습도센서
  mlx.begin(); // 체온센서

  /* 심박센서 */

  pinMode(pulseLED, OUTPUT);
  pinMode(readLED, OUTPUT);

  /* Initialize sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed
  {
    Serial.println(F("MAX30105 was not found. Please check wiring/power."));
    while (1);
  }
  */

  byte ledBrightness = 60; //Options: 0=Off to 255=50mA
  byte sampleAverage = 4; //Options: 1, 2, 4, 8, 16, 32
  byte ledMode = 2; //Options: 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green
  byte sampleRate = 100; //Options: 50, 100, 200, 400, 800, 1000, 1600, 3200
  int pulseWidth = 411; //Options: 69, 118, 215, 411
  int adcRange = 4096; //Options: 2048, 4096, 8192, 16384

  particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange); //Configure sensor with these settings
}

void loop() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();  // 온도 값을 읽음
  float objecttemp = mlx.readObjectTempC()/98*100;
  float alcohol = analogRead(MQ3PIN)

  /* 심박센서 */
  bufferLength = 100; //buffer length of 100 stores 4 seconds of samples running at 25sps

  //read the first 100 samples, and determine the signal range
  for (byte i = 0 ; i < bufferLength ; i++)
  {
    while (particleSensor.available() == false) //do we have new data?
      particleSensor.check(); //Check the sensor for new data

    redBuffer[i] = particleSensor.getRed();
    irBuffer[i] = particleSensor.getIR();
    particleSensor.nextSample(); //We're finished with this sample so move to next sample
  }

  //calculate heart rate and SpO2 after first 100 samples (first 4 seconds of samples)
  maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);

  //Continuously taking samples from MAX30102.  Heart rate and SpO2 are calculated every 1 second
  //dumping the first 25 sets of samples in the memory and shift the last 75 sets of samples to the top
  for (byte i = 25; i < 100; i++)
  {
    redBuffer[i - 25] = redBuffer[i];
    irBuffer[i - 25] = irBuffer[i];
  }
  //take 25 sets of samples before calculating the heart rate.
  for (byte i = 75; i < 100; i++)
  {
    while (particleSensor.available() == false) //do we have new data?
      particleSensor.check(); //Check the sensor for new data
      digitalWrite(readLED, !digitalRead(readLED)); //Blink onboard LED with every data read

      redBuffer[i] = particleSensor.getRed();
      irBuffer[i] = particleSensor.getIR();
      particleSensor.nextSample(); //We're finished with this sample so move to next sample
    }

    //After gathering 25 new samples recalculate HR and SP02
    maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);


  /* 공사장 온도, 습도, 체온, 음주, 심박수, */
  //String data = String(temperature) + " " + String(humidity) + " " + String(objecttemp) + " " String(alcohol) + " " + String(beatsPerMinute); //산소포화도 추가예정
  //Serial.println(data);                // 시리얼 통신으로 온도 값을 전송

  //요청에 대한 응답.
  if (Serial.available() > 0) {
    String request = Serial.readStringUntil('\n');
    request.trim();

    if (request == "alc")
    {
      Serial.println(alcohol);
    }
    else if (request == "temp")
    {
      String tempdata = String(objecttemp + " " + heartRate " " + sp02);
      Serial.println(tempdata);
    }
  }
  delay(500);                                 // 0.5초 기다림
}