
#include <Time.h>
#include <TimeLib.h>

#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <DHT.h>
#define DHTTYPE DHT11
#define DHTPIN  14 //entrada sensor de temperatura
DHT dht(DHTPIN, DHTTYPE,11); // 11 works fine for ESP8266
float humidity, temp_f;
// IPAddress ip(192,168,1,148); // wifi home
//IPAddress gateway(192,168,1,1); // wifi home
// IPAddress subnet(255,255,255,0); // wifi home
// const char* ssid = "wifi home"; // wifi home
// const char* password = "dv6911us"; // wifi home

IPAddress ip(192,168,100,147);
IPAddress gateway(192,168,100,1);
IPAddress subnet(255,255,255,0);
const char* ssid = "Home 2022";
const char* password = "MARIFAB23231100";

WiFiServer server(1000);

void setup() {
  
   Serial.begin(115200);
  Serial.println("Booting");
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  WiFi.config(ip, gateway, subnet);
   server.begin();
  while (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.println("Connection Failed! Rebooting...");
    delay(5000);
    ESP.restart();
  }

  // Port defaults to 8266
  //ArduinoOTA.setPort(1000);

  // Hostname defaults to esp8266-[ChipID]
   ArduinoOTA.setHostname("myesp8266");

  // No authentication by default
  ArduinoOTA.setPassword("pelado");

  // Password can be set with it's md5 value as well
  // MD5(admin) = 21232f297a57a5a743894a0e4a801fc3
  // ArduinoOTA.setPasswordHash("21232f297a57a5a743894a0e4a801fc3");

  ArduinoOTA.onStart([]() {
    String type;
    //if (ArduinoOTA.getCommand() == U_FLASH)
      //        type = "sketch";
  // else // U_SPIFFS
    //  type = "filesystem";
  
    // NOTE: if updating SPIFFS this would be the place to unmount SPIFFS using SPIFFS.end()
    Serial.println("Start updating " + type);
  });
  ArduinoOTA.onEnd([]() {
    Serial.println("\nEnd");
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
    else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
    else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
    else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
    else if (error == OTA_END_ERROR) Serial.println("End Failed");
  });
  ArduinoOTA.begin();
  Serial.println("Ready");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  
  pinMode(5, OUTPUT); //salida de rele
  pinMode(12, INPUT);//sensor movimiento comedor(pircocina)
  pinMode(13, INPUT);//sensor de luz fotoresistencia(luz)
  pinMode(4, INPUT);//sensor movimiento cocina (entrada)
 
  
  dht.begin();
 // Serial.begin(9600);
  delay(10);
   // Connect to WiFi network
  // Start the server
 // server.begin();
}

