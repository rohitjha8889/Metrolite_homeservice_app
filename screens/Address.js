import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DataContext } from '../Data/DataContext';


const Address = ({ navigation }) => {
  const { userAddress, deleteAddress,  fetchAddressDetail } = useContext(DataContext)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // console.log(userAddress);
    setIsLoading(false);
  }, []);

  const handleDelete = (id) => {
    // Display confirmation dialog
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => {
            // Call deleteAddress function if user confirms
            deleteAddress(id);
          }
        }
      ]
    );

  };



  return (
    <>

      <ScrollView>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            {userAddress.length === 0 ? (
              <View style={styles.noAddressContainer}>
                <Text style={styles.noAddressText}>No addresses found. Please add an address.</Text>

              </View>
            ) : (
              <>
                {userAddress.map(address => (
                  <View style={styles.addressBox} key={address._id}>
                    <View>
                      <Text style={styles.phone}>{address.receiverName} ({address.receiverPhone})</Text>
                      <Text style={styles.address}>{address.addressLine1}, {address.addressLine2}</Text>
                      <Text style={styles.state}>{address.city}, {address.state}, ({address.pincode})</Text>
                    </View>
                    <View style={styles.iconBox}>
                      <TouchableOpacity onPress={() => handleDelete(address._id)}>

                        <MaterialCommunityIcons name='delete' size={30} color='#53B175' />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => navigation.navigate('Modify Delievery Address', { addressId: address._id })}>

                        <FontAwesome5 name='pen' size={20} color='#53B175' />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.addAddress}>
        <TouchableOpacity style={styles.addAddressBtn} onPress={() => navigation.navigate('Add Delievery Address')}>
          <MaterialIcons name='add' size={40} color='#fff' />
        </TouchableOpacity>
      </View>

    </>
  )
}



// Add Delivery Address


const AddDelieveryAddress = ({ navigation }) => {

  const { fetchUserId, addAddress } = useContext(DataContext)
  const [focusedInput, setFocusedInput] = useState(null);
  const [formData, setFormData] = useState({
    receiverName: '',
    receiverPhone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    pincode: '',
    state: ''
  });

  const [loading, setLoading] = useState(false);

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const handleInputChange = async (name, value) => {

    setFormData({ ...formData, [name]: value });


    // If the field being updated is 'pincode', make an API call
    if (name === 'pincode' && /^\d{6}$/.test(value)) {
      setLoading(true);
      try {

        const userId = await fetchUserId()
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        // console.log(value)
        const data = await response.json();

        // Check if the API response contains valid data
        if (data && data.length > 0 && data[0].Status === 'Success') {
          // Extract city and state from the API response
          const stateName = data[0].PostOffice[0].State;
          const cityName = data[0].PostOffice[0].Block;
          // Update the state and city based on the API response
          setFormData({ ...formData, city: cityName, state: stateName, userId: userId, pincode: value });
        } else {
          // Handle invalid API response or pin code
          console.error('Invalid API response or pin code');
        }
      } catch (error) {
        console.error('Error fetching city and state:', error);
      } finally {
        setLoading(false)
      }
    }
  };

  const handleSubmit = () => {

    if (!formData.city || !formData.pincode || !formData.state) {
      Alert.alert(
        'Incomplete Address',
        'Please complete the address information.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
      return; // Exit the function if any field is empty
    }

    addAddress(formData)
    setFormData({
      receiverName: '',
      receiverPhone: '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      pincode: '',
      state: ''
    });
    navigation.goBack();
    // Here you can perform any further actions with the form data
  };

  return (
    <>
      <ScrollView style={styles.addressForm}>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.input, focusedInput === 'receiverName' && styles.inputFocused]}
            onFocus={() => handleFocus('receiverName')}
            onBlur={handleBlur}
            placeholder='Full Name'
            onChangeText={(text) => handleInputChange('receiverName', text)}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.input, focusedInput === 'receiverPhone' && styles.inputFocused]}
            onFocus={() => handleFocus('receiverPhone')}
            onBlur={handleBlur}
            placeholder='Mobile No.'
            onChangeText={(text) => handleInputChange('receiverPhone', text)}
            keyboardType='numeric'
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.input, focusedInput === 'addressLine1' && styles.inputFocused]}
            onFocus={() => handleFocus('addressLine1')}
            onBlur={handleBlur}
            placeholder='Address Line 1'
            onChangeText={(text) => handleInputChange('addressLine1', text)}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.input, focusedInput === 'addressLine2' && styles.inputFocused]}
            onFocus={() => handleFocus('addressLine2')}
            onBlur={handleBlur}
            placeholder='Address Line 2'
            onChangeText={(text) => handleInputChange('addressLine2', text)}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.input, focusedInput === 'landmark' && styles.inputFocused]}
            onFocus={() => handleFocus('landmark')}
            onBlur={handleBlur}
            placeholder='Landmark'
            onChangeText={(text) => handleInputChange('landmark', text)}
          />
        </View>
        <View style={styles.cityBox}>
          <View style={[{ width: '45%' }, styles.inputBox]}>
            <TextInput
              style={[styles.input, focusedInput === 'city' && styles.inputFocused]}
              onFocus={() => handleFocus('city')}
              onBlur={handleBlur}
              placeholder='City'
              onChangeText={(text) => handleInputChange('city', text)}
              value={formData.city}
            />
          </View>
          <View style={[{ width: '45%' }, styles.inputBox]}>
            <TextInput
              style={[styles.input, focusedInput === 'pincode' && styles.inputFocused]}
              onFocus={() => handleFocus('pincode')}
              onBlur={handleBlur}
              placeholder='Pin Code'
              onChangeText={(text) => handleInputChange('pincode', text)}
              keyboardType='numeric'
            />
          </View>
        </View>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.input, focusedInput === 'state' && styles.inputFocused]}
            onFocus={() => handleFocus('state')}
            onBlur={handleBlur}
            placeholder='State'
            onChangeText={(text) => handleInputChange('state', text)}
            value={formData.state}
          />
        </View>
        <TouchableOpacity style={styles.saveAddressBtn} onPress={handleSubmit}>
          <Text style={styles.saveAddressBtnText}>ADD</Text>
        </TouchableOpacity>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator style={styles.loadingIndicator} size="large" color="#53B175" />
          </View>
        )}
      </ScrollView>
    </>
  );
};





