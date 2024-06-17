import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Modal, Dimensions, ScrollView, Alert } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons'

import { DataContext } from '../Data/DataContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';


// Images Path


const windowHeight = Dimensions.get('window').height;

const Summary = () => {
  const { totalPriceWithSlot, safetyFee, allOrderedCart, orderTimeSlot, totalCartPrice, addPaymentMethod, orderBook, fetchCartItemNumber, cartItemNumber, gstAndOther, userDetail } = useContext(DataContext);


  const [modalVisible, setModalVisible] = useState(false);



  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [primSlotFeeShow, setPrimeSlotFeeShow] = useState(0);
  const [confirmOrderModal, setConfirmModalVisible] = useState(false);

  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  const [taxModalVisible, setTaxModalVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    console.log(userDetail)
  }, [userDetail])

  useFocusEffect(
    useCallback(() => {
      if (cartItemNumber === 0) {
        navigation.navigate('CartScreen');
      }
    }, [cartItemNumber])
  );

  const toggleConfirmModal = () => {
    setModalVisible(!confirmOrderModal);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    if (totalPriceWithSlot === totalCartPrice) {
      setPrimeSlotFeeShow(0);
    } else {
      setPrimeSlotFeeShow(150);
    }
  }, [totalPriceWithSlot, totalCartPrice]);

  const closeModal = () => {
    setModalVisible(false);
  };




  const handlePaymentOptionSelect = (option) => {
    setSelectedPaymentOption(option)
    addPaymentMethod(option)
  }

  const initiateRazorpayPayment = (paymentMethod) => {
    console.log('Initiating Razorpay payment...');
    const amountInPaisa = totalPriceWithSlot * 100;
    console.log('Amount in paisa:', amountInPaisa);

    const options = {
      description: 'Payment for order',
      image: 'https://www.metrolitesolutions.com/img/m-l-logo.png',
      currency: 'INR',
      key: 'rzp_live_TXZeGJnLKrAwyC', // Replace with your Razorpay key
      amount: amountInPaisa, // Convert to paisa
      name: 'METROLITE SOLUTIONS PRIVATE LIMITED',
      prefill: {
        email: `${userDetail.emailId}`,
        contact: `${userDetail.phone}`,
        name: `${userDetail.userName}`
      },
      theme: { color: '#53a20e' }
    };

    if (paymentMethod === 'UPI') {
      options.method = 'upi';
    } else if (paymentMethod === 'Card') {
      options.method = 'card';
    }

    RazorpayCheckout.open(options).then((data) => {
      // handle success
      console.log('Payment successful:', data);
      Alert.alert('Payment Successfully');

      orderBook();
      navigation.navigate('Bookings');
    }).catch((error) => {
      // handle failure
      console.log('Payment failed:', error);
      Alert.alert('Payment Failed');
    });
  };

  const handleOrderBooking = () => {


    if (selectedPaymentOption === 'Cash (Pay After Service)') {

      orderBook();
      navigation.navigate('Bookings');
    } else if (selectedPaymentOption === 'UPI') {
      initiateRazorpayPayment('UPI');
    } else if (selectedPaymentOption === 'Card') {
      initiateRazorpayPayment('Card');
    }
  };

  const itemArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const itemTotal = totalPriceWithSlot - safetyFee;
  const itemTotalWithoutSlot = itemTotal - primSlotFeeShow;
  const slotFee = totalPriceWithSlot - totalCartPrice - gstAndOther

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.paymentBox}>
          <Text style={styles.paymentTitle}>Payment summary</Text>
          <View style={styles.itemTotalBox}>
            <Text style={styles.itemTotalText}>Service Charge</Text>
            <Text style={styles.itemTotalAmount}>₹ {totalCartPrice}</Text>
          </View>
          <View style={styles.itemTotalBox}>
            <Text style={styles.itemTotalText}>Prime Time Slot Charge</Text>
            <Text style={styles.itemTotalAmount}>₹ {slotFee}</Text>
          </View>
          <View style={[styles.itemTotalBox, styles.lastItemTotalBox]}>
            <Text style={[styles.itemTotalText, { borderBottomWidth: 0.5, borderBottomColor: '#000', borderStyle: 'dashed' }]} onPress={() => setTaxModalVisible(true)}>

              Taxes and Fee</Text>
            <Text style={styles.itemTotalAmount}>₹ {gstAndOther}</Text>
          </View>
          <View style={styles.totalAmountBox}>
            <Text style={styles.totalAmountText}>Total</Text>
            <Text style={styles.totalAmountText}>₹{totalPriceWithSlot}</Text>
          </View>
        </View>

        <View style={styles.viewDetailBtnBox}>
          <TouchableOpacity onPress={openModal}>
            <Text style={styles.viewDetailBtnText}>View Detail</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <TouchableOpacity style={styles.placeOrderBtn} onPress={() => setPaymentModalVisible(true)}>
        <Text style={styles.placeOrderBtnText}>PROCEED TO PAY</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>


          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.tableContainer}>
                  <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader1}>Service Details</Text>
                    <Text style={styles.rowHeader}>Quantity</Text>
                    <Text style={styles.rowHeader}>Price (₹)</Text>
                  </View>
                  {allOrderedCart.map((item, index) => (
                    <View style={styles.rowContainer} key={index}>
                      <Text style={styles.rowText1}>{item.productName}</Text>
                      <Text style={styles.rowText}>{item.quantity}</Text>
                      <Text style={styles.rowText}>{item.discountedPrice}</Text>
                    </View>
                  ))}
                  <View style={styles.rowContainer}>
                    <Text style={styles.rowTotal}>Total Amount</Text>
                    <Text style={[styles.rowText, styles.rowTotal]}>₹ {totalCartPrice}</Text>
                  </View>
                  <View style={styles.rowContainer}>
                    <Text style={styles.rowText1}>Taxes and Fee</Text>
                    <Text style={styles.rowText}>₹ {gstAndOther}</Text>
                  </View>
                  <View style={styles.rowContainer}>
                    <Text style={styles.rowText1}>Prime Time Slot Charge</Text>
                    <Text style={styles.rowText}>₹ {slotFee}</Text>
                  </View>
                  <View style={styles.rowContainer}>
                    <Text style={styles.rowTotal}>Total Payable Amount</Text>
                    <Text style={[styles.rowText, styles.rowTotal]}>₹ {totalPriceWithSlot}</Text>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.buttonBox}>
                <TouchableOpacity onPress={closeModal} style={styles.paymentBtn}>
                  <Text style={styles.paymentBtnText}>Okay, Got it</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      <Modal
        transparent={true}
        visible={paymentModalVisible}
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={() => setPaymentModalVisible(false)}>
          <View style={styles.paymentModalContainer}>
            <View style={styles.paymentModalContent}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.paymentHeading}>Amount Payable: ₹{totalPriceWithSlot}</Text>
                <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
                  <AntDesign name='close' size={20} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => handlePaymentOptionSelect('UPI')}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../assets/Images/upi.png')} style={styles.paymentImage} />
                  <View style={styles.paymentDetail}>
                    <Text style={styles.paymentOptionText}>Pay Using UPI</Text>
                    <Text style={styles.cashbackText}>Fast and secure transactions at your fingertips.</Text>
                  </View>
                </View>


                {selectedPaymentOption === 'UPI' ? (
                  <Feather name='check-circle' color='#4CAF50' size={20} />
                ) : (
                  <Entypo name='circle' size={20} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => handlePaymentOptionSelect('Card')}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../assets/Images/card.png')} style={styles.paymentImage} />
                  <View style={styles.paymentDetail}>
                    <Text style={styles.paymentOptionText}>Debit Card</Text>
                    <Text style={styles.cashbackText}>Enjoy quick and easy payments with your card.</Text>
                  </View>
                </View>

                {selectedPaymentOption === 'Card' ? (
                  <Feather name='check-circle' color='#4CAF50' size={20} />
                ) : (
                  <Entypo name='circle' size={20} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => handlePaymentOptionSelect('Cash (Pay After Service)')}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../assets/Images/cash.png')} style={styles.paymentImage} />
                  <View style={styles.paymentDetail}>
                    <Text style={styles.paymentOptionText}>Cash (Pay After Service)</Text>
                    <Text style={styles.cashbackText}>Convenient payment after you receive the service.</Text>
                  </View>
                </View>
                {selectedPaymentOption === 'Cash (Pay After Service)' ? (
                  <Feather name='check-circle' color='#4CAF50' size={20} />
                ) : (
                  <Entypo name='circle' size={20} />
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.payButton} onPress={() => handleOrderBooking()}>
                <Text style={styles.payButtonText}>PAY ₹{totalPriceWithSlot}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>




      {/* Tax Description Modal */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={taxModalVisible}
        onRequestClose={() => {
          setTaxModalVisible(!taxModalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={() => { setTaxModalVisible(flase) }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setTaxModalVisible(!taxModalVisible)}
              >
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              <View style={styles.modalContent}>
                <Image source={require('../assets/Images/tax1.png')} style={styles.taxModalImage} />
                <Text style={styles.title}>What is Taxes and Fee?</Text>
                <Text style={styles.description}>
                  Taxes levied as per Govt. regulations, subject to change basis final service value.
                  The fee goes towards training of partners and providing support & assistance during the service.
                </Text>
                <TouchableOpacity
                  style={styles.okButton}
                  onPress={() => setTaxModalVisible(!taxModalVisible)}
                >
                  <Text style={styles.okButtonText}>Okay, got it</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};



const styles = StyleSheet.create({
  paymentBox: {
    backgroundColor: '#fff',
    marginBottom: 10,
    margin: 10,
    borderRadius: 10,
    // Add the following styles
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 6 }, // Shadow offset
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow radius
    elevation: 5, // Elevation for Android
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemTotalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10
  },
  lastItemTotalBox: {
    // marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10
  },
  totalAmountBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    // paddingBottom:20,
    height: 50,
    backgroundColor: '#D6E8D8',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  totalAmountText: {
    fontSize: 16,
    fontWeight: '700'
  },
  paymentDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   
  },
  viewDetailBtnText: {
    color: '#298EDE',
    fontWeight: '700'
  },

  viewDetailBtnBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    // justifyContent:'flex-end',
    alignItems: 'flex-end'
  },


  // Payment Option Box

  paymentOptionBox: {
    padding: 20,
  },

  payNowBox: {
    flexDirection: 'row',
    marginTop: 20,
    // alignItems: 'center',
    // justifyContent: 'space-between',
  },

  payDetailBox: {
    marginLeft: 30
  },

  payTitleText: {
    marginLeft: 20,
    fontSize: 16,
    fontWeight: '400'
  },

  payDetailText: {
    color: 'grey',
    marginTop: 5
  },



  paymnetHeading: {
    fontSize: 18,
    fontWeight: '400'
  },

  payTitle: {
    flexDirection: 'row'

  },

  placeOrderBtn: {
    padding: 10,
    margin: 10,
    backgroundColor: '#007500',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10
  },

  placeOrderBtnText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600'
  },




  // Modal Styling

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '95%',
    maxHeight: windowHeight * 0.7, // Set maximum height for the modal
  },
  scrollView: {
    maxHeight: windowHeight * 0.5, // Adjust as needed
  },
  tableContainer: {
    flexDirection: 'column',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowText: {
    fontSize: 16,
    // borderWidth:1,
    textAlign: 'center',
    width: '25%',

  },
  rowText1: {
    width: '50%'
  },

  rowHeader: {
    fontSize: 17,
    fontWeight: '700',
    width: '25%',
    textAlign: 'center'
  },

  rowHeader1: {
    fontSize: 17,
    fontWeight: '700',
    width: '50%'
  },

  // ROw Total

  rowTotal: {
    fontWeight: '700',

  },


  buttonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,

  },

  paymentBtn: {
    backgroundColor: '#007500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10
  },
  paymentBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },






  closeModalButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },

  // order Confirm Modal


  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    overflow: 'hidden',
    position: 'relative',
    textAlign: 'left',
    borderRadius: 10,
    maxWidth: 290,
    backgroundColor: '#fff',
    elevation: 5,
  },
  dismiss: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
  },
  header: {
    padding: 20,
  },
  image: {
    backgroundColor: '#e2feee',
    width: 60,
    height: 60,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgIcon: {
    color: '#0afa2a',
    width: 40,
    height: 40,
  },
  content: {
    marginTop: 15,
    textAlign: 'center',
  },
  title: {
    color: '#066e29',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 10,
    color: '#595b5f',
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  history: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#1aa06d',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 10,
  },



  paymentModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  paymentModalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  paymentHeading: {
    fontSize: 15,
    fontWeight: '500',
    // fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  paymentDetail: {
    marginLeft: 10,
    width:'75%'
  },
  paymentOptionText: {
    fontSize: 16,
  },
  cashbackText: {
    fontSize: 12,
    color: '#888',
    // width:'70%'
  },
  payButton: {
    backgroundColor: '#007500',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },


  paymentImage: {
    width: 50,
    height: 50,
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 5
  },




  // Tax Modal

  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: -40,
    right: 20,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 17.5
  },
  modalContent: {
    // alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: 'grey',
    lineHeight: 20
    // textAlign: 'center',
    // marginVertical: 10,
  },
  okButton: {
    marginTop: 15,
    backgroundColor: '#6200EE',
    borderRadius: 5,
    padding: 10,

    alignItems: 'center',
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  taxModalImage: {
    // borderWidth:1,
    // borderColor:'red',
    width: 50,
    height: 50,
    resizeMode: 'cover',
    margin: 0,
    padding: 0
  }

});

export default Summary;