int val = 0;
int entrada = 0;
int pircocina = 0;
long previousMillis = 0;   // almacenar
long previousMillis1 = 0;   // 
long previousMillisLuz = 0;   // 
int intervalo = 250000;   // intervalo del parpadeo (en milisegundos)
int Cintervalo = 500000;   // intervalo del parpadeo de comedor (en milisegundos)
int grabatiempo = 0;
int automatico = 1;
int automaticocomedor = 1;
int luz = 0;
int mando1 = 0;
int mando2 = 0;
int luzcomedor1 =  1;
int luzcomedor2 =  0;
int luz1prendida=0;
int luz2prendida=0;
int valoranalogico=0;
int controldeluz=0;
int horaapagar = 8;
int minutoprender = 10;
int horaprender = 17;
int minutoapagar =20;
int fueradehora=0;


 
void loop() {
 ArduinoOTA.handle();
  // valoranalogico=analogRead(A0);
 /*while (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.println("Connection Failed! Rebooting...");
    delay(5000);
    ESP.restart();
  }*/  
 //  while (WiFi.status() != WL_CONNECTED){
   if (WiFi.status() != WL_CONNECTED){
         WiFi.begin(ssid, password);
          WiFi.config(ip, gateway, subnet);
          delay(5000);
    } 
   
   entrada = digitalRead(4);
   pircocina = digitalRead(12);
   //photoresistencia = digitalRead(13); //photorresistencia
   /////////////////////////////////////////////////////////////////////////////////////////////////luz = digitalRead(13); //photorresistencia

 String s = "HTTP/1.1 200 OK\r\n";
  s += "Content-Type: text/html\r\n\r\n";
  /////////////////////////////////////////////////////////////////////////////

  unsigned long currentMillis = millis();    // Se toma el tiempo actual

   
   valoranalogico=analogRead(A0);
    delay(30);
 //se desactiva todo lo que es control de luz (Luz) /// esta activdo ahora de nuevo porque es invierno y muy oscuro
if (( valoranalogico > controldeluz) && luz == 0){              //esta oscuro
    luz = 1;
         /// Escaleraautoon();///////manda msg a escalera autoon
          automatico = 1; 
     }
else if (( valoranalogico < controldeluz - 200) && luz == 1 ){   //esta iluminado
  luz = 0;
        /// Escaleraautoof();//////manda msg a escalera autoof
        }
   
  
  //Serial.println(intervalo);
  
   // humidity = dht.readHumidity();          // Read humidity (percent)
   // temp_f = dht.readTemperature();
  ////comando para mandar datos a paguina en este caso el celu con android////
 
  
  
  

  /////// automatico//////
if (entrada > 0 && luz == 1 ) {
 ///  if (entrada > 0  ) {
    previousMillis = currentMillis;
    previousMillisLuz = currentMillis;
    if (val == 0) {
      if (automatico == 1) {
        val = 1;
        previousMillis = currentMillis;
        previousMillisLuz = currentMillis;
        //}
      }
    }

  }
  
 /////////////pir manda mensaje a esp8266 de comedor//////
if (pircocina > 0 && luz == 1 && luzcomedor1 == 1 ){
// if (pircocina > 0 && luzcomedor1 == 1 ){
   previousMillis1 = currentMillis;
   previousMillisLuz = currentMillis;
   if (mando1 == 0){
       if (automaticocomedor == 1){
       //mando1=1;
       WiFiClient Client;
       Client.connect("192.168.100.200",1002);
      //  String url = "/MovimientoOn";
           String url = "/encender1";  
          String host = "192.168.100.200:1002" ;
          Client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" + 
               "Connection: close\r\n\r\n");
         previousMillis1 = currentMillis;
        previousMillisLuz = currentMillis;
        luz1prendida=1;
        mando1=1;
        }}}

 if (pircocina > 0 && luz == 1 && luzcomedor2 == 1 ){
 //if (pircocina > 0 && luzcomedor2 == 1 ){
          previousMillis1 = currentMillis;
        previousMillisLuz = currentMillis;
        if (mando2 == 0){
          if(automaticocomedor==1){
             //  mando2=1;         
          WiFiClient Client;
          Client.connect("192.168.100.200",1002);
      //  String url = "/MovimientoOn";
           String url = "/encender2";  
            String host = "192.168.100.200:1002" ;
            Client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" + 
               "Connection: close\r\n\r\n");
          previousMillis1 = currentMillis;
        previousMillisLuz = currentMillis;
        luz2prendida=1;
        mando2=1;
          }}
      //}
      }
 
  //if ((currentMillis - previousMillis1 > Cintervalo)||(currentMillis - previousMillisLuz > 5000)){
   if (currentMillis - previousMillis1 > Cintervalo){
         if (mando1 == 1 or mando2 ==1) {
             luz1prendida=0;
      luz2prendida=0;
      mando1=0;
      mando2=0;
             WiFiClient Client;
             Client.connect("192.168.100.200",1002);
             String url = "/MovimientoOff";
            String host = "192.168.100.200:1002" ;
            Client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" + 
               "Connection: close\r\n\r\n");
            previousMillis1 = currentMillis;
        previousMillisLuz = currentMillis;
        //Serial.println("automatico off");
     
       
            // }
      }
    
  }
  /*/////////////////////////////////////////////////////////
  if (entrada > 0 && automatico == 1 && val==0){
  val = 1;
  previousMillis = currentMillis;
  //Serial.println("automatico on");
  }
  *////////////////////////////////////////////////////////////
  //if ((currentMillis - previousMillis > intervalo)||( currentMillis - previousMillisLuz > 5000))   {
  if (currentMillis - previousMillis > intervalo)   {
      
        if (automatico == 1 ) {
      if (val == 1) {
        val = 0;
        previousMillis = currentMillis;
       previousMillisLuz = currentMillis;
        //Serial.println("automatico off");
      }
    }
  }

