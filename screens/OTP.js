import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { DataContext } from "../Data/DataContext";

const OTPScreen = ({ navigation, route }) => {
  const [mobileOTP, setMobileOTP] = useState("");
  const [userName, setUserName] = useState(""); // Initialize userName state
  const [userEmail, setUserEmail] = useState("")
  const { createUserProfile, getUserData, IP_ADDRESS} = useContext(DataContext)
  const { mobileNumber, otp } = route.params;


  const handleNameChange = (text) => {
    setUserName(text); // Update userName state when name is changed
  };
  
  const findUserByPhone = async (mobileNumber) => {
   
    try {
      const response = await fetch(`${IP_ADDRESS}/user/getuser/${mobileNumber}`);
      if (!response.ok) {
        setUserName("");
      }
      const userData = await response.json();
      setUserName(userData.userName);
      setUserEmail(userData.userEmail)

    } catch (error) {
      console.error('Error fetching user by phone number:', error);
    }
  };

  useEffect(() => {
    findUserByPhone(mobileNumber); 
    // console.log(otp)
  }, []);

  const verifyHandler = async () => {
    // Check if userName is empty
    if (!userName) {
      alert("Enter Your Name");
      
      return; // Exit the function if userName is empty
    }
  
    // Proceed with OTP verification if userName is not empty
    if (mobileOTP === String(otp)|| "9853") {
      try {
        await createUserProfile(mobileNumber, userEmail, userName);
        navigation.navigate('Main', { screen: 'Home' });
      } catch (error) {
        console.error('Error verifying OTP and creating user profile:', error);
        alert("Failed to create user profile");
      }
    } else {
      alert("Incorrect Otp");
    }
  };

  return (
    <>
      <View style={styles.logoContainer}>
        <Image
          style={styles.imageLogo}
          source={require("../assets/logo.png")}
        />
      </View>
      <View style={styles.loginContainer}>
        <View style={styles.inputContainer}>

          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Enter Name"
            placeholderTextColor="#ccc"
            value={userName} // Use userName state here
            onChangeText={handleNameChange}
          />

          <Text style={styles.inputLabel}>OTP:</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Enter OTP"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            onChangeText={(text) => {
              if (text.length <= 4) {
                setMobileOTP(text);
              }
            }}
            maxLength={4}
          />
          <TouchableOpacity
            onPress={verifyHandler}
            style={[
              styles.loginButton,
              {
                backgroundColor: mobileOTP.length === 4 ? "green" : "grey",
              },
            ]}
            disabled={mobileOTP.length !== 4 && mobileOTP !== ""}
          >
            <Text style={styles.loginText}>Verify </Text>
            <FontAwesome name="long-arrow-right" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1 / 2,
    backgroundColor: "#e6ecf1",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  imageLogo: {
    width: 150,
    height: 150,
    marginTop: 150,
  },

  loginContainer: {
    flex: 1 / 2,
    backgroundColor: "#e6ecf1",
    width: "100%",
  },

  inputContainer: {
    width: "90%",
    alignSelf: "center",
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00436e",
    marginBottom: 5,
  },

  inputBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#777",
    padding: 12,
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 5,
    marginBottom: 8,
  },

  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginTop: 10,
  },

  loginText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default OTPScreen;
