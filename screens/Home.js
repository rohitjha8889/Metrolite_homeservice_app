import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, BackHandler, ActivityIndicator, PanResponder, Alert, Linking } from 'react-native';
import Header from '../components/Header';



import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import SubCategory from './SubCategory';
import Product from './Product';
import NewSlider from '../components/NewSlider';
import { DataContext } from '../Data/DataContext';
import Slider from '../components/Slider';
import EditProfile from './EditProfile';
import Schedule from './Schedule';
import AntDesign from 'react-native-vector-icons/AntDesign'
import useBackButtonHandler from '../hooks/useBackButtonHandler';

// import appDetail from '../app.json'


const HomeScreen = ({ navigation }) => {
  const exitApp = () => {
    BackHandler.exitApp();
  };

  useBackButtonHandler(exitApp);
  const { slider, service, IP_ADDRESS, fetchSubServices, subServices, fetchServiceById, fetchLatestVersion } = useContext(DataContext);
  // const slider = []
  // const service = []
  const [discountedSlider, setDiscountedSlider] = useState([]);
  const [mostBookedSlider, setMostBookedSlider] = useState([]);
  const [mainSlider, setMainSlider] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [parentName, setParentName] = useState('');

  const [updateBox, setUpdateBox] = useState(false)

  const navigateToSubCategory = (categoryId, categoryName) => {
    // console.log(categoryName)
    closeSubCategoryModal();
    navigation.push('SubCategory', { categoryId, categoryName });
  };
  // Service Filter
  const [discountedService, setDiscountedService] = useState([]);
  const [mostBookedService, setMostBookedService] = useState([]);
  const [upcomingService, setUpcomingService] = useState([]);
  const [loading, setLoading] = useState(false);


  const openPlayStore = () => {
    const url = 'https://play.google.com/store/apps/details?id=com.metrolite.metroliteexpo&hl=en_IE'; // Replace with your app's package name
    Linking.openURL(url).catch((err) => console.error('Error opening Play Store', err));
  };

  const openSubCategoryModal = () => {
    setModalVisible(true)
  }

  const closeSubCategoryModal = () => {
    setModalVisible(false)
    setParentName('')
  }


  const fetchSubcategoryData = async (id, name) => {
    openSubCategoryModal();
    setLoading(true); // Start loading
    await fetchSubServices(id);

    // console.log(id)
    setParentName(name)
    // console.log(name)

    setLoading(false); // Stop loading
    // Open modal after fetching data
  };




  useEffect(() => {


    const filteredDiscountSlider = slider.filter(item => item.position === 'Most Discounted');
    setDiscountedSlider(filteredDiscountSlider);

    const filteredBookedSlider = slider.filter(item => item.position === 'Most Booked');
    setMostBookedSlider(filteredBookedSlider)

    const filterMainSlider = slider.filter(item => item.position === 'Main');
    setMainSlider(filterMainSlider)

    const filterDiscountedService = service.filter(item => item.position === 'Most Discounted');
    setDiscountedService(filterDiscountedService)

    // console.log(discountedService)
    const filterMostBookedService = service.filter(item => item.position === 'Most Booked');
    setMostBookedService(filterMostBookedService)
    const filterUpcomingService = service.filter(item => item.position === 'Upcoming Service');
    setUpcomingService(filterUpcomingService)

    // console.log(fakedata)


    // console.log(discountedService)
    // console.log(slider)
  }, [slider, service])

  const showAlert = () => {
    Alert.alert(
      "Service will start soon",
      "Stay tuned!",
      [{ text: "OK" }],
      { cancelable: false }
    );
  };
  const showBooked = () => {
    Alert.alert(
      "Service is Not Available",
      "Stay tuned!",
      [{ text: "OK" }],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const latestVersion = await fetchLatestVersion();

      
      // console.log(latestVersion);
      const currentVersion = "1.0.6";
      // console.log(latestVersion, currentVersion)

      if (latestVersion !== currentVersion) {
        
          setUpdateBox(!updateBox);
        

      }
    };



    fetchData();


  }, []);

  return (
    <>
      <Header />
      <View style={{ flex: 1 }}>

       
        <ScrollView style={styles.container}
          showsVerticalScrollIndicator={false}

        >
          <View style={styles.content}>
            <NewSlider mainSlider={mainSlider} />
          </View>

          <View style={styles.serviceCollection}>

            <Text style={styles.title}>Most Discounted Services</Text>

            {discountedService.length % 3 === 0 ? (
              <View style={[styles.allServices, { justifyContent: 'space-between' }]}>
                {discountedService.map((data, index) => (
                  <TouchableOpacity
                    // onPress={() => navigation.navigate('SubCategory', { categoryId: data._id })}
                    onPress={() => fetchSubcategoryData(data._id, data.name)}
                    style={[styles.service]}
                    key={index}
                  >
                    <Image source={{ uri: `${IP_ADDRESS}/categoryicon/${data.categoryImage}` }} style={styles.serviceCard} />
                    <Text style={styles.serviceName}>{data.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.allServices}>
                {discountedService.map((data, index) => (
                  <TouchableOpacity
                    // onPress={() => navigation.navigate('SubCategory', { categoryId: data._id })}
                    onPress={() => fetchSubcategoryData(data._id, data.name)}
                    style={[styles.service, { width: '30%', marginRight: index % 3 !== 2 ? '5%' : 0 }]}
                    key={index}
                  >
                    <Image source={{ uri: `${IP_ADDRESS}/categoryicon/${data.categoryImage}` }} style={styles.serviceCard} />
                    <Text style={styles.serviceName}>{data.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}





            <View style={{ flex: 1 }}>
              <Slider discountedSlider={discountedSlider} />
            </View>
          </View>




          <View style={styles.serviceCollection}>

            <Text style={styles.title}>Most Booked Services</Text>

            {mostBookedService.length % 3 === 0 ? (
              <View style={[styles.allServices, { justifyContent: 'space-between' }]}>
                {mostBookedService.map((data, index) => (
                  <TouchableOpacity
                    // onPress={() => navigation.navigate('SubCategory', { categoryId: data._id })}
                    // onPress={() => fetchSubcategoryData(data._id, data.name)}
                    onPress={()=> showBooked()}
                    style={styles.service}
                    key={index}
                  >
                    <Image source={{ uri: `${IP_ADDRESS}/categoryicon/${data.categoryImage}` }} style={styles.serviceCard} />
                    <Text style={styles.serviceName}>{data.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={[styles.allServices]}>
                {mostBookedService.map((data, index) => (
                  <TouchableOpacity
                    
                    // onPress={() => fetchSubcategoryData(data._id, data.name)}
                    onPress={()=> showBooked()}
                    style={[styles.service, { width: '30%', marginRight: index % 3 !== 2 ? '5%' : 0 }]}
                    key={index}
                  >
                    <Image source={{ uri: `${IP_ADDRESS}/categoryicon/${data.categoryImage}` }} style={styles.serviceCard} />
                    <Text style={styles.serviceName}>{data.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}



            <View style={{ flex: 1 }}>
              <Slider discountedSlider={mostBookedSlider} />
            </View>
          </View>


          {/* Upcoming Services */}
          <View style={styles.serviceCollection}>
            <Text style={styles.title}>Upcoming Services</Text>
            {upcomingService.length % 3 === 0 ? (
              <View style={[styles.allServices, { justifyContent: 'space-between' }]}>
                {upcomingService.map((data, index) => (
                  <TouchableOpacity
                    onPress={() => showAlert()}
                    style={styles.service}
                    key={index}
                  >
                    <Image source={{ uri: `${IP_ADDRESS}/categoryicon/${data.categoryImage}` }} style={styles.serviceCard} />
                    <Text style={styles.serviceName}>{data.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.allServices}>
                {upcomingService.map((data, index) => (
                  <TouchableOpacity
                    onPress={() => showAlert()}
                    style={[styles.service, { width: '30%', marginRight: index % 3 !== 2 ? '5%' : 0 }]}
                    key={index}
                  >
                    <Image source={{ uri: `${IP_ADDRESS}/categoryicon/${data.categoryImage}` }} style={styles.serviceCard} />
                    <Text style={styles.serviceName}>{data.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}



            <View style={{ flex: 1 }}>

            </View>
          </View>



          {/* Refer & Earn */}
          <View style={styles.referContainer}>
            <Text style={[styles.title, { marginLeft: 20, marginBottom: 20 }]}>Refer & Earn</Text>
            <Image source={require('../assets/Images/refer.jpg')}
              style={[styles.refer, { resizeMode: 'contain' }]} />
          </View>




          {/* Modal Start */}

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => closeSubCategoryModal()}
          >
            <TouchableWithoutFeedback onPress={() => closeSubCategoryModal()}>
              <View style={styles.modalContainer}>
                <View style={styles.modalMain}>
                  <TouchableOpacity style={styles.modalCloseBtn}
                    onPress={() => setModalVisible(false)}
                  ><AntDesign name='close' size={20}></AntDesign></TouchableOpacity>
                  <ScrollView style={styles.modalContent}>

                    {loading ? (
                      <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                      <>

                        <Text style={styles.modalText}>{parentName}</Text>


                        {subServices.length === 2 ? (
                          <View style={[styles.subCategoryBox, { justifyContent: 'space-around' }]}>
                            {subServices.map((data, index) => (
                              <TouchableOpacity
                                onPress={() => navigateToSubCategory(data._id, data.name)}
                                style={{ width: '30%', marginBottom: 10, alignItems: 'center', backgroundColor: '#fff', borderRadius: 10 }}
                                key={index}>
                                <Text style={styles.serviceName}>{data.name}</Text>
                                <Image source={{ uri: `${IP_ADDRESS}/categoryicon/${data.categoryImage}` }} style={[styles.subServiceCard, { width: '100%' }]} />
                              </TouchableOpacity>
                            ))}
                          </View>
                          // <View style={[styles.subCategoryBox, { justifyContent: 'space-around' }]}>
                          //   {subServices.map((data, index) => (
                          //     <TouchableOpacity
                          //       onPress={() => navigateToSubCategory(data._id)}
                          //       style={[styles.service]}
                          //       key={index}>
                          //       <Image source={{ uri: `${IP_ADDRESS}/categoryicon/${data.categoryImage}` }} style={styles.subServiceCard} />
                          //       <Text style={styles.serviceName}>{data.name}</Text>
                          //     </TouchableOpacity>
                          //   ))}
                          // </View>
                        ) : subServices.length % 3 === 0 ? (
                          <View style={[styles.subCategoryBox, { justifyContent: 'space-between' }]}>
                            {subServices.map((data, index) => (
                              <TouchableOpacity
                                onPress={() => navigateToSubCategory(data._id, data.name)}
                                style={[styles.service]}
                                key={index}>
                                <Image source={{ uri: `${IP_ADDRESS}/categoryicon/${data.categoryImage}` }} style={styles.subServiceCard} />
                                <Text style={styles.serviceName}>{data.name}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        ) : (
                          <View style={[styles.subCategoryBox, { flexDirection: 'row', flexWrap: 'wrap' }]}>
                            {subServices.map((data, index) => (
                              <TouchableOpacity
                                onPress={() => navigateToSubCategory(data._id, data.name)}
                                style={[styles.service, { width: '30%', marginRight: index % 3 !== 2 ? '5%' : 0 }]}
                                key={index}>
                                <Image source={{ uri: `${IP_ADDRESS}/categoryicon/${data.categoryImage}` }} style={styles.subServiceCard} />
                                <Text style={styles.serviceName}>{data.name}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}

                      </>
                    )}

                  </ScrollView>
                </View>

              </View>
            </TouchableWithoutFeedback>
          </Modal >



          {/* Update Modal */}



          <Modal
        animationType="slide"
        transparent={true}
        visible={updateBox}
        // onRequestClose={() => {
        //   setUpdateBox(!updateBox);
        // }}
      >
       <View style={styles.updateModal}>
              <View style={styles.updateModalMain}>
                <View style={styles.updateModalContent}>
                  <Text style={styles.updateTitle}>Update Metrolite?</Text>
                  <Text style={styles.updateDescription}>
                    Metrolite recommends that you update to the latest version. You can keep using this app after installing the update.
                  </Text>

                  <View style={styles.updateButtonBox}>
                  <Image source={require('../assets/Images/googleplay.png')} style={styles.googlePlayImage} />
                    <TouchableOpacity
                      style={styles.updateButton}
                     onPress={openPlayStore}
                    >
                      <Text style={styles.updateButtonText}>UPDATE</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.bottomRow}>
                    
                  </View>
                </View>
              </View>
            </View>
      </Modal>


        </ScrollView >
      </View>
    </>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SubCategory" component={SubCategory} options={{ headerShown: false }} />

      <Stack.Screen name="Product" component={Product} options={{ headerShown: true }} />

    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  serviceCollection: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 30,
    marginTop: -10,
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10
  },

  title: {
    fontSize: 18,
    fontWeight: '600'

  },
  serviceCard: {
    width: 80,
    height: 80,
    // borderRadius:40
    // backgroundColor: '#9F3281',
    borderRadius: 10,


  },
  subServiceCard: {
    width: 80,
    height: 80,
    padding: 20,
    borderWidth: 2,
    // borderRadius:40
    // backgroundColor: '#9F3281',
    borderRadius: 10,


  },



  allServices: {
    marginTop: 10,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // justifyContent:'flex-start',
    // borderWidth:2,

    flexWrap: 'wrap'
  },
  service: {
    marginBottom: 10,
    width: '30%',
    // marginRight: 10.5,
    // borderWidth:1,

    // justifyContent:'center',
    alignItems: 'center'
  },
  serviceName: {
    fontSize: 13,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '500'
  },
  refer: {
    width: '100%',
    // borderColor:'green',
    height: 200,

    // borderWidth:2,

  },
  referContainer: {
    // borderColor:'red',
    // borderWidth:4,
    flex: 1,

    // alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },




  // Modal Styling

  title: {
    fontSize: 18,
    fontWeight: '600'
  },
  openModalButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  openModalButtonText: {
    fontSize: 16,
    color: '#007BFF',
    textDecorationLine: 'underline'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },

  modalMain: {
    // borderWidth:1,
    width: '100%'
  },

  modalContent: {
    marginTop: 50,
    backgroundColor: '#EEEEEE',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20
  },

  modalCloseBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 15
  },

  subCategoryBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent:'space-between'
  },




  // Update Modal

  updateModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  updateModalContent: {
    marginTop: 50,
    backgroundColor: 'black',
    width: '98%',

    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  updateDescription: {
    color: 'white',
    marginBottom: 16,
  },

  updateButtonBox: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection:'row',
    // borderWidth:1,
    borderColor: 'red'
  },

  updateButton: {
    backgroundColor: '#007500',
    paddingHorizontal: 15,
    paddingVertical: 10,
    // borderRadius: 8,
    alignItems: 'center',
    // width:'40%'
  },
  updateButtonText: {
    color: 'white',
  },
  updateNoThanks: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 8,
  },
  updateBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    alignItems: 'center',
  },

  googlePlayImage: {
    width: 150,
    height: 80
  }
});

export default StackNavigator;
