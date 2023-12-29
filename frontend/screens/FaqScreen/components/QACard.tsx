import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as constants from "../../../constants";

interface IQAData {
    item: {
        question: string,
        answer: string
    },
    defaultActive: boolean
}

export default function QACard({item, defaultActive}: IQAData) {

    const [isActive, setIsActive] = useState(defaultActive);
    
    useEffect(() => {
    }, [])

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={1}
                style={styles.questionContainer}
                onPress={() => {setIsActive(!isActive)}}
                >
                <Text style={styles.questionText}>{item.question}</Text>
            </TouchableOpacity>
            {isActive &&
            <View style={styles.answerContainer}>
                <Text style={styles.answerText}>{item.answer}</Text>
            </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: constants.PRIMARYCOLOR,
        borderWidth: 2,
        borderColor: constants.PRIMARYCOLOR,
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden'
    },
    questionContainer: {
        backgroundColor: constants.PRIMARYCOLOR,
        padding: 10
    },
    questionText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.TERTIARYCOLOR,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    answerContainer: {
        padding: 10,
        backgroundColor: constants.TERTIARYCOLOR
    },
    answerText: {
        fontSize: constants.CONTENTFONTSIZE,
        fontFamily: constants.FONTFAMILY,
        color: constants.BLACK,
    }
});