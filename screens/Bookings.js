import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../Data/DataContext';
import Header from '../components/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Bookings = () => {
  const { allBookedOrders, fetchAllOrder, safetyFee } = useContext(DataContext);
  const [loading, setLoading] = useState(true);

  // useEffect(()=>{
  //   console.log(allBookedOrders)
  // },[allBookedOrders])


  useEffect(() => {
    const fetchData = async () => {
      await fetchAllOrder();
      setLoading(false);
    };

    fetchData();
  }, []);

  const fetchTotalPrice = (itemPrice) => {
    let commissionCharge;
    let eighteenPercentCharge = 0;

    if (itemPrice <= 1000) {
      commissionCharge = 1000 * 0.10;
      eighteenPercentCharge = Math.round(commissionCharge * 0.18) + 50;
    } else if (itemPrice > 1000 && itemPrice <= 2000) {
      commissionCharge = 2000 * 0.15;
      eighteenPercentCharge = Math.round(commissionCharge * 0.18) + 50;
    } else if (itemPrice > 2000 && itemPrice <= 3000) {
      commissionCharge = 3000 * 0.20;
      eighteenPercentCharge = Math.round(commissionCharge * 0.18) + 50;
    } else if (itemPrice > 3000) {
      commissionCharge = itemPrice * 0.20;
      eighteenPercentCharge = Math.round(commissionCharge * 0.18) + 100;
    }

    return eighteenPercentCharge;
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3E90F8" />
      </View>
    );
  }



  return (
    <>
      <Header />
      <ScrollView style={styles.main} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <View style={styles.allorderBox}>
          {allBookedOrders.map((order, index) => {
            const gstAmount = fetchTotalPrice(order.totalCartPrice);
            let primeSlotFee = order.totalPriceWithSlot - order.totalCartPrice - gstAmount;
            const id = order._id.substring(order._id.length - 5);

            const statusOrder = order.status !== '' ? order.status : 'In Progress';
            return (
              <View style={styles.orderBox} key={index}>
                <View style={styles.dateBox}>
                  <Text style={styles.topDate}>{order.orderDate}</Text>
                </View>
                <View style={styles.statusBox}>
                  <Text style={styles.topDate}>{statusOrder}</Text>
                </View>

                <View style={styles.topBox}>
                  <View style={{ width: '10%' }}>
                    <MaterialCommunityIcons name='ticket-confirmation-outline' size={30} color='#3E90F8' />
                  </View>
                  <View style={styles.productList}>
                    {order.allOrderedCart.map((item, itemIndex) => {
                      return (
                        <View style={styles.productBox} key={itemIndex}>
                          <Text style={styles.productName}>{item.productName}</Text>
                          <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
                <Text style={{ textAlign: 'right', fontWeight: '700', color: '#3E90F8' }}># {id}</Text>
                <View style={styles.bottomBox}>
                  <Text>Service Date: {order.serviceDate}</Text>
                  <Text>Service Time: {order.orderTimeSlot}</Text>
                  <Text>Booked on: {order.orderDate} {order.orderTime}</Text>
                  <Text>Payment Method: {order.paymentMethod}</Text>
                  <Text>Total Cart Price: ₹{order.totalCartPrice}</Text>
                  <Text>Taxes and Fee: ₹{gstAmount}</Text>
                  <Text>Prime Time Slot Fee : ₹{primeSlotFee}</Text>
                  <Text>Total Payable Amount: ₹{order.totalPriceWithSlot}</Text>
                </View>
                <View style={styles.buttonBox}>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Need Help</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, { borderRightWidth: 0 }]}>
                    <Text style={styles.buttonText}>Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    padding: 15,
  },
  orderBox: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 30,
  },
  topBox: {
    marginTop: 20,
    flexDirection: 'row',
    paddingBottom: 20,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  productList: {
    marginLeft: 10,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    width: '85%',
  },
  productBox: {
    marginBottom: 5,
    width: '100%',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
  },
  productQuantity: {
    color: 'grey',
  },
  bottomBox: {
    marginTop: 10,
  },
  buttonBox: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  button: {
    padding: 10,
    borderRightWidth: 1,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#e0e0e0',
  },
  buttonText: {
    color: '#3E90F8',
    fontWeight: '600',
  },


  dateBox: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#3E90F8',
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginTop: -15,
    borderRadius: 10,
  },
  statusBox: {
    position: 'absolute',
    left: 20,
    backgroundColor: '#3E90F8',
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginTop: -15,
    borderRadius: 10,
  },
  topDate: {
    color: '#fff',
  },
});

export default Bookings;
