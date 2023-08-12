import { useEffect, useRef, useState } from "react";
import { Alert,  TextInput } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Animated,
  ToastAndroid,
  StatusBar
} from "react-native";
import { MaterialIcons,Foundation ,Entypo ,MaterialCommunityIcons,AntDesign,FontAwesome    } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as SecureStore from 'expo-secure-store';
import Intro from "./intro";
import { StatusBar as StatusBarExpo} from 'expo-status-bar';

const cosinaIp = "http://192.168.100.147:1000";
const comedorIp = "http://192.168.100.200:1002";

function App1() {
  const [inicioCocina, setInicioCocina] = useState(cosinaIp);
  const [inicioComedor, setInicioComedor] = useState(comedorIp);
  const [autoCocina, setAutoCocina] = useState(false);
  const [intervaloCocina, setIntervaloCocina] = useState("");
  const [autoComedor, setAutoComedor] = useState(false);
  const [intervaloComedor, setIntervaloComedor] = useState("");
  const [luzComedor1, setLuzComedor1] = useState(false);
  const [luzComedor1Activado, setLuzComedor1Activado] = useState(false);
  const [luzComedor2, setLuzComedor2] = useState(false);
  const [luzComedor2Activado, setLuzComedor2Activado] = useState(false);
  const [luzCocina, setLuzCocina] = useState(false);
  const [luzComedor1Encendida, setLuzComedor1Encendida] = useState(false);
  const [luzComedor2Encendida, setLuzComedor2Encendida] = useState(false);
  
  

  const [controlDeLuz, setControlDeLuz] = useState("");
  const [sensorDeLuz, setSensorDeLuz] = useState("");

  const [darkTheme,setDarkTheme] =  useState(false)
  const [tap,setTap] = useState(0)

  const [onRefresh, setOnRefresh] = useState(false);

  async function save() {
    await SecureStore.setItemAsync("clave", "activado");
  }

  async function getValueFor() {
    let result = await SecureStore.getItemAsync("clave");
    // if (result) {
    //   alert("🔐 Here's your value 🔐 \n" + result);
    // } else {
    //   alert('No values stored under that key.');
    // }
    return result
  }

  const loadData = async () => {
     
     const firstInicio = await (getValueFor())
     !firstInicio && save()
    //  await SecureStore.deleteItemAsync("clave");
    //   !used && alert.apply("nada")
    !firstInicio && Speech.speak("bienvenido al asistente de luces del hogar. Con el, podras configurar diferentes funciones, como activar el modo luces en automatico por cada luz en particular, tiempo de encendido, o accionarlas de forma manual, etc.")
    setTap(tap+1)
    console.log(tap)
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
                        
            let positionInicialValorAnalogico= resp.search("valoranalogico")
            setSensorDeLuz(resp.substring(positionInicialValorAnalogico+14,positionInicial))

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
    
    await fetch(`${cosinaIp}/Lucesinicio`)
    .then((res) => {
      return res.text();
    })
    .then((resp) => {
      const luz1 = resp.substring(11,12)
      const luz1Encendida = resp.substring(13,14)
      const luz2 = resp.substring(12,13)
      const luz2Encendida = resp.substring(14,15)
        setLuzComedor1Activado(luz1==1?true:false)
        setLuzComedor1Encendida(luz1Encendida==1?true:false)
        setLuzComedor2Activado(luz2==1?true:false)
        setLuzComedor2Encendida(luz2Encendida==1?true:false)
    })
  };
  
  const fadeIn = useRef(new Animated.Value(0)).current
  const fadeInOnce = useRef(new Animated.Value(0)).current

  useEffect(() => {
    setOnRefresh(true);
    loadData();
      setTimeout(()=>{
        Animated.loop(
          Animated.sequence([
            Animated.timing(fadeIn,
              {
                toValue:1,
                duration:500,
                useNativeDriver: true,
              }),
              Animated.timing(fadeIn,
                {
                  toValue:0,
                  duration:500,
                  useNativeDriver: true,
                })
              ]),
            ).start()
            Animated.timing(fadeInOnce,
              {
                toValue:1,
                duration:1000,
                useNativeDriver: true,
              }).start()
              
            },18000)
          }, []);

  const handleLigth = (data) => {
    // Speech.speak("encendiendo");
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
        case "luzcomedor1":
          sendDataCocina = data;
          break;
        case "luzcomedor2":
          sendDataCocina = data;
          break;
        case "Lucesinicio":
          sendDataCocina = data;
          break;
      //comedor
      case "autoComedorOn":
        
        !autoComedor
          ? (sendDataCocina = "autoonpircomedor",sendDataComedor = "autoon",setLuzComedor1(false),setLuzComedor2(false))
          : (sendDataCocina = "autoofpircomedor",sendDataComedor = "autooff")
          
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
            return resp.text()
            })
            .then(respuesta=>{
              switch (respuesta){
                case `Encend1on${intervaloComedor*3}`:
                  console.log(`Encend1on${intervaloComedor*3}`)
                  setLuzComedor1(true)
                  break;
                  case `Encend1of${intervaloComedor*3}`:
                    console.log(`Encend1of${intervaloComedor*3}`)
                    setLuzComedor1(false)
                    break;
                    case `Encend2on${intervaloComedor*3}`:
                      console.log(`Encend2on${intervaloComedor*3}`)
                      setLuzComedor2(true)
                      break;
                    case `Encend2of${intervaloComedor*3}`:
                        console.log(`Encend2of${intervaloComedor*3}`)
                        setLuzComedor2(false)
                      break;
                    case "Automatico Off":
                      console.log("5, Automatico Off")
                      setLuzComedor1(false)
                      setLuzComedor2(false)
                    break;
                          
                        default:
                            console.log("ssssssssss")
              }
            })
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
          .then((respuesta) => {
            console.log(respuesta)
            switch (respuesta){
              case "Encendido":
                setLuzCocina(true)
                break;
              case "Apagadooo":
                setLuzCocina(false)
                break;
                case "luzcomedor1On-1":
                  console.log("luzcomedor1On-1")
                  setLuzComedor1Activado(true)
                break;
                case "luzcomedor1On-0":
                  console.log("luzcomedor1On-0")
                  setLuzComedor1Activado(false)
                break;
                case "luzcomedor2On-1":
                  console.log("luzcomedor2On-1")
                  setLuzComedor2Activado(true)
                break;
                
                case "luzcomedor2On-0":
                  console.log("luzcomedor2On-0")
                  setLuzComedor2Activado(false)
                break;
                case "Lucesinicio":
                  console.log("Lucesinicio")
                  loadData()
                break;
              default :
                console.log("sin dato")
            }
          });
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
            ToastAndroid.show('Tiempo actualizado!', ToastAndroid.SHORT);
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
        //  Alert.alert("tiempo actualizado")
         return res.text()
       })
                
   } catch (error) {
     console.log(error);
   }
   try {
    await fetch(`${comedorIp}/grabatiempo=${valor*3}`)
      .then((res) => {
        ToastAndroid.show('Tiempo actualizado!', ToastAndroid.SHORT);
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
    <SafeAreaView style={[styles.container,{backgroundColor: darkTheme ? "#17202A":"#e5e4e2"} ]}>
      <StatusBarExpo style="ligth" backgroundColor= {!darkTheme ? "#2471A3" :"#D35400"} />
      {onRefresh?<Intro/>
      :<View>
      <View style={[styles.title,{backgroundColor:!darkTheme ? "#2471A3" :"#D35400"}]}>
        <AntDesign name="home" size={24} color= {darkTheme ? "#ECF0F1" :"#ECF0F1" }/>
        <Text style={{marginHorizontal:10,fontSize:20,color:"#ECF0F1"}}>Asistente luces del Hogar</Text>
        <TouchableOpacity onPress={()=>setDarkTheme(!darkTheme)}>
          <Foundation  name="background-color" size={24} color={darkTheme ? "#F1948A" :"#7FB3D5"} style={{marginLeft:45}}/>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={onRefresh} onRefresh={loadData} />}
      >
        <View>
          <View style={styles.contenedor}>
            <View style={styles.section}>
              {/* <Checkbox
                style={{ height: 25, width: 25, margin: 10 }}
                disabled={false}
                value={autoCocina}
                onValueChange={() => handleLigth("autoCocinaOn")}
                /> */}
              <TouchableOpacity onPress={()=>handleLigth("autoCocinaOn")}>

              {autoCocina
              ?
              <MaterialCommunityIcons name="toggle-switch" size={50} color= {darkTheme ? "#8bbe1b":"#21421e"} style={{marginHorizontal:10}}/>
              :
              <MaterialCommunityIcons name="toggle-switch-off-outline" size={50} color={darkTheme ? "white":"black"} style={{marginHorizontal:10}}/>
            }
            </TouchableOpacity>
              <TouchableOpacity onPress={()=>handleLigth("autoCocinaOn")}>
                <Text style={{ fontSize: 15, margin: 5 ,color:darkTheme ? "#ECF0F1" :"#424949"}}>Automatico Cocina</Text>
              </TouchableOpacity>
              {/* <Text>Temporizador</Text> */}
              <MaterialIcons name="timer" size={24} color={darkTheme ? "white":"black"} style={{marginHorizontal:10}}/>
              <TextInput style={styles.input} 
                placeholder="000" 
                keyboardType="phone-pad" 
                value={intervaloCocina}
                onChangeText={(value) => setIntervaloCocina(value)}
                onSubmitEditing={(value) => handleIntervalCocina(value.nativeEvent.text)}
                />
                {autoCocina
                ?
                <MaterialCommunityIcons name="motion-sensor" size={34} color= {darkTheme ? "#8bbe1b":"#21421e"} style={{marginLeft:20}} />              :
                <MaterialCommunityIcons name="motion-sensor-off" size={34} color={darkTheme ? "white":"black"} style={{marginLeft:20}} />
                }
            </View>
            <TouchableOpacity disabled={autoCocina} onPress={() => handleLigth("encender")}>
              <Text style={[styles.boton, { backgroundColor: darkTheme ? "#424949" :"#424949"}]}>
              {!luzCocina?"Encender":"Apagar"}
              {autoCocina && <Foundation name="prohibited" size={24} color="red" />}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.contenedor}>
          
          <View style={styles.section}>
            {/* <Checkbox
              style={{ height: 25, width: 25, margin: 10 }}
              disabled={false}
              value={autoComedor}
              onValueChange={() => handleLigth("autoComedorOn")}
            /> */}
            <TouchableOpacity  onPress={() =>handleLigth("autoComedorOn")}>
              {autoComedor
              ?
              <MaterialCommunityIcons name="toggle-switch" size={50} color={darkTheme ? "#8bbe1b":"#21421e"} style={{marginHorizontal:10}}/>
              :
              <MaterialCommunityIcons name="toggle-switch-off-outline" size={50} color={darkTheme ? "white":"black"} style={{marginHorizontal:10}}/>
            }
            </TouchableOpacity>
            <TouchableOpacity  onPress={() =>handleLigth("autoComedorOn")}>
              <Text style={{ fontSize: 15, margin: 5 ,color: darkTheme ? "#ECF0F1" :"#424949"}}>Automatico Comedor</Text>
            </TouchableOpacity>
            {/* <Text>Temporizador</Text> */}
            <MaterialIcons name="timer" size={24} color={darkTheme ? "white":"black"} style={{marginHorizontal:10}}/>
            <TextInput style={styles.input} 
              placeholder="000" 
              keyboardType="phone-pad" 
              value={intervaloComedor}
              onChangeText={(value) => setIntervaloComedor(value)}
              onSubmitEditing={(value) => handleIntervalComedor(value.nativeEvent.text)}
            />
            {autoComedor
                ?
                <MaterialCommunityIcons name="motion-sensor" size={34} color= {darkTheme ? "#8bbe1b":"#21421e"} style={{marginLeft:20}} />              :
                <MaterialCommunityIcons name="motion-sensor-off" size={34} color={darkTheme ? "white":"black"} style={{marginLeft:20}} />
                }
          </View>
          

          <TouchableOpacity disabled={autoComedor} onPress={() => handleLigth("encender1")}>
            {/* <Text style={[styles.boton, { backgroundColor: darkTheme ? "#626567":"#424949" }]}> */}
            <Text style={[styles.boton, {backgroundColor: luzComedor1 || luzComedor1Encendida ? "#008000":"#424949" }]}>
              {!luzComedor1?"Encender1":"Apagar"}
              {autoComedor && <Foundation name="prohibited" size={24} color="red" />}
            </Text>
          </TouchableOpacity>
          
            
          <TouchableOpacity disabled={autoComedor} onPress={() => handleLigth("encender2")}>
            <Text style={[styles.boton, {backgroundColor: luzComedor2 || luzComedor2Encendida ? "#008000":"#424949" }]}>
              {!luzComedor2?"Encender2":"Apagar"}
              {autoComedor && <Foundation name="prohibited" size={24} color="red"/>}
            </Text>
          </TouchableOpacity>
          
          </View>
          <View style={[styles.section,{justifyContent:"flex-start"}]}>
            <Text style={{ fontSize: 15, margin: 10 ,color:darkTheme ? "#ECF0F1" :"#424949"}}>Sensor de luz</Text>
            <MaterialIcons name="nightlight-round" size={20} color={darkTheme ? "#ECF0F1" :"#424949"} />
            <Text style={{color:darkTheme ? "#ECF0F1" :"#424949"}}>/</Text>
            <Entypo name="light-down" size={24} color={darkTheme ? "#ECF0F1" :"#424949"} />
            <TextInput style={styles.input} 
                placeholder="000" 
                keyboardType="phone-pad" 
                value={controlDeLuz}
                onChangeText={(value) => setControlDeLuz(value)}
                onSubmitEditing={(value) => handleControlDeLuz(value.nativeEvent.text)}             
                />
              <Entypo name="light-down" size={24} color="black" style={{color:darkTheme ? "#ECF0F1" :"#424949",marginLeft:20}}/>
              <Text style={{ fontSize: 15,color:darkTheme ? "#ECF0F1" :"#424949"}}>{sensorDeLuz}</Text>
          </View>
        </View>
        <View style={styles.bombilla}>
        <TouchableOpacity disabled={!autoComedor} onPress={() => handleLigth("luzcomedor1")}>
          {luzComedor1Activado ? <MaterialCommunityIcons name="lightbulb-auto-outline" size={64} color={!darkTheme?"black":"white"} />:<MaterialCommunityIcons name="lightbulb-off-outline" size={64} color={!darkTheme?"black":"white"} />}
        <Text style={{ fontSize: 15,color:darkTheme ? "#ECF0F1" :"#424949"}}>Lampara 1</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={!autoComedor} onPress={() => handleLigth("luzcomedor2")}>
          {luzComedor2Activado ? <MaterialCommunityIcons name="lightbulb-auto-outline" size={64} color={!darkTheme?"black":"white"} />:<MaterialCommunityIcons name="lightbulb-off-outline" size={64} color={!darkTheme?"black":"white"} />}
          <Text style={{ fontSize: 15,color:darkTheme ? "#ECF0F1" :"#424949"}}>Lampara 2</Text>
        </TouchableOpacity>
        </View>
        <Animated.View 
          style={{
            opacity:fadeInOnce,
            display:"flex",
            alignItems:"center",
            flex:1,
          }}
        >  
        {tap < 2 && <MaterialCommunityIcons name="gesture-tap" size={54} color={darkTheme ? "#ECF0F1" :"#424949"} />}
        {tap < 2 && <Text style={{color:darkTheme ? "#ECF0F1" :"#424949"}}>down to refresh</Text>}
        
        </Animated.View>
        <Animated.View 
          style={{
            opacity:fadeIn,
            display:"flex",
            alignItems:"center",
            flex:1,
            // marginTop:100
          }}
        >
          {tap < 2 ?<FontAwesome name="angle-double-down" size={24} color={darkTheme ? "#ECF0F1" :"#424949"} style={{margin:1}}/>:null}
        </Animated.View>
      </ScrollView>
      </View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:"100%",
    marginTop: StatusBar.currentHeight
  },
  title:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"center",
    backgroundColor:"#bebebe",
    padding:20,
    
  },
  boton: {  
    textAlign: "center",
    color: "white",
    borderRadius: 5,
    padding: 15,
    marginHorizontal: 10,
    fontSize: 17,
    margin: 5,
  },
  section: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"flex-start",
    alignItems:"center",
    marginStart:0
  },
  contenedor:{
    // backgroundColor:"#bebebe",
    display:"flex",
    justifyContent:"center",
    borderColor:"#AAB7B8",
    borderWidth:2,
    marginVertical:5
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
  bombilla:{
    display:"flex",
    flexDirection:"row",
    width:"100%",
    justifyContent:"space-evenly",
    marginTop:20



  },  
});

export default App1;
