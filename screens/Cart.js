import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header'
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Schedule from './Schedule';
import { AddDelieveryAddress, ModifyDelieveryAddress } from './Address';
import Summary from './Summary';
import { DataContext } from '../Data/DataContext';

const Stack = createStackNavigator();
const windowHeight = Dimensions.get('window').height;

const cartItem = [1, 2, 3, 4, 5]

const allAddress = ['1', '2', 3, '3', '4', '5']


const CartScreen = () => {
  const navigation = useNavigation();
  const [quantities, setQuantities] = React.useState([]);
  const [addressModelVisible, setAddressModelVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [updatedCartItems, setUpdatedCartItems] = useState([]);
  const [totalItemPrice, setTotalItemPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { userAddress, fetchAllCartItem, allCartItem, IP_ADDRESS, calculateDiscountedPrice, safetyFee, deleteCartItem, fetchTotalPrice, fetchCartItemNumber, cartItemNumber, addToOrderedCart, addBookingAddress, fetchUserAddress } = useContext(DataContext)


  const OrderCart = () => {
    const productDetails = updatedCartItems.map((item, index) => {
      const price = item.productDetails?.price * quantities[index];
      const discountPercentage = item.productDetails?.discount;
      const discountPrice = calculateDiscountedPrice(price, discountPercentage);

      return {
        productName: item.productDetails?.name,
        quantity: quantities[index],
        discountedPrice: discountPrice
      };
    });

    // console.log(productDetails);
    addToOrderedCart(productDetails)
  }


  useEffect(()=>{
    fetchUserAddress()
  },[])


  useEffect(() => {
    if (allCartItem.length > 0) {
      const initialQuantities = allCartItem.map(item => item.quantity);
      setQuantities(initialQuantities);
    }
  }, [allCartItem]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllCartItem();
      await fetchProductDetailsForCart();
      setIsLoading(false);
    };

    fetchData();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTotalPrice(totalPrice)
  }, [totalPrice])

  useEffect(() => {

    fetchProductDetailsForCart()
  }, [allCartItem])


  useEffect(() => {
    if (allCartItem.length > 0 && updatedCartItems.length > 0) {
      calculateTotalPrice();
    }
  }, [allCartItem, updatedCartItems]);


  useEffect(() => {
    calculateTotalPrice();
  }, [quantities, updatedCartItems]);



  useEffect(() => {
    setTotalPrice(totalItemPrice + safetyFee);
  }, [totalItemPrice, safetyFee]);

  const fetchProductDetailsForCart = async () => {
    try {
      const updatedItems = await Promise.all(
        allCartItem.map(async (item) => {
          try {
            const response = await fetch(`${IP_ADDRESS}/getproduct/${item.productId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch product details');
            }
            const productData = await response.json();
            return { ...item, productDetails: productData };
          } catch (error) {
            console.error('Error fetching product data:', error);
            return item; // Keep the original item if fetching fails
          }
        })
      );

      setUpdatedCartItems(updatedItems); // Update state with the updated cart items
      setIsLoading(false);

    } catch (error) {
      console.error('Error fetching product details for cart:', error);
    }
  };




  const increaseQuantity = (index) => {
    setQuantities(prevQuantities => {
      const updatedQuantities = [...prevQuantities];
      updatedQuantities[index] += 1;
      return updatedQuantities;
    });
  };

  const decreaseQuantity = (index) => {
    setQuantities(prevQuantities => {
      const updatedQuantities = [...prevQuantities];
      if (updatedQuantities[index] > 1) {
        updatedQuantities[index] -= 1;
      }
      return updatedQuantities;
    });
  };
  const selectAddress = (index) => {
    setSelectedAddress(index);
  };

  // Modal open - close 

  const openAddressModal = () => {
    // console.log(userAddress)
    setAddressModelVisible(true);

  }

  const closeAddressModal = () => {
    setAddressModelVisible(false)
  }


  const selectDelieveryAddress = (index, id) => {
    // console.log(index);
    // console.log(id)

    // console.log(id)
    closeAddressModal();
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {

      setAddressModelVisible(false);
    });

    return unsubscribe;
  }, [navigation]);

  // useEffect(()=>{
  //   let number = updatedCartItems.length
  //   // console.log(number)
  //   fetchCartItemNumber(number)
  // },[updatedCartItems])




  const calculateTotalPrice = () => {
    let total = 0;

    updatedCartItems.forEach((item, index) => {
      const price = item.productDetails?.price * quantities[index];
      const discountPercentage = item.productDetails?.discount;
      const discountPrice = calculateDiscountedPrice(price, discountPercentage);
      total += discountPrice;
    });

    setTotalItemPrice(total);

  };


  useEffect(() => {
    setTotalPrice(totalItemPrice + safetyFee);

  }, [totalItemPrice])


  // Handle Delete Cart Item
  const handleDeleteCartItem = async (id) => {
    try {
      const success = await deleteCartItem(id);
      setIsLoading(true); // Start loading
  
      if (success) {
        // Refresh cart items after deletion
        await fetchAllCartItem();
        await fetchCartItemNumber();
        setIsLoading(false); // Stop loading when the operation is complete
      }
    } catch (error) {
      setIsLoading(false); // Stop loading if there's an error
      console.error('Error deleting cart item:', error);
    }
  };

  useEffect(() => {
    fetchCartItemNumber()
  }, [updatedCartItems])






  return (
    <View style={styles.main}>
      <Header />
      {isLoading ? ( // Display loader if data is loading
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (

        updatedCartItems.length === 0 ? ( // Check if updatedCartItems is empty
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>No items in cart</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.allproductBox}>

              {updatedCartItems.map((item, index) => {
                const isLastItem = index === cartItem.length - 1;
                const price = item.productDetails?.price * quantities[index]
                const discountPercentage = item.productDetails?.discount

                const discountPrice = calculateDiscountedPrice(price, discountPercentage);

                // console.log(quantities[index])

                const itemPrice = discountPrice
                return (
                  <View style={[styles.product, isLastItem && styles.lastProduct]} key={item.productId}>
                    <Text style={styles.productName}>{item.productDetails?.name}</Text>


                    <View style={styles.quantityBox}>
                      <TouchableOpacity>
                        <Text style={styles.decreaseQuantity} onPress={() => decreaseQuantity(index)}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{quantities[index]}</Text>

                      <TouchableOpacity>
                        <Text style={styles.increaseQuantity} onPress={() => increaseQuantity(index)}>+</Text>
                      </TouchableOpacity>
                    </View>


                    <View style={styles.priceBox}>
                      <Text style={styles.mainPrice}>₹{price}</Text>
                      <Text style={styles.discountPrice}>₹ {itemPrice}</Text>
                      <Text style={styles.discountPercentage}>{item.productDetails?.discount}% off</Text>


                    </View>

                    <TouchableOpacity onPress={() => handleDeleteCartItem(item._id)}>
                      <FontAwesome6 name='delete-left' size={20} />
                    </TouchableOpacity>

                  </View>
                );
              })}
            </View>

            <View style={styles.frequentlyBox}>
              <Text style={styles.frequentlyTitle}>Frequently added together</Text>
            </View>
            <View style={styles.couponsBox}>
              <View style={styles.couponIcon}>
                <Text style={styles.couponText}>%</Text>
              </View>
              <Text style={styles.couponTitle}>Coupons and offers</Text>
              <AntDesign name='right' size={20} color='grey' />
            </View>


            {/* Payment Summary */}

            <View style={styles.paymentBox}>
              <Text style={styles.paymentTitle}>Payment summary </Text>
              <View style={styles.itemTotalBox}>
                <Text style={styles.itemTotalText}>Item Total</Text>
                <Text style={styles.itemTotalAmount}>₹{totalItemPrice}</Text>
              </View>
              <View style={[styles.itemTotalBox, styles.lastItemTotalBox]}>
                <Text style={styles.itemTotalText}>Convenience and safety fee</Text>
                <Text style={styles.itemTotalAmount}>₹ {safetyFee}</Text>
              </View>

              <View style={styles.totalAmountBox}>
                <Text style={styles.totalAmountText}>Total</Text>
                <Text style={styles.totalAmountText}>₹{totalPrice}</Text>
              </View>

            </View>

          </ScrollView>

        )

      )}

      {updatedCartItems.length === 0 ? ( // Check if updatedCartItems is empty
        <View>

        </View>
      ) : (

        <View style={styles.bottomContent}>
          {userAddress.length > 0 ? (
            <View style={styles.addressBox}>
              <MaterialCommunityIcons name='navigation-variant-outline' size={30} color='grey' style={{ borderWidth: 1, borderColor: '#e0e0e0', padding: 5 }} />
              <View style={styles.locationBox}>
                <Text style={styles.locationFixText}>Deliver to</Text>
                <Text style={styles.locationText}>{userAddress[selectedAddress]?.addressLine1} {userAddress[selectedAddress]?.city}</Text>
                <Text style={styles.locationText}>{userAddress[selectedAddress]?.pincode}</Text>
              </View>
              <TouchableOpacity onPress={openAddressModal}>
                <Text style={styles.changeLocationBtnText}>CHANGE</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.addressBox}>
              <Text style={styles.locationText}>Please add address</Text>
              <TouchableOpacity onPress={openAddressModal}>
                <Text style={styles.changeLocationBtnText}>ADD ADDRESS</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Slot Box */}
          <View style={styles.slotBox}>
            <TouchableOpacity style={styles.amountBox}>
              <Text style={styles.amountText}>₹ {totalPrice}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.slotBtn} onPress={() => {
              if (userAddress.length === 0) {
                // Alert message when userAddress is empty
                alert("Please add address");
              } else {
                addBookingAddress(userAddress[selectedAddress]._id);
                navigation.navigate('Schedule');
                OrderCart();
              }
            }}>
              <Text style={styles.slotBtnText}>Choose Timeslot</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Modal  */}
      <Modal
        transparent={true}
        visible={addressModelVisible}
        onRequestClose={closeAddressModal}
      >
        <TouchableWithoutFeedback
        // onPress={closeAddressModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalHeading}>Choose Delivery Address</Text>
              <ScrollView style={styles.allAddressBox} showsVerticalScrollIndicator={false}>
                {userAddress.map((address, index) => {
                  return (
                    <View style={styles.addressOptionBox} key={index}>
                      <TouchableOpacity
                        style={styles.addressAndNameBox}
                        onPress={() => selectAddress(index)}
                      >

                        <View>
                          <Text style={styles.addressText}>{address.receiverName} - {address.receiverPhone}</Text>
                          <Text style={styles.locationText}>{address.addressLine1}</Text>
                          <Text style={styles.locationText}>{address.city}, {address.state} - {address.pincode}</Text>
                        </View>

                        {selectedAddress === index && <Feather name='check-circle' color='#4CAF50' size={25} />}
                      </TouchableOpacity>
                      {selectedAddress === index && (
                        <>
                          <TouchableOpacity style={styles.addressConfirmBtn}>
                            <Text style={styles.addressConfirmBtnText} onPress={() => { selectDelieveryAddress(index, address._id) }}>Deliver to this Address</Text>
                          </TouchableOpacity>



                          <TouchableOpacity
                            style={styles.changeAddressBtn}
                            onPress={() => {
                              closeAddressModal()
                              navigation.navigate('Modify Delievery Address', { addressId: address._id });
                            }}
                          >
                            <Text style={styles.changeAddressBtnText}>Edit Address</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
              <TouchableOpacity style={styles.addAddress} onPress={() => navigation.navigate('Add Delievery')}>


                <AntDesign name='plus' size={25} color='grey' />
                <Text style={styles.addAddressText}>Add another Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


    </View>
  )
}


const Cart = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        // Remove the navigation.reset call to avoid the disappearing effect
    });

    return unsubscribe;
}, [navigation]);
  return (
    <Stack.Navigator initialRouteName="CartScreen">
      <Stack.Screen name="CartScreen" component={CartScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Schedule" component={Schedule} options={{ headerShown: false }} />
      <Stack.Screen name="Payment Summary" component={Summary} />
      <Stack.Screen name="Add Delievery" component={AddDelieveryAddress} />
      <Stack.Screen name='Modify Delievery Address' component={ModifyDelieveryAddress} />
    </Stack.Navigator>
  )
}


const styles = StyleSheet.create({
  main: {
    // borderWidth:2,
    flex: 1,
    backgroundColor: '#E8EBEE',

  },
  loadingContainer:{
flex:1,
justifyContent:'center',
alignItems:'center'
  },

  emptyCartContainer: {
    // borderWidth:1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  emptyCartText: {
    fontSize: 20
  },

  slotBox: {
    // paddingHorizontal:10,
    flexDirection: 'row'
  },
  amountBox: {
    width: '50%',
    backgroundColor: '#E8EBEE',
    padding: 15,
    // borderWidth:2,
    justifyContent: 'center',
    alignItems: 'center'
  },

  amountText: {
    fontSize: 16,
    fontWeight: '700',
  },

  slotBtn: {
    backgroundColor: '#007500',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  slotBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  addressBox: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e0e0e0'
  },

  locationBox: {
    // borderWidth:2,
    width: '60%'
  },

  locationFixText: {
    fontSize: 16
  },

  locationText: {
    color: 'grey'
  },

  changeLocationBtnText: {
    color: '#298EDE',
    fontWeight: '700'
  },
  allproductBox: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10
  },
  product: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.4,
    paddingBottom: 20,
    marginBottom: 10,
    borderColor: '#e0e0e0'

  },
  lastProduct: {
    borderBottomWidth: 0,
    paddingBottom: 0
  },

  productName: {
    fontSize: 16,
    fontWeight: '500',
    width: '40%'

  },

  quantityBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'grey',

    width: '20%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderRadius: 3
  },

  increaseQuantity: {
    fontSize: 18,
    fontWeight: '700'
  },
  decreaseQuantity: {
    fontSize: 20,
    fontWeight: '700'
  },

  priceBox: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  mainPrice: {
    color: 'grey',
    textDecorationLine: 'line-through'
  },
  discountPrice: {
    fontSize: 20
  },

  discountPercentage: {
    color: '#4CAF50',
    fontSize: 12
  },

  frequentlyBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 10,

  },

  frequentlyTitle: {
    fontSize: 18,
    fontWeight: '600',

  },

  couponsBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  couponIcon: {
    backgroundColor: '#4CAF50',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15
  },
  couponText: {
    color: '#fff',
    fontSize: 20
  },

  couponTitle: {
    width: '70%',
    fontSize: 18,
    fontWeight: '500',
    color: 'grey'
  },


  paymentBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 10,
  },

  paymentTitle: {
    fontSize: 18,
    fontWeight: '700',

  },

  itemTotalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },

  lastItemTotalBox: {
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10
  },

  totalAmountBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  totalAmountText: {
    fontSize: 16,
    fontWeight: '700'
  },
  modalHeading: {
    fontSize: 16,
    // textAlign: 'center',
    fontWeight: '600',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FEAB3F',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    color: '#fff'
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

  },

  allAddressBox: {
    paddingHorizontal: 20,
    height: windowHeight * 0.4,
    // borderWidth:1
  },

  addressAndNameBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  addressConfirmBtn: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    // width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },

  addressConfirmBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },

  changeAddressBtn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FEAB3F',
    // width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },

  changeAddressBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },

  addressOptionBox: {
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: '#e0e0e0',
    marginTop: 10,
    // marginBottom:20
  },

  addAddress: {
    flexDirection: 'row',
    // justifyContent:'space-between',
    alignItems: 'center',
    padding: 20,
    // borderBottomWidth: 1,
    // borderColor: '#e0e0e0'
  },

  addAddressText: {
    fontSize: 16,
    fontWeight: '400',
    // color: '#4CAF50'
    marginLeft: 30
  },

})

export default Cart