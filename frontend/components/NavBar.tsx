import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import * as constants from "../constants";

interface INavBarData {
    title?: string,
    navigation: NativeStackHeaderProps
}

export default function NavBar({title, navigation}: INavBarData) {

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={1}
                style={styles.backButton}
                onPress={() => {navigation.goBack()}}
                >
                <FontAwesome name="arrow-left" size={20} color={constants.BLACK} />
            </TouchableOpacity>
            {title &&
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title}</Text>
            </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        //backgroundColor: constants.TERTIARYCOLOR,
        marginBottom: 10,
        //marginHorizontal: 10
    },
    backButton: {
        width: 20,
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: -20,
    },
    titleContainer: {
        padding: 10,
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    titleText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK,
        marginTop: 'auto',
        marginBottom: 'auto'
    }
});