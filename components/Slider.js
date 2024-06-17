import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, Dimensions, Image, Animated, ScrollView } from 'react-native';
import { DataContext } from '../Data/DataContext';

const Slider = ({ discountedSlider }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { IP_ADDRESS } = useContext(DataContext);
  const width = Dimensions.get('window').width - 50;
  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === discountedSlider.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [discountedSlider.length]);

  useEffect(() => {
    Animated.spring(scrollX, {
      toValue: currentIndex * width,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  return (
    <View style={{ marginTop: 20 }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
          listener: handleScroll,
        })}
        scrollEventThrottle={16}
      >
        {discountedSlider.map((item, index) => (
          <View key={index} style={{ width, height: width / 2, marginRight: 10 }}>
            <Image
              source={{ uri: `${IP_ADDRESS}/allposter/${item.poster}` }}
              style={{
                flex: 1,
                resizeMode: 'stretch',
                justifyContent: 'center',
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Slider;