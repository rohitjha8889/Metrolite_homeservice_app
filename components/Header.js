import React,{useContext} from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Icons from 'react-native-vector-icons/AntDesign' 
import FontAwesome from 'react-native-vector-icons/FontAwesome' 
import { DataContext } from "../Data/DataContext";


const Header = () =>{
    const { userDetail } = useContext(DataContext);
    let firstName = '';

    if (userDetail && userDetail.userName) {
        const userNameArray = userDetail.userName.split(' '); // Split by whitespace
        firstName = userNameArray[0]; // Take the first word
    }

    return(
        <>
        <View style={styles.container}>
          <Image source={require('../assets/Images/logobg.png')} style={styles.logo}/>
          <Text style={styles.userName}>Hi {firstName} 👋</Text>
         {/* <Icons name="stepforward" size={100}/> */}
         <FontAwesome name="search" size={16}/>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        // marginTop:30,
        height:60,
        // paddingRight:15,
        paddingHorizontal:10,
        backgroundColor:'#fff',
    },

    userName:{
        fontSize:16
    },

    logo:{
        // marginLeft:20,
        width:40,
        height:40
    }
})

export default Header