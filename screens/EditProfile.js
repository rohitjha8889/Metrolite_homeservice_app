import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Button, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DataContext } from '../Data/DataContext';

const EditProfile = ({navigation}) => {
    const [focusedInput, setFocusedInput] = useState(null);
    const {userDetail, IP_ADDRESS, createUserProfile, userProfileImage} = useContext(DataContext);

    const imageUrl = `${IP_ADDRESS}/userprofilepic/${userDetail.profilePic}`;

    let [image, setImage] = useState(imageUrl);
    const [formData, setFormData] = useState({
        name: `${userDetail.userName}`,
        email: `${userDetail.emailId}`,
        profileImage: image
    });

    const handleFocus = (inputName) => {
        setFocusedInput(inputName);
    };

    const handleBlur = () => {
        setFocusedInput(null);
    };

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        const phone = userDetail.phone
        console.log(phone)
       createUserProfile(phone, formData.email, formData.name)
       image = image.split('\\').pop(); 
       userProfileImage(image)
       navigation.navigate('Accounts')
        // Here you can perform any further actions with the form data
    };

    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });

        if (!result.cancelled) {
            setImage(result.assets[0].uri);
            setFormData({ ...formData, profileImage: result.assets[0].uri });
            
        }
    };



    return (
        <>
       
        <View style={styles.main}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                        <Icon name="pencil" size={20} color="gray" />
                    )}
                </TouchableOpacity>





                {/* <Text style={styles.label}>Name</Text> */}
                <TextInput

                    style={[styles.input, focusedInput === 'username' && styles.inputFocused]}
                    onFocus={() => handleFocus('username')}
                    onBlur={handleBlur}
                    placeholder="Name"
                    value={formData.name}
                    onChangeText={text => handleInputChange('name', text)}
                />

                {/* <Text style={styles.label}>Email Address</Text> */}
                <TextInput
                    style={[styles.input, focusedInput === 'email' && styles.inputFocused]}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    placeholder="Email"
                    value={formData.email}
                    onChangeText={text => handleInputChange('email', text)}
                />

                <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                    <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>

            </View>
        </View>
        </>
    );
};

const styles = StyleSheet.create({
    main: {
        // padding:20,
        margin:20,
        flex: 1,
        backgroundColor: '#fff',
        borderRadius:20
    },

    container: {
        marginTop: 10,
        flex: 1,
        padding: 20,
        
        alignItems: 'center',
        justifyContent: 'center',

    },
    imageContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth:2,
        borderColor:'grey'
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    input: {
        borderWidth: 2,
        borderColor: '#279AD1',
        padding: 10,
        fontSize: 18,
        height: 50,
        borderRadius: 8,
        width: '100%',
        marginBottom: 20
    },

    label: {
        marginLeft: 5,
        marginBottom: 5,
        fontWeight: '600',
        width: '80%',
        color: 'grey'
    },

    saveBtn: {
        backgroundColor: '#53B175',
        width: '100%',
        padding: 15,
        borderRadius: 20
    },

    saveBtnText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        fontWeight: '700'
    },

    inputFocused: {
        borderColor: '#53B175'
    }



});

export default EditProfile;
