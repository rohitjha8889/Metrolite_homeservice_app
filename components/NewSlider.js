import React, { useContext, useState } from "react";
import { View, Image, Dimensions } from "react-native"; // Import Dimensions
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { DataContext } from '../Data/DataContext';

const { width: PAGE_WIDTH } = Dimensions.get("window"); // Get the width of the screen

const NewSlider = ({ mainSlider }) => {
  const {IP_ADDRESS} = useContext(DataContext)
  const [isVertical, setIsVertical] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [pagingEnabled, setPagingEnabled] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const progressValue = useSharedValue(0);
  const baseOptions = isVertical
    ? ({
        vertical: true,
        width: PAGE_WIDTH * 0.86,
        height: PAGE_WIDTH * 0.6,
      })
    : ({
        vertical: false,
        width: PAGE_WIDTH,
        height: PAGE_WIDTH * 0.6,
      });

  return (
    <View
      style={{
        alignItems: "center",
        // borderWidth:2
      }}
    >
      <Carousel
        {...baseOptions}
        style={{
          width: PAGE_WIDTH,
          
          
        }}
        loop
        pagingEnabled={pagingEnabled}
        snapEnabled={snapEnabled}
        autoPlay={autoPlay}
        autoPlayInterval={3000}
        animationConfig={{
          duration: 1000, // Set the duration of the animation to 2000 milliseconds (2 seconds)
        }}
        // transitionInterval={3000}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        data={mainSlider}
        renderItem={({ item }) => (
          <View
            style={{
              width: PAGE_WIDTH,
              height: PAGE_WIDTH * 0.55,
              justifyContent: "center",
              alignItems: "center",
              padding:4,
              backgroundColor:'#fff',
              // borderWidth:2,
              // marginHorizontal: 50,
              borderRadius: 10, 
            }}
          >
            <Image
              source={{ uri: `${IP_ADDRESS}/allposter/${item.poster}` }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode:'stretch',
                borderRadius:10
              }}
            />
          </View>
        )}
      />
      {!!progressValue && (
        <View
          style={
            isVertical
              ? {
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: 10,
                  alignSelf: "center",
                  position: "absolute",
                  right: 5,
                  top: 40,
                  // borderWidth:1
                }
              : {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: 50,
                  alignSelf: "center",
                  // borderWidth:1
                }
                
          }
        >
          {mainSlider.map((slide, index) => {
            return (
              <PaginationItem
                key={index}
                backgroundColor={slide.backgroundColor}
                animValue={progressValue}
                index={index}
                isRotate={isVertical}
                length={mainSlider.length}

              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const PaginationItem = ({
  index,
  backgroundColor,
  length,
  animValue,
  isRotate,
}) => {
  const width = 5;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  }, [animValue, index, length]);

  // Set active color to green if the current index matches the progress value
  const activeColor = animValue?.value === index ? "#00456e" : backgroundColor;

  return (
    <View
      style={{
        backgroundColor: "white",
        width,
        height: width,
        borderRadius: 50,
        overflow: "hidden",
        marginTop:-20,
        // borderWidth:2,
        // marginHorizontal: 25,
        transform: [
          {
            rotateZ: isRotate ? "90deg" : "0deg",
          },
        ],
      }}
    >
      <Animated.View
        style={[
          {
            borderRadius: 50,
            backgroundColor: '#00456e', // Use activeColor here
            flex: 1,
            
          },
          animStyle,
        ]}
      />
    </View>
  );
};

export default NewSlider;