////////////////////////////////////////////////////////////////////

////se apagan escalera y pasillo hora 8:20
if (hour()== horaapagar - 1){
 if (minute()== minutoapagar ){
  if (second()> 55  ){
      Escaleraautoof();
      delay(30);
      Pasilloautooff();  
      delay(30);
  }
 }
}
////se apagan  cocina y comedor hora 9:20
if (hour()== horaapagar + 1){
 if (minute()== minutoapagar ){
  if (second()> 55  ){
      Comedorautoof();
      delay(30);
      automatico = 0;  
      //////////val=0;
  }
 }
}
////Hora autoon cosina y comedor  16:20
if (hour()== horaprender  ){
 if (minute()== minutoprender ){
   if (second()> 55  ){
          Comedorautoon();
          //delay(30);
          //Escaleraautoon();
         // delay(30);
         // Pasilloautoon(); // lo manda dentro del if del autoon de la escalera
          delay(30);
          automatico = 1;  
  }
 }
}
////Hora autoon comedor    17:10
if (hour()== horaprender -1){
 if (minute()== minutoprender ){
       if (second()> 55  ){ 
          //Comedorautoon();
          //delay(30);
          //Escaleraautoon();
         // delay(30);
         // Pasilloautoon(); // lo manda dentro del if del autoon de la escalera
          //delay(30);
         // automatico = 1;  
  }
 }
}
////Hora de prender escalera 19:10 
if (hour()== horaprender + 1 ){
 if (minute()== minutoprender ){
  if (second()> 55  ){
          //Comedorautoon();
          //delay(30);
          Escaleraautoon();
          delay(60);
          //Pasilloautoon(); 
          delay(30);
         // automatico = 1;  
  }
 }
}
////Hora de prender pasillo 19:15
if (hour()== horaprender + 2 ){
 if (minute()== minutoprender + 5){
  if (second()> 55  ){
          //Comedorautoon();
          //delay(30);
         // Escaleraautoon();
          Pasilloautoon(); 
          delay(30);
         // automatico = 1;  
  }
 }
}
///if (luz == 1){
///    previousMillisLuz = currentMillis;
////  }
  
  digitalWrite(5, val);
 
  // Check if a client has connected

 WiFiClient client = server.available();
  if (!client) {
   return;
  }
  
  // Wait until the client sends some data
 
  while(!client.available()){
    delay(1);
  }


String req = client.readStringUntil('\n');

  // s += "<!DOCTYPE HTML>\r\n<html>\r\n";

 

  if (req.indexOf("encender") != -1  && val != 1) {
    val = 1;
    //Serial.println(val);
    //Serial.println("encendido");
   client.print(s + "Encendido" + intervalo/1000);
   
  }
  else if (req.indexOf("encender") != -1  && val != 0) {
    val = 0;
   client.print(s + "Apagadooo" + intervalo/1000);
 Serial.println("mandamos encender");
  }
  
 
  else if (req.indexOf("apagar") != -1 && val != 0) {
    val = 0;

    //Serial.println(val);
    //Serial.println("apagado");
    client.print(s + "Apagadooo" + intervalo/1000);

  }

////Automatico on / off comedor/////
else if (req.indexOf("autoonpircomedor") != -1 ) {
    mando1=0;
    mando2=0;
    automaticocomedor=1;
    delay(50);
  }
