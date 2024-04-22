import { useState, useRef } from "react";
import { Animated, Dimensions } from "react-native";

export default function useFilterPopupVisible(){

    const windowHeight = Dimensions.get('window').height;

    const filterPopupAnimation = useRef(new Animated.Value(windowHeight)).current;

    const [filterPopupVisible, setFilterPopupVisible] = useState(false);

    const toggleFilterPopup = () => {
        setFilterPopupVisible(!filterPopupVisible);
        Animated.timing(filterPopupAnimation, {
        toValue: filterPopupVisible ? windowHeight : 0.2 * windowHeight,
        duration: 400,
        useNativeDriver: false,
        }).start();
    };

    return { filterPopupVisible, filterPopupAnimation, toggleFilterPopup };
}