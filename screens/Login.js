import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
 BackHandler
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import generateOTP from "../components/GenerateOtp";
import useBackButtonHandler from '../hooks/useBackButtonHandler';

const LoginScreen = ({ navigation }) => {
  const exitApp = () => {
    BackHandler.exitApp();
};

useBackButtonHandler(exitApp);
  const [mobileNumber, setMobileNumber] = useState("");

  const handleLoginPress = () => {
    if (mobileNumber.length === 10) {
      // Generate OTP
      const otp = generateOTP();
      // console.log("Generated OTP:", otp);
      // navigation.navigate('OTPScreen', { mobileNumber, otp });
  
      // Construct the API URL
      const authKey = '368636AhgCa8iWjB616d1c8aP1';
      const sender = 'MSPLHS';
      const route = '4';
      const country = '91';
      const dltTeId = '1307171645767421800';
      const message = `${otp} is your verification code for Metrolite Mobile App`;
  
      const apiUrl = `https://admin.bulksmslogin.com/api/sendhttp.php?authkey=${authKey}&mobiles=${country}${mobileNumber}&message=${encodeURIComponent(message)}&sender=${sender}&route=${route}&country=${country}&DLT_TE_ID=${dltTeId}`;
  
      // Send OTP via the Bulk SMS API
      fetch(apiUrl)
        .then(response => response.text())  
        .then(data => {
          
          navigation.navigate('OTPScreen', { mobileNumber, otp });
        })
        .catch(error => {
          console.error("Error sending OTP:", error);
          alert("Error sending OTP. Please try again.");
          
        });
      
    } else {
      alert("Please enter a valid 10-digit mobile number.");
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.logoContainer}>
        <Image
          style={styles.imageLogo}
          source={require("../assets/logo.png")}
        />
      </View>
      <View style={styles.loginContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Mobile Number:</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Enter Mobile Number"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            onChangeText={(text) => {
              if (text.length <= 10) {
                setMobileNumber(text);
              }
            }}
            maxLength={10}
          />

          {/* <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Enter Name"
            placeholderTextColor="#ccc"
            onChangeText={(text) => {
              // Handle name input here
            }}
          /> */}
          <TouchableOpacity
            onPress={handleLoginPress}
            style={[
              styles.loginButton,
              {
                backgroundColor: mobileNumber.length === 10 ? "green" : "grey",
              },
            ]}
            disabled={mobileNumber.length !== 10 && mobileNumber !== ""}
          >
            <Text style={styles.loginText}>Continue </Text>
            <FontAwesome name="long-arrow-right" size={18} color="white" />
          </TouchableOpacity>

          <Text style={styles.policyText}>
            By continuing, you agree to our
            <Text style={styles.linkText}> Terms & Conditions </Text>
            and
            <Text style={styles.linkText}> Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#e6ecf1",
  },

  logoContainer: {
    backgroundColor: "#e6ecf1",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    flex:1/2
  },

  imageLogo: {
    width: 120,
    height: 120,
  },

  loginContainer: {
    flex:1/2,
    backgroundColor: "#e6ecf1",
    // borderWidth:2,
    width: "100%",
    paddingBottom: 20,
    justifyContent:'flex-end',
    // Adjust this value as needed
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  inputContainer: {
    width: "90%",
    alignSelf: "center",
    paddingTop: 20,
    paddingBottom: 50,
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
    marginBottom: 20,
  },

  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },

  loginText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },

  linkText: {
    color: "blue",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },

  policyText: {
    textAlign: "center",
    marginTop: 5,
  },
});

export default LoginScreen;
