#include <DHT.h>
#include <Adafruit_MLX90614.h>

#include <Wire.h>
#include "MAX30105.h"

#include "heartRate.h" //심박수
#include "spo2_algorithm.h" //산소포화도

#define DHTPIN 2          // DHT 센서 연결 핀
#define DHTTYPE DHT11     // DHT 타입
#define MQ3PIN A5

DHT dht(DHTPIN, DHTTYPE);
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
MAX30105 particleSensor;

/* 심박센서 */
const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; //Time at which the last beat occurred
float beatsPerMinute;
int beatAvg;

void setup() {
  Serial.begin(9600);
  dht.begin(); // 온습도센서
  mlx.begin(); // 체온센서

  /* 심박센서 */
  particleSensor.setup(); //Configure sensor with default settings
  particleSensor.setPulseAmplitudeRed(0x0A); //Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0); //Turn off Green LED
}

void loop() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();  // 온도 값을 읽음
  float objecttemp = mlx.readObjectTempC()/98*100;
  float alcohol = analogRead(MQ3PIN)

  /* 심박센서 */
  long irValue = particleSensor.getIR();
  if (checkForBeat(irValue) == true)
  {
    //We sensed a beat!
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 20)
    {
      rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
      rateSpot %= RATE_SIZE; //Wrap variable

      //Take average of readings
      beatAvg = 0;
      for (byte x = 0 ; x < RATE_SIZE ; x++)
        beatAvg += rates[x];
      beatAvg /= RATE_SIZE;
    }
  }

  /* 공사장 온도, 습도, 체온, 음주, 심박수, */
  String data = String(temperature) + " " + String(humidity) + " " + String(objecttemp) + " " String(alcohol) + " " + String(beatsPerMinute); //산소포화도 추가예정
  Serial.println(data);                // 시리얼 통신으로 온도 값을 전송
  delay(2000);                                 // 2초 기다림
}