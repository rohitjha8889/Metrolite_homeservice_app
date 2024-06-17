import { View, Text } from 'react-native'
import React, {useContext, useEffect} from 'react'
import { DataContext } from '../Data/DataContext'


const Rewards = () => {
  const {paymentMethod, bookingAddress} = useContext(DataContext);

  // useEffect(()=>{
  //   console.log(bookingAddress)
  // },[])
  return (
    <View>
      {/* <Text>{paymentMethod}</Text>
      <Text>{bookingAddress}</Text> */}
    </View>
  )
}

export default Rewards