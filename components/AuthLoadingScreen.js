import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const AuthLoadingScreen= ({navigation}) => {

    useEffect(()=>{
      checkUserId()
    },[])

    

    const checkUserId = async () =>{
        const userId = await AsyncStorage.getItem('userID');
        navigation.navigate(userId ? 'Main': 'Login');
    }

  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
     <ActivityIndicator size="large" />
    </View>
  )
}

export default AuthLoadingScreen