import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const useBackButtonHandler = (exitAppCallback) => {
    const navigation = useNavigation();

    useEffect(() => {
        const backAction = () => {
            if (navigation.isFocused()) {
                Alert.alert(
                    "Hold on!",
                    "Are you sure you want to exit the app?",
                    [
                        {
                            text: "Cancel",
                            onPress: () => null,
                            style: "cancel"
                        },
                        { text: "YES", onPress: () => exitAppCallback() }
                    ]
                );
                return true;
            } else {
                return false;
            }
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [navigation]);
};

export default useBackButtonHandler;
