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
    label: string,
    currentValue: number,
    isActive: boolean,
    onPress: Function,
    maxValue: number
}

export default function ProgressBarButton({id, label, currentValue, isActive, onPress, maxValue}: IProgressBarButton){

    const progressPercentage = Math.floor((currentValue / maxValue) * 100);

    const [borderColor, setBorderColor] = useState(isActive ? constants.BLACK: constants.SECONDARYCOLOR);
    
    useEffect(() => {
        setBorderColor(isActive ? constants.BLACK: constants.SECONDARYCOLOR);
    }, [isActive]);

    const handlePress = () => {
        // Trigger the function in the LanguageItem component's onPress
        onPress(id);
    };
    
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{
                ...styles.progressBarButton,
                borderColor: borderColor
            }}
            onPress={handlePress}
            >
            <View style={{width: progressPercentage + '%', ...styles.progressBar}}></View>
            <View style={styles.progressBarButtonTextContainer}>
                <Text style={styles.progressBarButtonText}>{label}</Text>
            </View>
            <View style={styles.progressBarButtonNumberContainer}>
                <Text style={styles.progressBarButtonNumberText}>{currentValue}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    progressBarButton: {
        backgroundColor: constants.SECONDARYCOLOR,
        flexDirection: "row",
        borderWidth: 3,
        borderRadius: 10,
        overflow: 'hidden',
        verticalAlign: 'center',
        marginHorizontal: 5,
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
        fontFamily: constants.FONTFAMILYBOLD
    },
    progressBarButtonNumberContainer: {
        backgroundColor: constants.PRIMARYCOLOR,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    progressBarButtonNumberText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.TERTIARYCOLOR,
    },
    progressBar: {
        position: 'absolute',
        height: 40,
        backgroundColor: constants.PRIMARYCOLOR,
        borderColor: constants.PRIMARYCOLOR
    }
});