import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { DataContext } from '../Data/DataContext';
import { useNavigation } from '@react-navigation/native';


// Icon Imported
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'




import ProductSlider from '../components/ProductSlider';
import ProductCustom from '../components/ProductCustom';
const windowHeight = Dimensions.get('window').height;

const Product = ({ parentCategoryId }) => {
    const navigation = useNavigation();
    const { allProducts, IP_ADDRESS, addToCart, totalCartPrice, cartItemNumber, fetchCartItemNumber, allCartItem } = useContext(DataContext);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [productAddModal, setProductAddModal] = useState(false)
    const [cartModal, setCartModal] = useState(false)

    useEffect(() => {
        const filteredItems = allProducts.filter(item => {
            return parentCategoryId === item.selectedSubCategory;
        });
        setFilteredItems(filteredItems);

        // console.log(filteredItems)
    }, [allProducts, parentCategoryId]);

    const calculatePriceAfterDiscount = (price, discountPercentage) => {
        const discountAmount = price * (discountPercentage / 100);
        const priceAfterDiscount = price - discountAmount;
        return priceAfterDiscount;
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const addToCartBtn = (product) => {
        // setSelectedProduct(product);
        // console.log(product)
        setProductAddModal(true);
        addToCart(product._id, 1)
        cartModalOpen(product);

        setTimeout(() => {
            setProductAddModal(false);
        }, 900);

        fetchCartItemNumber();


    }

    const closeAddToCartModel = () => {
        setProductAddModal(false)
    }


    const cartModalOpen = (product) => {
        setCartModal(true)
        setSelectedProduct(product);
        // console.log(selectedProduct)
    }

    const cartModalClose = () => {
        setCartModal(false)
    }

    const getBadgeIcon = (badge) => {
        if (!badge) return null; 
        const upperCaseBadge = badge.toUpperCase(); // Convert badge to uppercase

        switch (upperCaseBadge) {
            case 'BESTSELLER':
            case 'BEST SELLER':
            case 'Best Seller':
                return <AntDesign name='like1' size={12} color='#007500' />;
            case 'HOTDEAL':
            case 'HOT DEAL':
            case 'Hot Deal':
                return <MaterialIcons name='local-fire-department' size={12} color='#007500' />;
            case 'NEW':
            case 'New':
            case 'NEW LAUNCH':
            case 'New Launch':
                return <FontAwesome5 name='box-open' size={12} color='#007500' />;
            case 'TRENDING':
            case 'Trending':
            case 'VIRAL':
            case 'Viral':
            case 'In Demand':
            case 'INDEMAND':
            case 'IN DEMAND':
                return <MaterialIcons name='trending-up' size={12} color='#007500' />;
            case 'MUST TRY':
            case 'Must Try':
            case 'MUSTTRY':
                return <FontAwesome5 name='hand-sparkles' size={12} color='#007500' />;
            default:
                return <MaterialIcons name='thumb-up' size={12} color='#007500' />;
        }
    };

    return (
        <View style={styles.main}>
            {/* <Text>{totalCartPrice}</Text> */}
            {filteredItems.map((product, index) => {
                const discountedPrice = Math.floor(calculatePriceAfterDiscount(product.price, product.discount));

                let ratingValue = '';
                let ratingCount = '';

                if (product.rating) {
                    const ratingString = product.rating;
                    const ratingParts = ratingString.split(' ');
                    ratingValue = ratingParts[0];
                    const countMatch = ratingString.match(/\(\d+\)/);
                    if (countMatch) {
                        ratingCount = countMatch[0];
                    }
                    // console.log(ratingCount); // This should log the correct rating count in the format "(121)"
                }
                return (
                    <View key={index} style={styles.productContainer}>
                        <View style={{ borderBottomWidth: 1, borderStyle: 'dashed', borderBottomColor: '#e0e0e0', paddingBottom: 5, marginBottom: 5 }}>
                            <View style={styles.imageBox}>


                                <ProductCustom productImage={product.images} />
                            </View>
                            <View style={styles.priceBox}>
                                <View style={styles.name}>
                                    <Text style={styles.productName}>{product.name}</Text>
                                </View>
                                <View style={styles.price}>
                                    <Text style={styles.productPrice}>₹{product.price}</Text>
                                    <Text style={styles.discountPrice}>₹{discountedPrice}</Text>
                                    <Text style={styles.productDiscount}>{product.discount}%</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>

                                <View style={styles.ratingBox}>
                                    <AntDesign name='star' color='#fd9a01' size={14} />
                                    <Text style={styles.ratingText}>{ratingValue}</Text>
                                    <Text style={styles.ratingTextNumber}>{ratingCount}</Text>
                                </View>
                                <View style={styles.timeBox}>
                                    <Ionicons name='stopwatch' size={20} color='#00456e' />
                                    <Text style={styles.productDuration}> {product.duration} min</Text>
                                </View>
                            </View>

                            <View style={styles.badgeContainer}>
                                {getBadgeIcon(product.badge)}
                                <Text style={styles.badgeText}>
                                    {product.badge ? product.badge.toUpperCase() : ''}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.descriptionBox}>
                            <Text style={styles.descriptionText}>{product.description}</Text>
                        </View>

                        <View style={styles.buttonBox}>
                            {allCartItem.map(cartItem => cartItem.productId).includes(product._id) ? (
                                <>
                                    <TouchableOpacity style={styles.viewDetailBtn} onPress={() => openModal(product)}>
                                        <Text style={styles.viewDetailText}>View Details</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.inCartBtn} activeOpacity={1} onPress={() => navigation.navigate('Cart')}>
                                        <Feather name="shopping-cart" color='#fff' size={18} />
                                        <Text style={styles.inCartBtnText}>In Cart</Text>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity style={styles.continueBtn} onPress={() => navigation.navigate('Cart')}>
                                        <Feather name="shopping-cart" color='#fff' size={18} />
                                        <Text style={styles.continueBtnText}>Continue</Text>
                                    </TouchableOpacity> */}
                                </>
                            ) : (
                                <>
                                    <TouchableOpacity style={styles.viewDetailBtn} onPress={() => openModal(product)}>
                                        <Text style={styles.viewDetailText}>View Details</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.cartBtn} onPress={() => addToCartBtn(product)}>
                                        <Feather name="shopping-cart" color='#00456e' size={18} />
                                        <Text style={styles.cartBtnText}>ADD</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>



                    </View>
                )
            })}
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalHeading}>{selectedProduct && selectedProduct.name}</Text>
                            <Text>{selectedProduct && selectedProduct.description}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


            <Modal
                transparent={true}
                visible={productAddModal}
                onRequestClose={closeAddToCartModel}
            >
                <TouchableWithoutFeedback >
                    <View style={styles.modalAddToCartBackground}>
                        <View style={styles.modalAddToCartContainer}>
                            <AntDesign name='check' size={40} color='#fff' />
                            <Text style={styles.cartAddedText}>Added to Cart</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>






            <Modal
                transparent={true}
                visible={cartModal}
                onRequestClose={cartModalClose}

            >
                <TouchableWithoutFeedback onPress={() => setCartModal(false)}>



                    <View style={styles.cartModalBackground}>
                        <View style={styles.cartModalContainer}>
                            <View>
                                {/* <View style={styles.dataBox}>
                                <Text style={styles.headingText}>Total Amount:</Text>
                                <Text style={styles.valueText}> ₹{totalCartPrice}</Text>
                            </View> */}
                                <View style={styles.dataBox}>
                                    <Text style={styles.headingText}>Total Items: </Text>
                                    <Text style={styles.valueText}>{cartItemNumber}</Text>
                                </View>
                                <View style={styles.dataBox}>
                                    <Text style={styles.headingText}>Total Duration: </Text>
                                    <Text style={styles.valueText}>{selectedProduct && selectedProduct.duration} min</Text>
                                </View>

                            </View>

                            <TouchableOpacity style={styles.checkOutBtn} onPress={() => navigation.navigate('Cart')}>
                                <AntDesign name='right' color='#fff' size={20} />
                                <Text style={styles.checkOutBtnText}>Checkout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>



        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        backgroundColor: '#EEEEEE',
        marginBottom: 70,
        // borderWidth: 1,
        flex: 1
    },
    productContainer: {
        marginTop: 10,
        backgroundColor: '#fff',
        // paddingLeft: 5,
        // paddingRight: 5,
        paddingBottom: 15,
        borderRadius: 10,
        shadowColor: "#000", // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.15, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5,
        marginHorizontal: 10
    },
    imageBox: {
        width: "100%",
        // height: 200,
        // borderWidth:2,
        marginTop: 0,
        marginBottom: 5,
        position: 'relative',
    },
    priceBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 5,
        paddingRight: 5
    },
    name: {
        width: '65%'
    },
    price: {
        width: '32%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    productName: {
        fontSize: 16,
        fontWeight: '500'
    },
    productPrice: {
        color: 'grey',
        textDecorationLine: 'line-through',
        fontSize: 12
    },
    discountPrice: {
        fontSize: 16,
        fontWeight: '700'
    },
    productDiscount: {
        color: 'green',
        fontSize: 10,
        fontWeight: '500'
    },
    timeBox: {
        flexDirection: 'row',
        paddingLeft: 5,
        paddingRight: 5,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '50%'
    },
    ratingBox: {
        flexDirection: 'row',
        width: '48%',
        alignItems: 'center'
        // marginLeft:10
    },

    productDuration: {
        marginLeft: 2.5,
        fontSize: 12
    },
    descriptionBox: {
        paddingLeft: 5,
        paddingRight: 5,
        maxHeight: 40
    },
    descriptionText: {
        lineHeight: 20,
        color: 'grey'
    },
    buttonBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingLeft: 5,
        paddingRight: 5
    },
    viewDetailBtn: {
        // backgroundColor: '#00456e',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5
    },
    viewDetailText: {
        color: '#00456e',
        fontSize: 14
    },
    cartBtn: {
        // backgroundColor: '#00456e',

        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#00456e',
        flexDirection: 'row',
        marginRight: 10
    },
    cartBtnText: {
        color: '#00456e',
        fontSize: 14,
        marginLeft: 10,
        fontWeight: '500'
    },

    inCartBtn: {
        backgroundColor: 'grey',

        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        flexDirection: 'row',
        marginRight: 10
    },
    inCartBtnText: {
        color: '#fff',
        marginLeft: 5
    },

    continueBtn: {
        backgroundColor: '#007500',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5,
        flexDirection: 'row'
    },
    continueBtnText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 10
    },

    modalHeading: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 30
    },

    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: windowHeight * 0.5
    },

    modalAddToCartBackground: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    modalAddToCartContainer: {
        backgroundColor: '#000',
        padding: 20,
        borderRadius: 20,
        // borderTopRightRadius: 20,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        width: 200
    },
    cartAddedText: {
        color: '#fff'
    },

    cartModalBackground: {
        flex: 1,
        justifyContent: 'flex-end',

    },
    cartModalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: windowHeight * 0.13,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // borderTopWidth:1,
        // borderTopColor:'grey'
    },

    dataBox: {
        flexDirection: 'row'
    },

    checkOutBtn: {
        backgroundColor: '#007500',
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 5
    },

    checkOutBtnText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 10,

    },
    headingText: {
        color: '#909090',
        fontSize: 14,
        fontWeight: '600'
    },

    valueText: {
        fontWeight: '700'
    },
    ratingText: {
        color: '#000',
        marginLeft: 5
    },

    ratingTextNumber: {
        color: '#545454',
        marginLeft: 5
    },

    badgeContainer: {
        // position: 'absolute', // Position the badge text relative to the image
        // top: 10, // Adjust the top position as needed
        // right: 0, // Adjust the left position as needed
        // backgroundColor: '#007500',
        // paddingHorizontal: 5, // Add padding to the badge text
        flexDirection: 'row',
        paddingHorizontal: 10,
        // justifyContent: 'center',
        alignItems: 'center'
        // borderRadius: 5, // Add border radius to make it rounded
    },
    badgeText: {
        color: '#007500',
        fontSize: 12,
        marginLeft: 3,
        fontWeight:'600'
    },
});

export default Product;
