import { View, Text, Dimensions, Image } from 'react-native';
import React, { useContext } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { DataContext } from '../Data/DataContext';

const ProductSlider = ({ productImage }) => {
    const width = Dimensions.get('window').width;
    const { IP_ADDRESS } = useContext(DataContext);
    
    return (
        <View style={{ flex: 1, overflow: 'hidden', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                data={productImage}
                scrollAnimationDuration={1000}
                autoPlayInterval={5000}
                renderItem={({ item }) => (
                    <View style={{ flex: 1 }}>
                        <Image
                            source={{ uri: `${IP_ADDRESS}/productimage/${item}` }}
                            style={{
                                flex: 1,
                                resizeMode: 'cover',
                                justifyContent: 'center',
                                
                            }}
                        />
                    </View>
                )}
            />
        </View>
    );
}

export default ProductSlider;
