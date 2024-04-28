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

    return (
        <View>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: constants.PURPLEREGULAR,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: constants.PURPLEREGULAR,
        marginBottom: 10,
        overflow: 'hidden',
        zIndex: 1
    },
    questionContainer: {
        backgroundColor: constants.PURPLELIGHT,
        padding: 10
    },
    questionText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.PURPLEREGULAR,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    answerContainer: {
        padding: 10,
        backgroundColor: constants.TERTIARYCOLOR,
        borderTopWidth: 3,
        borderTopColor: constants.PURPLEREGULAR,
    },
    answerText: {
        fontSize: constants.CONTENTFONTSIZE,
        fontFamily: constants.FONTFAMILY,
        color: constants.BLACK,
    }
});