else if (req.indexOf("autoofpircomedor") != -1  ) {
      
  automaticocomedor=0;
   luz1prendida=0;
   luz2prendida=0;
   delay(50);
  }
 
////////////////////////////////////

  
  else if (req.indexOf("autoon") != -1 && automatico != 1 ) {

    automatico = 1 ;

    //Serial.println(val);
    //Serial.println("Automatico habilitado desde android");
    client.print(s + "Automatico On");
  delay(60);
          //Pasilloautoon();
  }

  else if (req.indexOf("autooff") != -1 && automatico  != 0  ) {
    automatico = 0;
    val = 0;
    //Serial.println(val);
    //Serial.println("Automatico deshabilitado desde android");
    client.print(s + "Automatico Off");
  delay(60);
        //  Pasilloautooff();

  delay(60);
///////////autooff modulo de escalera////////////
        //  Escaleraautoof();
          
  }

  ///grabatiempo///
  else if (req.indexOf("grabatiempo=") != -1  ) {
    // else if (req.indexOf("grabatiempo=") != -1 && grabatiempo  != 1  ){
     // intervalo = (req.substring(12,15)).toInt();
      //int indice  = req.indexOf('=');
  String ValorBuscado  = (req.substring(17,req.length()-9));
    
     Serial.print("largo total de req: ");
    Serial.println(req.length());
       Serial.print("Largo valorbuscado");
    Serial.println(ValorBuscado.length());
       Serial.print("numero solo;");
    Serial.println(req.substring(17,req.length()-9));
     Serial.print("Valorbuscado;");
    Serial.println(ValorBuscado);
    intervalo = ValorBuscado.toInt();
    Serial.print("Intervalo;");
    Serial.println(intervalo);
    
   
   
      // intervalo = 4444;
client.print(s + "grabando....");

///////////////////este es nuevo tiempo de comedor aparte////////////////////////////
  }
  else if (req.indexOf("Cgrabatiemp=") != -1  ) {
    // else if (req.indexOf("grabatiempo=") != -1 && grabatiempo  != 1  ){
     // intervalo = (req.substring(12,15)).toInt();
      //int indice  = req.indexOf('=');
  String ValorBuscado  = (req.substring(17,req.length()-9));
    
    Serial.print("largo total de req: ");
    Serial.println(req.length());
    Serial.print("Largo valorbuscado");
    Serial.println(ValorBuscado.length());
    Serial.print("numero solo;");
    Serial.println(req.substring(17,req.length()-9));
    Serial.print("Valorbuscado;");
    Serial.println(ValorBuscado);
    Cintervalo = ValorBuscado.toInt();
    Serial.print("Intervalo;");
    Serial.println(Cintervalo);
    
   
   
      // intervalo = 4444;
    client.print(s + "grabando....");

}

  else if (req.indexOf("Lucesestado1") != -1 ) {
  
  String luces1estadoBuscada  = (req.substring(17,req.length()-9)); 
 luzcomedor1 = luces1estadoBuscada.toInt();   
 

  }

  else if (req.indexOf("Lucesestado2") != -1 ) {
  
  String luces2estadoBuscada  = (req.substring(17,req.length()-9)); 
  luzcomedor2 = luces2estadoBuscada.toInt();   
 

  }
  else if (req.indexOf("Lucesinicio") != -1 ) {
      delay(30);
      client.println(s + "Lucesinicio"  + luzcomedor1 + luzcomedor2 + luz1prendida + luz2prendida );

  }

  else if (req.indexOf("inicio") != -1 ) {
    
   String luzBuscada  = (req.substring(11,req.length()-9)); 
   controldeluz = luzBuscada.toInt();       
                     
      temp_f = dht.readTemperature(); 
    humidity = dht.readHumidity();          // Read humidity (percent)
    
    if (automatico == 1) {
      
   // client.println(s + "Checkbox Automatico"  + intervalo/1000);
   client.println(s + "Checkbox Automatico"  + intervalo/1000 + valoranalogico + " luz: " +controldeluz +" entrada: " + entrada + " hora " +hour()+":"+minute());
    }

    else {
    client.println(s + "valor=11" + val + intervalo/1000);
  
    }
   delay(200);
  // client.println(s + "Temperature: " +String((int)temp_f)+"ºC" + String((int)humidity)+"%");
     
}
 else if (req.indexOf("temp") != -1 ) {
  
   temp_f = dht.readTemperature(); 
    humidity = dht.readHumidity();          // Read humidity (percent)
   
   delay(20); 
    
   //client.println(s + "Temperature: " + String((int)temp_f) +"ºC" + String((int)humidity)+"%");
   client.println(s + "Temperature: " + ((int)temp_f) +"ºC" + ((int)humidity)+"%");
   
   }
   else if (req.indexOf("tiempo") != -1){
    String Valorhora  = (req.substring(11,13));
    int h=Valorhora.toInt();
    String Valorminuto  = (req.substring(13,15));
    int m=Valorminuto.toInt();
    String Valorsegundo  = (req.substring(11,1));
    int s=Valorsegundo.toInt();
    String Valordia  = (req.substring(12,2));
    int dd=Valordia.toInt();
    String Valormes  = (req.substring(14,2));
    int mm=Valormes.toInt();
    String Valorano  = (req.substring(16,4));
    int aa=Valorano.toInt();
   setTime(h,m,0,11,12,2018);
   
   delay(30);
   
   // client.println(s + "Tiempo: " + h + m);
   }
     delay(60);

}


