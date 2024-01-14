import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
// Constants
import * as constants from '../../constants';

export default function MaxWordsReachedScreen({navigation}: NativeStackHeaderProps){
    
    return (
    <View style={styles.container}>
        <TouchableOpacity
            style={styles.crossContainer}
            onPress={() => navigation.goBack()}
            >
            <FontAwesomeIcon style={styles.cross} icon={faX} size={30} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>You've reached your daily word limit!</Text>
        </View>
        <View style={styles.parrotImageContainerShadow}></View>
        <View style={styles.parrotImageContainer}>
            <Image style={styles.parrotImage} source={require('../../assets/parrot-sad-shadow.png')} />
        </View>
        <View style={styles.subtitleContainer}>
            <Text style={[styles.subtitleText, styles.subtitleText1]}>50 new words today, not bad!</Text>
            <Text style={[styles.subtitleText, styles.subtitleText2]}>Watch a short ad and unlock 50 more, or wait until tomorrow for your counter to reset</Text>
        </View>
        <TouchableOpacity style={styles.adButton}><Text style={styles.adButtonText}>Watch Ad</Text></TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        height: '100%',
        backgroundColor: constants.GREEN
    },
    crossContainer: {
        height: 50,
        paddingHorizontal: 20,
        flexDirection: 'row'
    },
    cross: {
        marginLeft: 'auto',
        color: constants.BLACK
    },
    titleContainer: {
        marginHorizontal: 10
    },
    titleText: {
        fontSize: constants.H1FONTSIZE,
        marginBottom: 30,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK,
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center'
    },
    parrotImageContainer: {
        backgroundColor: constants.TERTIARYCOLOR,
        borderRadius: 125,
        width: 250,
        height: 250,
        marginLeft: 'auto',
        marginRight: 'auto',
        //marginTop: 'auto',
        marginBottom: 30
    },
    parrotImageContainerShadow: {
        backgroundColor: constants.GREY,
        borderRadius: 125,
        width: 250,
        height: 250,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: -257,
        opacity: 0.8
    },
    parrotImage: {
        width: 160,
        height: 158,
        marginLeft: 45,
        marginTop: 45
    },
    adButton: {
        backgroundColor: constants.PRIMARYCOLOR,
        width: 250,
        padding: 20,
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    adButtonText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.TERTIARYCOLOR,
        marginLeft: 'auto',
        marginRight: 'auto',

    },
    subtitleContainer: {
        //marginTop: 'auto',
        marginBottom: 30,
        marginHorizontal: 20
    },
    subtitleText: {
        fontSize: constants.H2FONTSIZE,
        color: constants.BLACK,
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center'
    },
    subtitleText1: {
        fontFamily: constants.FONTFAMILYBOLD,
        marginBottom: 30
    },
    subtitleText2: {
        fontFamily: constants.FONTFAMILY,
    }
});