// Modify Delivery Address


const ModifyDelieveryAddress = ({ navigation, route }) => {

  const { fetchUserId, fetchAddressDetail, addressDetail, modifyAddress } = useContext(DataContext)
  const { addressId } = route.params;

  useEffect(()=>{
    fetchAddressDetail(addressId);
    
  }, [])

  useEffect(() => {
    // Update form data when address details are fetched
    if (addressDetail) {
      setFormData({
        receiverName: addressDetail.receiverName,
        receiverPhone: addressDetail.receiverPhone,
        addressLine1: addressDetail.addressLine1,
        addressLine2: addressDetail.addressLine2,
        landmark: addressDetail.landmark,
        city: addressDetail.city,
        pincode: addressDetail.pincode,
        state: addressDetail.state
      });
    }
  }, [addressDetail]);

  const [focusedInput, setFocusedInput] = useState(null);
  const [formData, setFormData] = useState({
    receiverName: ``,
    receiverPhone: ``,
    addressLine1: ``,
    addressLine2: ``,
    landmark: ``,
    city: ``,
    pincode: ``,
    state: ``
  });

  const [loading, setLoading] = useState(false);

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const handleInputChange = async (name, value) => {

    setFormData({ ...formData, [name]: value });


    // If the field being updated is 'pincode', make an API call
    if (name === 'pincode' && /^\d{6}$/.test(value)) {
      setLoading(true);
      try {

        const userId = await fetchUserId()
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        // console.log(value)
        const data = await response.json();

        // Check if the API response contains valid data
        if (data && data.length > 0 && data[0].Status === 'Success') {
          // Extract city and state from the API response
          const stateName = data[0].PostOffice[0].State;
          const cityName = data[0].PostOffice[0].Block;
          // Update the state and city based on the API response
          setFormData({ ...formData, city: cityName, state: stateName, userId: userId, pincode: value });
        } else {
          // Handle invalid API response or pin code
          console.error('Invalid API response or pin code');
        }
      } catch (error) {
        console.error('Error fetching city and state:', error);
      } finally {
        setLoading(false)
      }
    }
  };

  const handleSubmit = () => {

    if (!formData.city || !formData.pincode || !formData.state) {
      Alert.alert(
        'Incomplete Address',
        'Please complete the address information.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
      return; // Exit the function if any field is empty
    }

    modifyAddress(addressId, formData)
    
    navigation.goBack();
    // Here you can perform any further actions with the form data
  };

  return (
    <>
      <ScrollView style={styles.addressForm}>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.input, focusedInput === 'receiverName' && styles.inputFocused]}
            onFocus={() => handleFocus('receiverName')}
            value={formData.receiverName}
            onBlur={handleBlur}
            placeholder='Full Name'
            onChangeText={(text) => handleInputChange('receiverName', text)}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.input, focusedInput === 'receiverPhone' && styles.inputFocused]}
            onFocus={() => handleFocus('receiverPhone')}
            onBlur={handleBlur}
            value={formData.receiverPhone}
            placeholder='Mobile No.'
            onChangeText={(text) => handleInputChange('receiverPhone', text)}
            keyboardType='numeric'
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.input, focusedInput === 'addressLine1' && styles.inputFocused]}
            onFocus={() => handleFocus('addressLine1')}
            onBlur={handleBlur}
            value= {formData.addressLine1}
            placeholder='Address Line 1'
            onChangeText={(text) => handleInputChange('addressLine1', text)}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.input, focusedInput === 'addressLine2' && styles.inputFocused]}
            onFocus={() => handleFocus('addressLine2')}
            onBlur={handleBlur}
            value={formData.addressLine2}
            placeholder='Address Line 2'
            onChangeText={(text) => handleInputChange('addressLine2', text)}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.input, focusedInput === 'landmark' && styles.inputFocused]}
            onFocus={() => handleFocus('landmark')}
            onBlur={handleBlur}
            value={formData.landmark}
            placeholder='Landmark'
            onChangeText={(text) => handleInputChange('landmark', text)}
          />
        </View>
        <View style={styles.cityBox}>
          <View style={[{ width: '45%' }, styles.inputBox]}>
            <TextInput
              style={[styles.input, focusedInput === 'city' && styles.inputFocused]}
              onFocus={() => handleFocus('city')}
              
              onBlur={handleBlur}
              placeholder='City'
              onChangeText={(text) => handleInputChange('city', text)}
              value={formData.city}
            />
          </View>
          <View style={[{ width: '45%' }, styles.inputBox]}>
            <TextInput
              style={[styles.input, focusedInput === 'pincode' && styles.inputFocused]}
              onFocus={() => handleFocus('pincode')}
              onBlur={handleBlur}
              placeholder='Pin Code'
              onChangeText={(text) => handleInputChange('pincode', text)}
              keyboardType='numeric'
              value={formData.pincode}
            />
          </View>
        </View>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.input, focusedInput === 'state' && styles.inputFocused]}
            onFocus={() => handleFocus('state')}
            onBlur={handleBlur}
            placeholder='State'
            onChangeText={(text) => handleInputChange('state', text)}
            value={formData.state}
          />
        </View>
        <TouchableOpacity style={styles.saveAddressBtn} onPress={handleSubmit}>
          <Text style={styles.saveAddressBtnText}>Save Changes</Text>
        </TouchableOpacity>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator style={styles.loadingIndicator} size="large" color="#53B175" />
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  addressBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10
  },

  iconBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '20%'
  },

  phone: {
    fontSize: 17,
    fontWeight: '700',
  },
  address: {
    color: "#A3A3A3"

  },

  state: {
    marginTop: 10,
    color: '#A3A3A3',
    fontSize: 15,
    fontWeight: '500'
  },
  addAddress: {
    marginRight: 20,
    marginBottom: 20,
    // justifyContent:'flex-end',
    alignItems: 'flex-end',
    // backgroundColor:'#53B175'
  },

  addAddressBtn: {
    backgroundColor: '#53B175',
    padding: 10,
    borderRadius: 30

  },



  // Add Delievery Address

  inputBox: {
    marginBottom: 20,
  },

  addressForm: {
    marginTop: 10,
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },

  input: {
    borderWidth: 2,
    borderColor: '#279AD1',
    padding: 10,
    fontSize: 18,
    height: 50,
    borderRadius: 8
  },

  inputLabel: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: '400',
    marginLeft: 10,
    color: '#67B086'

  },

  cityBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  saveAddressBtn: {
    backgroundColor: '#53B175',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,

  },

  saveAddressBtnText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700'
  },


  inputFocused: {
    borderColor: '#53B175'
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%', // Places the loading container in the middle of the screen vertically
    left: 0,
    right: 0,
    zIndex: 999, // Ensure the loading container stays on top of other elements
  },

})

export { Address, AddDelieveryAddress, ModifyDelieveryAddress };