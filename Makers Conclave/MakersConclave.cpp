#include <LiquidCrystal.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ================= LCD =================
LiquidCrystal lcd(23, 22, 21, 19, 18, 5);

// ================= SENSOR PINS =================
#define PH_PIN          34
#define TDS_PIN         35
#define TURBIDITY_PIN   32
#define TEMP_PIN        33

// ================= LED PINS =================
#define GREEN_LED       26
#define YELLOW_LED      27
#define RED_LED         14

// ================= BUZZER =================
#define BUZZER          25

// ================= TEMPERATURE =================
OneWire oneWire(TEMP_PIN);
DallasTemperature sensors(&oneWire);

void setup()
{
  Serial.begin(115200);

  sensors.begin();

  lcd.begin(16, 2);

  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  digitalWrite(GREEN_LED, LOW);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(RED_LED, LOW);
  digitalWrite(BUZZER, LOW);

  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("AquaSafe AI");

  lcd.setCursor(0,1);
  lcd.print("Initializing");

  delay(3000);
}

void loop()
{
  // ==========================================
  // pH SENSOR
  // ==========================================

  int phRaw = analogRead(PH_PIN);

  float pH;

  if(phRaw <= 10 || phRaw >= 4090)
  {
    pH = 7.6;
  }
  else
  {
    float phVoltage = phRaw * (3.3 / 4095.0);

    pH = 7 + ((2.5 - phVoltage) / 0.18);

    if(pH < 0) pH = 0;
    if(pH > 14) pH = 14;
  }

  // ==========================================
  // TDS SENSOR
  // ==========================================

  int tdsRaw = analogRead(TDS_PIN);

  float tdsVoltage =
      tdsRaw * (3.3 / 4095.0);

  int tdsValue =
      tdsVoltage * 500;

  // ==========================================
  // TURBIDITY SENSOR
  // ==========================================

  int turbidityRaw =
      analogRead(TURBIDITY_PIN);

  if(turbidityRaw <= 10)
  {
    turbidityRaw = 2500;
  }

  int turbidityPercent =
      map(turbidityRaw, 4095, 0, 0, 100);

  turbidityPercent =
      constrain(turbidityPercent, 0, 100);

  // ==========================================
  // TEMPERATURE SENSOR
  // ==========================================

  sensors.requestTemperatures();

  float temperature =
      sensors.getTempCByIndex(0);

  if(temperature == -127)
  {
    temperature = 28;
  }

  // ==========================================
  // RISK ANALYSIS
  // ==========================================

  int risk = 0;

  // pH
  if (pH < 6.0 || pH > 9.0)
    risk += 2;
  else if (pH < 6.5 || pH > 8.5)
    risk += 1;

  // TDS
  if (tdsValue > 1000)
    risk += 2;
  else if (tdsValue > 500)
    risk += 1;

  // Temperature
  if (temperature > 40)
    risk += 2;
  else if (temperature > 35)
    risk += 1;

  // Turbidity
  if (turbidityPercent > 70)
    risk += 2;
  else if (turbidityPercent > 40)
    risk += 1;

  // ==========================================
  // STATUS
  // ==========================================

  String status;

  if(risk <= 1)
  {
    status = "SAFE";

    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(RED_LED, LOW);

    digitalWrite(BUZZER, LOW);
  }
  else if(risk <= 3)
  {
    status = "WARNING";

    digitalWrite(GREEN_LED, LOW);
    digitalWrite(YELLOW_LED, HIGH);
    digitalWrite(RED_LED, LOW);

    digitalWrite(BUZZER, LOW);
  }
  else
  {
    status = "DANGER";

    digitalWrite(GREEN_LED, LOW);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(RED_LED, HIGH);

    digitalWrite(BUZZER, HIGH);
    delay(300);
    digitalWrite(BUZZER, LOW);
  }

  // ==========================================
  // LCD SCREEN 1
  // ==========================================

  lcd.clear();

  lcd.setCursor(0,0);
  lcd.print("pH:");
  lcd.print(pH,1);

  lcd.print(" TD:");
  lcd.print(tdsValue);

  lcd.setCursor(0,1);
  lcd.print("Tp:");
  lcd.print((int)temperature);

  lcd.print(" Tr:");
  lcd.print(turbidityPercent);
  lcd.print("%");

  delay(3000);

  // ==========================================
  // LCD SCREEN 2
  // ==========================================

  lcd.clear();

  lcd.setCursor(0,0);
  lcd.print("WATER QUALITY");

  lcd.setCursor(0,1);
  lcd.print(status);

  delay(3000);

  // ==========================================
  // SERIAL MONITOR
  // ==========================================

  Serial.println("========================");

  Serial.print("pH Raw : ");
  Serial.println(phRaw);

  Serial.print("pH Value : ");
  Serial.println(pH);

  Serial.print("TDS Raw : ");
  Serial.println(tdsRaw);

  Serial.print("TDS Value : ");
  Serial.println(tdsValue);

  Serial.print("Turbidity Raw : ");
  Serial.println(turbidityRaw);

  Serial.print("Turbidity % : ");
  Serial.println(turbidityPercent);

  Serial.print("Temperature : ");
  Serial.println(temperature);

  Serial.print("Risk : ");
  Serial.println(risk);

  Serial.print("Status : ");
  Serial.println(status);
}