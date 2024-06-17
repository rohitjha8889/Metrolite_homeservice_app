import { View, Text } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Bookings from './Bookings';
import Rewards from './Rewards';
import Cart from './Cart';
import Accounts from './Accounts';
import LoginScreen from './Login'; 
import OTPScreen from './OTP'; 
import AuthLoadingScreen from '../components/AuthLoadingScreen';
import SplashScreen from '../components/SplashScreen';


import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

import { DataContext } from '../Data/DataContext';


const Stack = createStackNavigator();


import Schedule from './Schedule';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { DataContext } from '../Data/DataContext';


const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {

    const { cartItemNumber, fetchCartItemNumber } = useContext(DataContext);

    useEffect(() => {
        fetchCartItemNumber()
    }, [])


    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#fff',
                    height: 55,
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingRight: 5
                },
                tabBarActiveTintColor: '#67B086',
                tabBarInactiveTintColor: '#A3A3A3',
                tabBarLabelStyle: {
                    fontSize: 14,
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="home" color={color} size={20} />
                    ),
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Bookings"
                component={Bookings}
                options={{
                    tabBarIcon: ({ color, size }) => (

                        <Feather name="calendar" color={color} size={20} />

                    ),

                    headerShown: false
                }

                }
            />
            <Tab.Screen
                name="Cart"
                component={Cart}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        // Prevent default action
                        e.preventDefault();
                        // Navigate to the Cart tab and reset the stack to its initial route
                        navigation.navigate('Cart');
                    },
                })}
                options={({ color, size }) => ({
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ position: 'relative' }}>
                            <Feather name="shopping-cart" color={color} size={20} />
                            {cartItemNumber > 0 && (
                                <View style={{ position: 'absolute', top: -5, right: -10, backgroundColor: '#4CAF50', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>{cartItemNumber}</Text>
                                </View>
                            )}
                        </View>
                    ),
                    headerShown: false
                })}
            />
            <Tab.Screen
                name="Rewards"
                component={Rewards}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="gift" color={color} size={20} />
                    ),
                }}
            />
            <Tab.Screen
                name="Account"
                component={Accounts}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="user" color={color} size={20} />
                    ),
                    headerShown: false
                }}
            />
        </Tab.Navigator>
    );
};

const AllScreen = ({ navigation }) => {



    return (
        <>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Splash'>
                <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                    options={{ headerShown: false }}
                />

                    <Stack.Screen
                        name="AuthLoading"
                        component={AuthLoadingScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="OTPScreen"
                        component={OTPScreen}
                        options={{ headerShown: false }}
                    />



                    <Stack.Screen
                        name="Main"
                        component={MainTabNavigator}
                        options={{ headerShown: false }}
                    />



                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}

export default AllScreen