import { useEffect, useState } from "react";
import { Alert, Button, TextInput } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Vibration
} from "react-native";
import Checkbox from "expo-checkbox";


const cosinaIp = "http://192.168.100.147:1000";
const comedorIp = "http://192.168.100.200:1002";

function App1() {
  const [inicioCocina, setInicioCocina] = useState(cosinaIp);
  const [inicioComedor, setInicioComedor] = useState(comedorIp);
  const [autoCocina, setAutoCocina] = useState(false);
  const [intervaloCocina, setIntervaloCocina] = useState("");
  const [autoComedor, setAutoComedor] = useState(false);
  const [intervaloComedor, setIntervaloComedor] = useState("");
  const [controlDeLuz, setControlDeLuz] = useState("");

  const [onRefresh, setOnRefresh] = useState(false);

  const loadData = async () => {
    //status cocina
    try {
      await fetch(`${cosinaIp}/inicio`)
        .then((res) => {
          return res.text();
        })
        .then((resp) => {
          if (resp.includes("Checkbox")) {
            setAutoCocina(true);
            setIntervaloCocina(resp.substring(22,19))
            let positionInicialComedor= resp.search("automaticocomedor")
            let positionFinalComedor= resp.search("Cgrabatiemp")          
            const automaticoComedor = resp.substring(positionFinalComedor,positionInicialComedor+17) === "1"? true:false
            setAutoComedor(automaticoComedor)
            let inicioIntervaloComedor= resp.search("Cgrabatiemp=")
            let finalIntervaloComedor= resp.search(" hora")
            setIntervaloComedor((resp.substring(finalIntervaloComedor,inicioIntervaloComedor+12)))
            let positionInicial= resp.search("controldeluz")
            let positionFinal= resp.search("entrada")
            setControlDeLuz(resp.substring(positionFinal,positionInicial+12))


          } else {
            setAutoCocina(false);
            setIntervaloCocina(resp.substring(12,9))
            let positionInicial= resp.search("controldeluz")
            let positionFinal= resp.search("entrada")
            setControlDeLuz(resp.substring(positionFinal,positionInicial+12))
          }
        })
        
    } catch (error) {
      console.log(error);
    }

    //status comedor
    try {
      await fetch(`${comedorIp}/inicio`)
        .then((res) => {
          return res.text();
        })
        .then((resp) => {
          if (resp.includes("Checkbox")) {
            // setAutoComedor(true);
            // setIntervaloComedor(resp.substring(22,19))
            
          } else {
            // setAutoComedor();
            // setIntervaloComedor(resp.substring(12,9))
          }
        })
      } catch (error) {
        console.log(error);
      }finally{setOnRefresh(false)}
    // console.log("**************************************");
    // console.log("status cocina", autoCocina);
    // console.log("status comedor", autoComedor);
  };

  useEffect(() => {
    setOnRefresh(true);
    loadData();
  }, []);

  const handleLigth = (data) => {
    Vibration.vibrate()
    console.log("data: ", data);

    let sendDataCocina = "";
    let sendDataComedor = "";

    //client.println(s + "Lucesinicio"  + luzcomedor1 + luzcomedor2 + luz1prendida + luz2prendida );
    switch (data) {
      //cocina
      case "autoCocinaOn":
        !autoCocina
          ? (sendDataCocina = "autoon")
          : (sendDataCocina = "autooff");
        setAutoCocina(!autoCocina);

        break;

      case "encender":
        sendDataCocina = data;
        break;

      //comedor
      case "autoComedorOn":
        !autoComedor
          ? (sendDataCocina = "autoonpircomedor")
          : (sendDataCocina = "autoofpircomedor");
        setAutoComedor(!autoComedor);

        break;
      case "encender1":
        sendDataComedor = data;
        break;
      case "encender2":
        sendDataComedor = data;
        break;

      default:
        break;
    }

    if (sendDataComedor !== "") {
      try {
        fetch(`${comedorIp}/${sendDataComedor}`)
          .then((resp) => {
            return resp.text();
          })
          .then((data) => console.log(data));
      } catch (error) {
        console.log(error);
      }
    }
    if (sendDataCocina !== "") {
      try {
        fetch(`${cosinaIp}/${sendDataCocina}`)
          .then((resp) => {
            return resp.text();
          })
          .then((data) => console.log(data));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleIntervalCocina = async (interval)=>{
       //status cocina
       const valor = interval * 1000
        
       try {
        await fetch(`${cosinaIp}/grabatiempo=${valor}`)
          .then((res) => {
            Alert.alert("tiempo actualizado")
            return res.text()
          })
                   
      } catch (error) {
        console.log(error);
      }
  }
  const handleIntervalComedor = async (interval)=>{
    //status cocina
    const valor =interval * 1000
     
    try {
     await fetch(`${cosinaIp}/Cgrabatiemp=${valor}`)
       .then((res) => {
         Alert.alert("tiempo actualizado")
         return res.text()
       })
                
   } catch (error) {
     console.log(error);
   }
}
const handleControlDeLuz = async (value)=>{
  try {
   await fetch(`${cosinaIp}/controldeluz${value}`)
     .then((res) => {
       Alert.alert("actualizado")
       return res.text()
     })
              
 } catch (error) {
   console.log(error);
 }
}
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar  barStyle='default' />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={onRefresh} onRefresh={loadData} />
        }
      >
        <View>
          <View style={styles.contenedor}>
            <View style={styles.section}>
              <Checkbox
                style={{ height: 25, width: 25, margin: 10 }}
                disabled={false}
                value={autoCocina}
                onValueChange={() => handleLigth("autoCocinaOn")}
                />
              <TouchableOpacity onPress={()=>handleLigth("autoCocinaOn")}>
                <Text style={{ fontSize: 15, margin: 5 ,color:"#5D6D7E"}}>Automatico Cocina</Text>
              </TouchableOpacity>
              <Text>Temporizador</Text>
              <TextInput style={styles.input} 
                placeholder="000" 
                keyboardType="phone-pad" 
                value={intervaloCocina}
                onChangeText={(value) => setIntervaloCocina(value)}
                onSubmitEditing={(value) => handleIntervalCocina(value.nativeEvent.text)}
                />
            </View>
            <TouchableOpacity onPress={() => handleLigth("encender")}>
              <Text style={[styles.boton, { backgroundColor: "#757575" }]}>
                Encender
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.contenedor}>
          
          <View style={styles.section}>
            <Checkbox
              style={{ height: 25, width: 25, margin: 10 }}
              disabled={false}
              value={autoComedor}
              onValueChange={() => handleLigth("autoComedorOn")}
              />
            <TouchableOpacity  onPress={() =>handleLigth("autoComedorOn")}>
              <Text style={{ fontSize: 15, margin: 5 ,color:"#5D6D7E"}}>Automatico Comedor</Text>
            </TouchableOpacity>
            <Text>Temporizador</Text>
            <TextInput style={styles.input} 
              placeholder="000" 
              keyboardType="phone-pad" 
              value={intervaloComedor}
              onChangeText={(value) => setIntervaloComedor(value)}
              onSubmitEditing={(value) => handleIntervalComedor(value.nativeEvent.text)}
            />

          </View>
          <TouchableOpacity onPress={() => handleLigth("encender1")}>
            <Text style={[styles.boton, { backgroundColor: "#757575" }]}>
              Encender
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLigth("encender2")}>
            <Text style={[styles.boton, { backgroundColor: "#757575" }]}>
              Encender
            </Text>
          </TouchableOpacity>
          
          </View>
          <View style={styles.section}>
            <Text style={{ fontSize: 15, margin: 10 ,color:"#5D6D7E"}}>Sensor de luz</Text>
            <TextInput style={styles.input} 
                placeholder="000" 
                keyboardType="phone-pad" 
                value={controlDeLuz}
                onChangeText={(value) => setControlDeLuz(value)}
                onSubmitEditing={(value) => handleControlDeLuz(value.nativeEvent.text)}             
                />
          </View>
        </View>
          
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width:"100%",
    flex: 1,
    paddingTop: StatusBar.currentHeight ,
    backgroundColor:"#e5e4e2",
  },
  boton: {
    textAlign: "center",
    color: "white",
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 20,
    fontSize: 20,
    margin: 5,
  },
  section: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"flex-start",
    alignItems:"center",
  },
  contenedor:{
    // backgroundColor:"#bebebe",
    display:"flex",
    justifyContent:"center",
    borderColor:"#dcdcdc",
    borderWidth:1,
    margin:5
  },
  input: {
    borderColor: "#AEB6BF",
    color:"#707B7C",
    width: "12%",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal:10,
    padding:5,
    marginLeft:5
  },
});

export default App1;
