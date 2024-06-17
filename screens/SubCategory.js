import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, BackHandler, ActivityIndicator, ScrollView } from 'react-native';
import { DataContext } from '../Data/DataContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Product from './Product';

const useCustomBackHandler = (navigation, parentCategory) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBack(navigation, parentCategory);
      return true; // Prevent default back button behavior
    });

    return () => backHandler.remove();
  }, [navigation, parentCategory]);
};

const handleBack = (navigation, parentCategory) => {
  try {
    if (parentCategory.parent !== null) {
      navigation.push('SubCategory', { categoryId: parentCategory.parent });
    } else {
      navigation.navigate('HomeScreen');
    }
  } catch (error) {
    console.error('Error fetching parent data:', error);
  }
};

const SubCategory = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const {
    fetchSubServices,
    subServices,
    fetchServiceById,
    parentCategory,
    IP_ADDRESS,
    cartItemNumber,
    getRootParentId,
    allSubCateBanner,
    fetchSubCategoryPrices,
    subcategoryPrices
  } = useContext(DataContext);

  const [loading, setLoading] = useState(true);
  const [isProductView, setIsProductView] = useState(false);
  const [filteredBanner, setFilteredBanner] = useState();
  const [filteredData, setFilteredData] = useState([]); // Initialize filteredData

  useCustomBackHandler(navigation, parentCategory);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSubServices(categoryId);
        await fetchServiceById(categoryId);
        await fetchSubCategoryPrices(categoryId);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);



  useEffect(() => {
    getRootParentId(categoryId)
      .then(rootParentId => {
        const filtered = allSubCateBanner.filter(item => item.categoryId._id === rootParentId);
        setFilteredData(filtered);
      })
      .catch(error => {
        console.error('Error:', error.message);
      });
  }, [categoryId, allSubCateBanner]);

  const navigateToSubCategory = (categoryId) => {
    navigation.push('SubCategory', { categoryId });
  };

  useEffect(() => {
    if (!loading && subServices.length === 0) {
      setIsProductView(true);
    } else {
      setIsProductView(false);
    }
  }, [loading, subServices]);

  const getMinPrice = (index) => {
    if (!Array.isArray(subcategoryPrices) || index >= subcategoryPrices.length) {
      return 'N/A';
    }

    const subCategoryPrice = subcategoryPrices[index];
    return subCategoryPrice ? subCategoryPrice.minPrice : 'N/A';
  };


  return (
    <View style={[styles.main, isProductView && styles.productMain]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleBack(navigation, parentCategory)}>
          <Ionicons name='arrow-back' color='#000' size={30} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{parentCategory.name}</Text>
        <TouchableOpacity style={styles.cartCircle} onPress={() => navigation.navigate('Cart')}>
          <Feather name="shopping-cart" color='#E1CD57' size={25} />
          <View style={styles.cartTextBox}>
            <Text style={styles.cartLabel}>{cartItemNumber}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9F3281" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={styles.productContent} showsVerticalScrollIndicator={false}>
          {subServices.length === 0 && (
            <Product parentCategoryId={parentCategory._id} />
          )}
        </ScrollView>
      )}

      <ScrollView style={{ marginBottom: 50 }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <View style={styles.allServices}>
          {subServices.length > 0 && filteredData.length > 0 && (
            (() => {
              const BannerImage = `${IP_ADDRESS}/subcateposter/${filteredData[0].bannerImage}`;
              return <Image source={{ uri: BannerImage }} style={styles.bannerImage} />;
            })()
          )}

          {subServices.map((data, index) => (
            <TouchableOpacity
              onPress={() => navigateToSubCategory(data._id)}
              style={styles.service}
              key={index}>
              <View style={styles.imageBox}>
                <Image source={{ uri: `${IP_ADDRESS}/categoryicon/${data.categoryImage}` }} style={styles.serviceCard} />
              </View>
              <View style={styles.categoryDetailBox}>
                <View style={styles.serviceNameBox}>
                  <Text style={styles.serviceName}>{data.name}</Text>
                  <AntDesign name='right' size={16} />
                </View>
                
                <View style={styles.startAt}>
                  {/* <Text>Start at: ₹</Text> */}
                </View>

                {/* <View style={styles.badgeContainer}>
                  <MaterialIcons name='thumb-up' size={12} color='#007500' />
                  <Text style={styles.badgeText}>BESTSELLER</Text>
                </View> */}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  productMain: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 18
  },
  productContent: {
    marginBottom: 0
  },
  header: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  allServices: {
    paddingHorizontal: 4,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  service: {
    marginBottom: 10,
    width: '100%',
    flexDirection: 'row',
    paddingBottom: 5,
    borderColor: '#e0e0e0',
    marginRight: 5,
  },
  serviceName: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryDetailBox: {
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  imageBox: {
    width: '25%',
    height: 'auto',
    marginLeft: '1%'
  },
  serviceCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 5,
  },
  serviceNameBox: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badgeBox: {
    width: 120,
    paddingVertical: 5,
    marginTop: 5,
    flexDirection: 'row',
  },
  loadingContainer: {
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCircle: {
    marginRight: 20
  },
  cartTextBox: {
    position: 'absolute',
    top: 0,
    right: -10,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'green',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartLabel: {
    color: '#fff'
  },
  bannerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'stretch',
    marginBottom: 20,
    borderRadius: 10
  },



  badgeContainer: {
    // position: 'absolute', // Position the badge text relative to the image
    // top: 10, // Adjust the top position as needed
    // right: 0, // Adjust the left position as needed
    // backgroundColor: '#007500',
    // paddingHorizontal: 5, // Add padding to the badge text
    flexDirection: 'row',
    // paddingHorizontal: 10,
    // justifyContent: 'center',
    alignItems: 'center',
    // borderWidth:1,
    width:'50%',
    marginTop:5
    // borderRadius: 5, // Add border radius to make it rounded
  },
  badgeText: {
    color: '#007500',
    fontSize: 12,
    marginLeft: 3
  },

  startAt:{
    marginTop:5
  }
});

export default SubCategory;
