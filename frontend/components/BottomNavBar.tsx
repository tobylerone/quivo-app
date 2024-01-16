import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import * as constants from "../constants";

interface IBottomNavBarProps {
    hilighted: 'Home' | 'Learn' | 'Account',
    navigation: NativeStackHeaderProps
}

export default function BottomNavBar({hilighted, navigation}: IBottomNavBarProps) {

    //const [activeButton, setActiveButton] = useState('Learn');

    const buttons = [
        {icon: faHome, navigateTo: 'Home'},
        {icon: faBars, navigateTo: 'Learn'},
        {icon: faUser, navigateTo: 'Account'}
    ];
    
    const renderButton = (icon, navigateTo: string) => (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.button}
            onPress={() => {
                //setActiveButton(toScreen);
                navigation.navigate(navigateTo);
            }}
            >
            <View style={{borderColor: hilighted === navigateTo ? constants.PRIMARYCOLOR : constants.TERTIARYCOLOR, ...styles.faIconContainer}}>
                <FontAwesomeIcon style={styles.faIcon} icon={icon} size={25} color={hilighted === navigateTo ? constants.PRIMARYCOLOR : constants.GREY} />
            </View>
        </TouchableOpacity>
    )
    
    return (
        <View style={styles.container}>
            {buttons.map((item) => renderButton(item.icon, item.navigateTo))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        position: 'absolute',
        height: 60,
        bottom: 0,
        borderTopWidth: 2,
        borderColor: constants.GREY,
        backgroundColor: constants.TERTIARYCOLOR
        //marginHorizontal: 10
    },
    button: {
        width: '33.333%',
        marginTop: 'auto',
        marginBottom: 'auto',
        height: '100%'
    },
    faIconContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        borderWidth: 2,
        borderRadius: 10,
        padding: 7
    },
    faIcon: {
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