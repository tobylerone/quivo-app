import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { useEffect, useState} from "react";
import * as constants from "../../../constants";

interface IProgressBarButton {
    id: string,
    primaryColor: string,
    label: string,
    currentValue: number,
    isActive: boolean,
    onPress: Function,
    maxValue: number
}

export default function ProgressBarButton({id, primaryColor, label, currentValue, isActive, onPress, maxValue}: IProgressBarButton){

    const progressPercentage = Math.floor((currentValue / maxValue) * 100);

    const [borderColor, setBorderColor] = useState(isActive ? primaryColor: constants.TERTIARYCOLOR);
    
    useEffect(() => {
        setBorderColor(isActive ? primaryColor: primaryColor + '55');
    }, [isActive]);

    const handlePress = () => {
        // Trigger the function in the LanguageItem component's onPress
        onPress(id);
    };
    
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{
                borderColor: borderColor,
                backgroundColor: primaryColor + '33',
                ...styles.progressBarButton,
            }}
            onPress={handlePress}
            >
            <View style={{
                width: progressPercentage + '%',
                backgroundColor: primaryColor,
                ...styles.progressBar}}></View>
            <View style={styles.progressBarButtonTextContainer}>
                <Text style={styles.progressBarButtonText}>{label}</Text>
            </View>
            <View style={{
                backgroundColor: constants.TERTIARYCOLOR,
                ...styles.progressBarButtonNumberContainer
                }}>
                <Text style={styles.progressBarButtonNumberText}>{currentValue}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    progressBarButton: {
        //Color: constants.LIGHTGREY,
        flexDirection: "row",
        borderWidth: 3,
        borderRadius: 10,
        overflow: 'hidden',
        verticalAlign: 'center',
        marginRight: 5,
        paddingHorizontal: 5,
        marginBottom: 15,
        height: 40
    },
    progressBarButtonTextContainer: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: 10
    },
    progressBarButtonText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK
    },
    progressBarButtonNumberContainer: {
        //backgroundColor: constants.GREEN,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    progressBarButtonNumberText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK,
    },
    progressBar: {
        position: 'absolute',
        height: 40,
        //backgroundColor: constants.PRIMARYCOLOR,
        borderColor: constants.PRIMARYCOLOR
    }
});