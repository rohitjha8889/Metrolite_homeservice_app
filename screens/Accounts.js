import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Share, Linking } from 'react-native'
import React, { useContext, useEffect } from 'react'
import Header from '../components/Header'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { createStackNavigator } from '@react-navigation/stack';
import EditProfile from './EditProfile'
import { Address, AddDelieveryAddress, ModifyDelieveryAddress } from './Address'
import { DataContext } from '../Data/DataContext'
import TermsCondition from './TermsCondition'
import AboutApp from './AboutApp'
const Stack = createStackNavigator();

const Accounts = ({ navigation }) => {
  const { logOut, userDetail, IP_ADDRESS} = useContext(DataContext)
  const imageUrl = `${IP_ADDRESS}/userprofilepic/${userDetail.profilePic}`;

  // useEffect(()=>{
  //   console.log(userDetail.userName)
  // },[])

  const shareApp = async () => {
    try {
      const result = await Share.share({
        message: 'https://play.google.com/store/apps/details?id=com.metrolite.metroliteexpo&pcampaignid=web_share', // You can customize the message
        // url: 'https://play.google.com/store/apps/details?id=com.metrolite.metroliteexpo&pcampaignid=web_share', // Replace with your app's URL
      });
      // console.log('Share result:', result);
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };


  const openPlayStore = () => {
    const url = 'https://play.google.com/store/apps/details?id=com.metrolite.metroliteexpo&reviewId=0'; // Replace with your app's URL
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const logOutUser = async () => {
    try {
      await logOut('userID');
      // console.log('User data deleted successfully.');
      navigation.navigate('Login')
    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  };

  return (
    <>
      <Header />
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.account} onPress={() => navigation.navigate('EditProfile')}>
          <Image style={styles.profileImage}  source={{ uri: imageUrl }}/>


          <View style={{ width: '60%' }}>
            <Text style={styles.customerName}>{userDetail.userName || 'Unknown'}</Text>
            <Text style={styles.phone}>+91 {userDetail.phone}</Text>
            <Text style={styles.mail}>{userDetail.emailId || 'Unknown'}</Text>
          </View>
        </TouchableOpacity>


        {/* Menu Bar */}

        <View style={styles.menuBar}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('My Addresses')}>
            <FontAwesome5 name='shipping-fast' color={'grey'} size={25} />
            <Text style={styles.itemName}>My Address</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.menuItem} onPress={shareApp}>
            <Entypo name='share' color={'grey'} size={25} />
            <Text style={styles.itemName}>Share</Text>
          </TouchableOpacity>


          {/* <TouchableOpacity style={styles.menuItem}>
            <Entypo name='suitcase' color={'grey'} size={25} />
            <Text style={styles.itemName}>Jobs</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('About App')}>
            <AntDesign name='questioncircleo' color={'grey'} size={25} />
            <Text style={styles.itemName}>About App</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Term and Condition')}>
            <AntDesign name='infocirlceo' color={'grey'} size={25} />
            <Text style={styles.itemName}>Terms & Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={openPlayStore}>
            <MaterialIcons name='rate-review' color={'grey'} size={25} />
            <Text style={styles.itemName}>Rate us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0, paddingBottom: 0 }]} onPress={logOutUser}>
            <MaterialIcons name='logout' color={'grey'} size={25} />
            <Text style={styles.itemName}>Logout</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </>
  )
}




const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Accounts" component={Accounts} options={{ headerShown: false }} />
      <Stack.Screen name='EditProfile' component={EditProfile} />
      <Stack.Screen name='My Addresses' component={Address} />
      <Stack.Screen name='Add Delievery Address' component={AddDelieveryAddress} />
      <Stack.Screen name='Modify Delievery Address' component={ModifyDelieveryAddress} />
      <Stack.Screen name='Term and Condition' component={TermsCondition} />
      <Stack.Screen name='About App' component={AboutApp} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({

  main: {
    padding: 5,
    // borderWidth:2
  },

  account: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#fff',
    borderRadius: 10
  },
  profileImage: {
   
    width: 80,
    height: 80,
    
    borderRadius: 40
  },
  customerName: {
    fontSize: 18
  },

  phone: {
    color: 'grey'
  },

  mail: {
    color: 'grey'
  },

  profileName: {
    fontSize: 25
  },


  // Menu Bar
  menuBar: {
    backgroundColor: '#fff',
    marginTop: 20,
    elevation: 6,
    shadowColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey'
  },

  itemName: {
    marginLeft: 30,
    fontSize: 18,

  }



})

export default StackNavigator