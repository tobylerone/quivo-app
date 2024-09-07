import { useState, useRef } from "react";
import { Animated } from "react-native";

export default function useLanguagePopupVisible(){

    const languagePopupAnimation = useRef(new Animated.Value(0)).current;

    const [languagePopupVisible, setLanguagePopupVisible] = useState(false);

    const toggleLanguagePopup = () => {
        Animated.timing(languagePopupAnimation, {
        toValue: languagePopupVisible ? 0 : 70,
        duration: 400,
        useNativeDriver: false,
        }).start(() => {
            setLanguagePopupVisible(!languagePopupVisible);
        });
        if (languagePopupVisible) {
            setLanguagePopupVisible(false);
        }
    };

    return { languagePopupVisible, setLanguagePopupVisible, languagePopupAnimation, toggleLanguagePopup };
}