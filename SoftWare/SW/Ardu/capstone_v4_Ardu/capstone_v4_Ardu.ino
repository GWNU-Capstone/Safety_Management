#include <pm2008_i2c.h>
#include <DHT11.h>

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
    String data = "PM 1.0: " + String(pm2008_i2c.pm1p0_tsi) + " PM2.5: " + String(pm2008_i2c.pm2p5_tsi) + " PM10: " + String(pm2008_i2c.pm10_tsi);
    
    int temperature = 0;
    int humidity = 0;

    // Attempt to read the temperature and humidity values from the DHT11 sensor.
    int result = dht11.readTemperatureHumidity(temperature, humidity);
    // Check the results of the readings.
    // If the reading is successful, append the temperature and humidity values to the data string.
    // If there are errors, append the appropriate error messages.
    if (result == 0) {
        data += " Temperature: " + String(temperature) + " Humidity: " + String(humidity);
    } else {
        data += " Error: " + String(DHT11::getErrorString(result));
    }

    // Send the combined data string
    Serial.println(data);
  }
  delay(1000);
}
