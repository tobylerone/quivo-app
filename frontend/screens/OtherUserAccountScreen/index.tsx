import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import * as constants from "../../constants";
import NavBar from "../../components/NavBar";

export default function OtherUserAccountScreen({route, navigation}: NativeStackHeaderProps) {

    const { userName } = route.params;
    
    return (
        <SafeAreaView style={styles.container}>
            <NavBar title={userName} navigation={navigation}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 20
    },
    title: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        backgroundColor: constants.SECONDARYCOLOR,
        width: '100%',
        textAlign: 'center',
        padding: 10
    }
});