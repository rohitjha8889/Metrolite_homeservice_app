import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Dimensions, Image, ScrollView } from 'react-native';
import { DataContext } from '../Data/DataContext';

const ProductCustom = ({ productImage }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { IP_ADDRESS } = useContext(DataContext);
    const width = Dimensions.get('window').width - 20;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === productImage.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(event) => {
                    const contentOffsetX = event.nativeEvent.contentOffset.x;
                    const index = Math.round(contentOffsetX / width);
                    setCurrentIndex(index);
                }}
                scrollEventThrottle={16}
            >
                {productImage.map((item, index) => (
                    <View key={index} style={{ width, height: width /2, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <Image
                            source={{ uri: `${IP_ADDRESS}/productimage/${item}` }}
                            style={{
                                flex: 1,
                                resizeMode: 'stretch',
                                justifyContent: 'center',
                                // borderRadius: 5,
                                borderTopLeftRadius: 10, borderTopRightRadius: 10 
                            }}
                        />
                    </View>
                ))}
            </ScrollView>
           
        </View>
    );
};

export default ProductCustom;
