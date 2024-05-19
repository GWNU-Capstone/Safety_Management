#include <Adafruit_MLX90614.h>

Adafruit_MLX90614 mlx = Adafruit_MLX90614();

#define MQ3PIN A0
void setup() {
  Serial.begin(9600);
  mlx.begin();
}

void loop() {
  float alcohol = analogRead(MQ3PIN);
  float temp = mlx.readObjectTempC();
  //float temp = 36.50; //temp Value
  
  if (Serial.available() > 0) {
    String request = Serial.readStringUntil('\n');
    request.trim();
    if (request == "alc")
    {
      Serial.println(alcohol);
    }
    else if (request == "temp")
    {
      Serial.println(temp);
    }
  }
  delay(500); 
}
