///esp8266 que esta en el comedor (boca de luz)/////////////

#include <ESP8266WiFi.h>

String temperatura;
IPAddress ip(192,168,100,200);
IPAddress gateway(192,168,100,1);
IPAddress subnet(255,255,255,0);
const char* ssid = "Home 2022";
const char* password = "MARIFAB23231100";

WiFiServer server(1002);

void setup() {
  pinMode(2, OUTPUT);
  pinMode(0, OUTPUT);
    //Serial.begin(9600);
  delay(10);

   // Connect to WiFi network
 
  WiFi.begin(ssid, password);
WiFi.config(ip, gateway, subnet);
 
 delay(10);
  // Start the server
  server.begin();

}

 int val = 0;
 int val1 = 0;


long previousMillis = 0;   // almacenará la última vez que el estado del led se actualizó

int intervalo = 30000;   // intervalo del parpadeo (en milisegundos)
int grabatiempo = 0;
int automatico = 1;


void loop() {
 
  //Serial.println(intervalo);

  //delay(200);

  ////comando para mandar datos a paguina en este caso el celu con android////
  String s = "HTTP/1.1 200 OK\r\n";
  s += "Content-Type: text/html\r\n\r\n";
  /////////////////////////////////////////////////////////////////////////////

  unsigned long currentMillis = millis();    // Se toma el tiempo actual

  /////// automatico//////
  /////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  


  /////////////////////////////////////////////////////////
 
  ///////////////////////////////////////////////////////////
  if (currentMillis - previousMillis > intervalo) {
    if (automatico == 1 ) {
      if (val == 1) {
        val = 0;
        previousMillis = currentMillis;
      }
      if (val1 == 1) {
        val1= 0;
        previousMillis = currentMillis;
      }
    }
  }
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

  
  digitalWrite(2, val);
 digitalWrite(0, val1);
 
 WiFiClient client = server.available();
  if (!client) {
   return;
  }
  
  // Wait until the client sends some data
 
  while(!client.available()){
    delay(1);
  }
 
 String req = client.readStringUntil('\n');
 
//Serial.println(req);
 
// if (Serial.available())
//    client.print(Serial.read());
 
 
  // s += "<!DOCTYPE HTML>\r\n<html>\r\n";
 
 
 if (req.indexOf("temp") != -1  ) {
    if (automatico == 1) {
      client.print(s + "Checkbox Automatico" + intervalo/1000 );
    //  Serial.print(s + "Checkbox Automatico"  + intervalo /1000);
    }



    else 
    {
         client.print(s + "valor=12" + val1 + intervalo/1000);
        
      }
    //Serial.println(val);
    //Serial.println("encendido");
    //Serial.print("temp");
   }
  
  if (req.indexOf("encender1") != -1  ) {
    
    if (val==0){
      val = 1;
      client.print(s + "Encend1on" + intervalo/1000);
    }
    else
    {
       val = 0;
        client.print(s + "Encend1of" + intervalo/1000);
    }
    //Serial.println(val);
    //Serial.println("encendido");


    
   // Serial.print(s + "Encendido1" + intervalo/1000 );
    
  }
  else if (req.indexOf("encender2") != -1 ) {
    if (val1==0){
      val1 = 1;  
    client.print(s + "Encend2on" + intervalo/1000);
    }
    else
    {
      val1=0;
      client.print(s + "Encend2of" + intervalo/1000); 
    }
    

    //Serial.println(val);
    //Serial.println("apagado");
    
  //  Serial.print(s + "Encendido2"  + intervalo/1000);
  }

  else if (req.indexOf("autoon") != -1 && automatico != 1 ) {

    automatico = 1 ;
    val=0;
    val1=0;

    //Serial.println(val);
    //Serial.println("Automatico habilitado desde android");
    client.print(s + "Automatico On");
   // Serial.print(s + "Automatico On");
    
  }

  else if (req.indexOf("autooff") != -1 && automatico  != 0  ) {
    automatico = 0;
    val = 0;
  val1 = 0;
    //Serial.println(val);
    //Serial.println("Automatico deshabilitado desde android");
    client.print(s + "Automatico Off");
   // Serial.print(s + "Automatico Off");
  }

  ///grabatiempo///
  else if (req.indexOf("grabatiempo=") != -1  ) {
    // else if (req.indexOf("grabatiempo=") != -1 && grabatiempo  != 1  ){
    //  intervalo = (req.substring(12,15)).toInt();
    //int indice  = req.indexOf('=');

    String ValorBuscado  = (req.substring(17, req.length() - 9));
   // Serial.print("largo total: ");
   // Serial.println(req.length());
   // Serial.print("Largo valorbuscado");
   // Serial.println(ValorBuscado.length());
   // Serial.print("numero solo;");
    //Serial.println(req.substring(17,req.length()-9));
  //  Serial.println(req.substring(17));
    intervalo = ValorBuscado.toInt();
  //  Serial.println(intervalo);
    // intervalo = 4444;

    client.print(s + "grabando....");
    


  }
   else if (req.indexOf("MovimientoOn") != -1 ) {
  
      if (automatico == 1) {
         
         val = 1;
        client.print(s + "sensor_on" );
     //   Serial.print(s + "sensor_on" );
       }
             
       
       }
    
 else if (req.indexOf("MovimientoOff") != -1 ) {
  
  if (automatico == 1) {
    
     val = 0;
     val1 = 0;
        client.print(s + "sensor_off" );
     //   Serial.print(s + "sensor_off" );
 }
 }
 
  else if (req.indexOf("inicio") != -1 ) {

    if (automatico == 1) {
      client.print(s + "Checkbox Automatico" + intervalo/1000 );
     // Serial.print(s + "Checkbox Automatico"  + intervalo /1000);
    }



    else 
    {
         client.print(s + "valor=11" + val + intervalo/1000);
        
      }
      
  }
  delay(30);
}
