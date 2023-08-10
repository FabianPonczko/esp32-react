import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";



function Intro() { 
  return (
    <SafeAreaView style={[styles.container,{backgroundColor: "#e5e4e2"} ]}>
      <StatusBar  style="auto" />
      <View style={[styles.title,{backgroundColor:"#bfc1c2",height:70}]}>
        <Text style={{marginHorizontal:10,fontSize:16}}></Text>
        </View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        
          
      >
        <View>
          <View style={styles.contenedor}>
            <View style={styles.section}>

            </View>
                <Text style={{width:"80%",height:40,backgroundColor:"#c0c0c0",margin:5,marginTop:40 }}></Text>
                <Text style={{width:"40%",height:40,backgroundColor:"#c0c0c0",margin:5 }}></Text>
                <Text style={{width:"90%",height:40,backgroundColor:"#c0c0c0",margin:5 }}></Text>
                <Text style={{width:"80%",height:40,backgroundColor:"#c0c0c0",margin:5 }}></Text>
                <Text style={{width:"60%",height:40,backgroundColor:"#c0c0c0",margin:5 }}></Text>
                <Text style={{width:"0%",height:40,backgroundColor:"#c0c0c0",margin:5 }}></Text>
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
  }
});

export default Intro;
