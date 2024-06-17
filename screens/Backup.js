import React, { useContext, useEffect, useState, } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacityBase, TouchableOpacity, Modal } from 'react-native';
import { DataContext } from '../Data/DataContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

const Product = ({ parentCategoryId }) => {
    const { allProducts } = useContext(DataContext);
    const [filteredItems, setFilteredItems] = useState([]);

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

    return (
        <View style={styles.main}>
            {filteredItems.map((product, index) => {
                const discountedPrice = Math.floor(calculatePriceAfterDiscount(product.price, product.discount));
                return (
                    <View key={index} style={styles.productContainer}>
                        <Modal transparent={true}>
                        <View style={styles.modalBox}>
                            <View style={styles.modalDescriptionBox}>
                                <Text>{product.description}</Text>
                            </View>
                        </View>
                        </Modal>

                        <View style={styles.imageBox}>
                            <Image source={{ uri: `http://192.168.1.11:5000/productimage/${product.image}` }} style={{
                                width: "100%",
                                height: "100%",
                                resizeMode: 'stretch',
                                borderRadius:10
                            }} />
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
                        <View style={styles.timeBox}>
                        <Ionicons name='stopwatch' size={20} color='#FD9A01'/>
                            <Text style={styles.productDuration}> {product.duration} min</Text>
                        </View>

                        <View style={styles.descriptionBox}>
                            <Text style={styles.descriptionText}>{product.description}</Text>
                        </View>

                        <View style={styles.buttonBox}>
                            <TouchableOpacity style={styles.viewDetailBtn}>
                            <Text style={styles.viewDetailText}>View Details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cartBtn}>
                            <Feather name="shopping-cart" color='#fff' size={18} />
                            <Text style={styles.cartBtnText}>Add to Cart</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )
            }

            )}
        </View>
    );
};

const styles = StyleSheet.create({

    main: {
        backgroundColor: '#EEEEEE',
        marginBottom:30
    },
    productContainer: {
        marginTop: 10,
        backgroundColor: '#fff',
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 15,
        flex: 1,
        borderRadius:10
    },
    imageBox: {
        width: "100%",
        height: 200,
        marginTop: 0,
        // borderWidth:2,
    },
    priceBox:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:5,
        paddingRight:5
    },
    name:{
        width:'65%'
    },

    price:{
        width:'30%',
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between'
    },

    productName: {

        fontSize: 20,

    },
    productDescription: {
        fontStyle: 'italic',
    },
    productPrice: {
        color: 'grey',
        textDecorationLine:'line-through',
        fontSize:12
    },

    discountPrice:{
        fontSize:16,
        fontWeight:'700'
    }, 
    productDiscount:{
        color:'green',
        fontSize:10,
        fontWeight:'500'
    },
    timeBox:{
        flexDirection:'row',
        paddingLeft:5,
        paddingRight:5,
        // borderWidth:2,
        justifyContent:'flex-end',
        alignItems:'center'
    },
    productDuration:{
        marginLeft:5,
        fontSize:12
    },

    descriptionBox:{
        paddingLeft:5,
        paddingRight:5,
        maxHeight:40
    },
    descriptionText:{
        lineHeight:20
    },

    buttonBox:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:10,
        paddingLeft:5,
        paddingRight:5
    },
    viewDetailBtn:{
        backgroundColor:'#EB1E63',
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:10,
        borderRadius:5
    },
    viewDetailText:{
        color:'#fff',
        fontSize:14
    },
    cartBtn:{
        backgroundColor:'#000000',
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:10,
        borderRadius:5,
        flexDirection:'row'
    },
    cartBtnText:{
        color:'#fff',
        fontSize:14,
        marginLeft:10
    },

    modalBox:{
        flex:1,
        
        justifyContent:'center',
        alignItems:'center'
    },

    modalDescriptionBox:{
        // backgroundColor:'#fff',
        // padding:10,
        height:300
        
    }

});

export default Product;