void Escaleraautoon(){
   WiFiClient Client;
          Client.connect("192.168.100.211",80);
          String url = "/autoon";  
          String host = "192.168.100.211:80" ;
          Client.print(String("GET ") + url + " HTTP/1.1\r\n" +
          "Host: " + host + "\r\n" + 
          "Connection: close\r\n\r\n");
}

void Escaleraautoof(){
   WiFiClient Client;
          Client.connect("192.168.100.211",80);
          String url = "/autooff";  
          String host = "192.168.100.211:80" ;
          Client.print(String("GET ") + url + " HTTP/1.1\r\n" +
          "Host: " + host + "\r\n" + 
          "Connection: close\r\n\r\n");
}

void Comedorautoof(){
    luz1prendida=0;
   luz2prendida=0;
    WiFiClient Client;
          Client.connect("192.168.100.200",1002);
          String url = "/autooff";  
          String host = "192.168.100.200:1002" ;
          Client.print(String("GET ") + url + " HTTP/1.1\r\n" +
          "Host: " + host + "\r\n" + 
          "Connection: close\r\n\r\n");
automaticocomedor=0;
  
}

void Comedorautoon(){
          mando1=0;
          mando2=0;
          automaticocomedor=1;
          delay(50);
  WiFiClient Client;
          Client.connect("192.168.100.200",1002);
          String url = "/autoon";  
          String host = "192.168.100.200:1002" ;
          Client.print(String("GET ") + url + " HTTP/1.1\r\n" +
          "Host: " + host + "\r\n" + 
          "Connection: close\r\n\r\n");
}
void Pasilloautooff(){
   WiFiClient Client;
          Client.connect("192.168.100.232",80);
          String url = "/autooff";  
          String host = "192.168.100.232:80" ;
          Client.print(String("GET ") + url + " HTTP/1.1\r\n" +
          "Host: " + host + "\r\n" + 
          "Connection: close\r\n\r\n"); 
}
void Pasilloautoon(){
   WiFiClient Client;
          Client.connect("192.168.100.232",80);
          String url = "/autoon";  
          String host = "192.168.100.232:80" ;
          Client.print(String("GET ") + url + " HTTP/1.1\r\n" +
          "Host: " + host + "\r\n" + 
          "Connection: close\r\n\r\n"); 
}
