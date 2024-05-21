#include <pm2008_i2c.h>
#include <DHT11.h>

// #ifdef PM2008N

PM2008_I2C pm2008_i2c;
DHT11 dht11(2);

void setup() {
#ifdef PM2008N
  // wait for PM2008N to be changed to I2C mode
  delay(10000);
#endif
  pm2008_i2c.begin();
  Serial.begin(9600);
  pm2008_i2c.command();
  delay(1000);
}

void loop() {
  uint8_t ret = pm2008_i2c.read();
  if (ret == 0) {
    Serial.print("PM 1.0: ");
    Serial.println(pm2008_i2c.pm1p0_tsi);
    Serial.print(" PM2.5: ");
    Serial.println(pm2008_i2c.pm2p5_tsi);
    Serial.print(" PM10: ");
    Serial.println(pm2008_i2c.pm10_tsi);
    
    
    int temperature = 0;
    int humidity = 0;

    // Attempt to read the temperature and humidity values from the DHT11 sensor.
    int result = dht11.readTemperatureHumidity(temperature, humidity);
    // Check the results of the readings.
    // If the reading is successful, print the temperature and humidity values.
    // If there are errors, print the appropriate error messages.
    if (result == 0) {
        Serial.print(" Temperature: ");
        Serial.print(temperature);
        Serial.print(" Humidity: ");
        Serial.println(humidity);
    } else {
        // Print error message based on the error code.
        Serial.println(DHT11::getErrorString(result));
    }
  }
  delay(1000);
}
