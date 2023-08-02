import { useEffect, useState } from 'react';
import { Alert, Button } from 'react-native';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import Checkbox from 'expo-checkbox';

const cosinaIp ="http://192.168.100.147:1000"
const comedorIp ="http://192.168.100.200:1002"

function App1() {

  const [inicioCocina, setInicioCocina] = useState(cosinaIp)
  const [inicioComedor, setInicioComedor] = useState(comedorIp)
  const [statusAutoCocina,setStatusAutoCocina] =useState(false)
  const [statusAutoComedor,setStatusAutoComedor] =useState(false)
  

  useEffect (()=>{
    //status cocina
    try {
      fetch(`${cosinaIp}/inicio`)
        .then(res=>{
          return res.text()
        })
        .then(resp =>{

          if (resp.includes("Checkbox")){
            setStatusAutoCocina(true)
          }else{
            setStatusAutoCocina(false)
          }
         } )
        
    } catch (error) {
      console.log(error)
    }
    
    //status comedor
    try {
      fetch(`${comedorIp}/inicio`)
        .then(res=>{
          return res.text()
        })
        .then(resp =>{
          if (resp.includes("Checkbox")){
            setStatusAutoComedor(true)
          }else{
            setStatusAutoComedor()
          }
         
         } )
        
    } catch (error) {
      console.log(error)
    }
    console.log("**************************************inicio programa")
    console.log("status cocina",statusAutoCocina)
    console.log("status comedor",statusAutoComedor)
    
  },[])



  const handleLigth=(data)=>{
    console.log("data: ",data)
  
    let sendDataCocina=""
    let sendDataComedor=""

    //client.println(s + "Lucesinicio"  + luzcomedor1 + luzcomedor2 + luz1prendida + luz2prendida );
    switch (data) {
      //cocina
      case "statusAutoCocina":
        !statusAutoCocina?sendDataCocina="autoon":sendDataCocina="autooff"
        setStatusAutoCocina(!statusAutoCocina)
       
        break;

      case "encender":
        sendDataCocina=data
        break;

      //comedor
      case "statusAutoComedor":
        !statusAutoComedor?sendDataComedor="autoon":sendDataComedor="autooff"
        setStatusAutoComedor(!statusAutoComedor)
       
        break;
      case "encender1":
        sendDataComedor=data
        break;
      case "encender2":
        sendDataComedor=data
        break;

      default:
        
        break;
    }
    
    
    if (sendDataComedor!==""){
      try {
        fetch(`${comedorIp}/${sendDataComedor}`)
        .then(resp=>{
          return resp.text()
        })
        .then(data=>console.log(data))
      } catch (error) {
        console.log(error)
      }
    }
    if (sendDataCocina!==""){
      try {
        fetch(`${cosinaIp}/${sendDataCocina}`)
        .then(resp=>{
          return resp.text()
        })
        .then(data=>console.log(data))
      } catch (error) {
        console.log(error)
      }
    }
     
    }


  return ( 
  
    <View>
      <Text>Cocina</Text>  
      <View style={styles.section}>
        <Checkbox style={{height:45,width:45,margin:10}}
          disabled={false}
          value={statusAutoCocina}
          onValueChange={()=>handleLigth("statusAutoCocina")}
          />
          <Text>Automatico</Text>
      </View>    
      <TouchableOpacity onPress={()=>handleLigth("encender")}>
        <Text style={styles.boton} >Encender</Text>
      </TouchableOpacity>

      <Text>Comedor</Text>
      <View style={styles.section}>
        <Checkbox style={{height:45,width:45,margin:10}}
          disabled={false}
          value={statusAutoComedor}
          onValueChange={()=>handleLigth("statusAutoComedor")}
          />
        <Text>Automatico</Text>
      </View>
      <TouchableOpacity onPress={()=>handleLigth("encender1")}>
        <Text style={styles.boton} >Encender</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>handleLigth("encender2")}>
        <Text style={styles.boton}>Encender</Text>
      </TouchableOpacity>
    
    
    
    </View>
  )
}

const styles = StyleSheet.create({
  boton:{
    backgroundColor:"gray",
    color:"red",
    borderRadius:50,
    padding:20,
    paddingHorizontal:40,
    fontSize:30,
    margin:10
  },
  section:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    

  }
}
  
  
)

export default App1
