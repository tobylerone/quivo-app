import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { fastImage } from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
// Constants
import * as constants from '../../constants';

export default function IncreaseStreakScreen({navigation}: NativeStackHeaderProps){
    
    return (
    <View style={styles.container}>
        <TouchableOpacity
            style={styles.crossContainer}
            onPress={() => navigation.goBack()}
            >
            <FontAwesomeIcon style={styles.cross} icon={faX} size={30} />
        </TouchableOpacity>
        <LottieView 
            source={require('../../assets/fireworks.json')}
            autoPlay
            loop
            style={{width: 100, height: 100}}
        />
        <View style={styles.streakNumberContainer}>
        <Image style={styles.parrotGif} source={require('../../assets/gif/parrot-happy-gif.gif')} />
            <Text style={styles.streakNumberText}>103</Text>
        </View>
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
        marginBottom: -50,
        paddingHorizontal: 20,
        flexDirection: 'row'
    },
    cross: {
        marginLeft: 'auto'
    },
    streakNumberContainer: {
        flexDirection: 'column',
        marginTop: 'auto',
        marginBottom: 'auto',
        //borderWidth: 2,
        //borderColor: constants.BLACK
    },
    streakNumberText: {
        fontSize: 150,
        marginBottom: 150,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.PRIMARYCOLOR,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    parrotGif: {
        width: 200,
        height: 200,
        marginBottom: -50,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});