import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import * as constants from "../../constants";
import NavBar from "../../components/NavBar";
import QACard from "./components/QACard";

export default function FaqScreen({navigation}: NativeStackHeaderProps) {
    
    // To be replaced by a JSON response
    const data = [
        {
            question: 'What do the levels equate to, and how are they calculated?',
            answer: 'Your level equates to the estimated percentage of the language you should be capable of understanding given the words you know. Therefore, when you learn a more common word it will contribute more to your level.'
        },
        {
            question: 'First question?',
            answer: 'Here is my response to the first question'
        },
        {
            question: 'Second question?',
            answer: 'Here is my response to the second question'
        }
    ]
    
    useEffect(() => {
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <NavBar title={'FAQs'} navigation={navigation}/>
            <QACard item={data[0]} />
            <QACard item={data[1]} />
            <QACard item={data[2]} />
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