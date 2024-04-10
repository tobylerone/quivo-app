import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
// Constants
import * as constants from '../../constants';
// Components
import NavBar from '../../components/NavBar';
import RaisedButton from '../../components/RaisedButton';

export default function GetPremiumScreen({navigation}: NativeStackHeaderProps){
    
    return (
    <View style={styles.container}>
        <NavBar navigation={navigation} />
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Upgrade to Premium</Text>
        </View>
        <View style={styles.parrotImageContainerShadow}></View>
        <View style={styles.parrotImageContainer}>
            <Image style={styles.parrotImage} source={require('../../assets/avatars/black-and-white-med.png')} />
        </View>
        <View style={styles.subtitleContainer}>
            <Text style={[styles.subtitleText, styles.subtitleText1]}>Pay $2.99 a month and enjoy:</Text>
            <Text style={[styles.subtitleText, styles.subtitleText2]}>· No more ads</Text>
            <Text style={[styles.subtitleText, styles.subtitleText2]}>· No daily word limit</Text>
        </View>
        <View style={styles.adButtonContainer}>
            <RaisedButton
                onPress={() => {}}
                options={{
                    ...RaisedButton.defaultProps.options,
                    backgroundColor: constants.PRIMARYCOLOR,
                    width: 200,
                    height: 50
                }}
            >
                <Text style={styles.adButtonText}>Get Premium</Text>
            </RaisedButton>
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingHorizontal: 16,
        height: '100%',
        backgroundColor: constants.LIGHTBLUE
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
        width: 210,
        height: 210,
        marginLeft: 20,
        marginTop: 20
    },
    adButtonContainer: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    adButtonText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.TERTIARYCOLOR,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'

    },
    adButtonShadow: {
        backgroundColor: constants.PRIMARYCOLORSHADOW,
        width: 250,
        height: 70,
        marginBottom: -77,
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
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
        marginBottom: 10
    },
    subtitleText2: {
        fontFamily: constants.FONTFAMILY,
    }
});