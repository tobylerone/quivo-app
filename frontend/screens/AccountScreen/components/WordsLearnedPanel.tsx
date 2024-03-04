import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useContext } from "react";
import UserContext from '../../../contexts/UserContext';
import * as constants from '../../../constants';
import { LineChart } from "react-native-chart-kit";
// Utils
import { sumWordCounts } from "../../../utils/functions";
import WordListScreen from "../../WordListScreen";

interface IWordsLearnedPanelProps {
    navigation: any
}

export default function WordsLearnedPanel({navigation}: IWordsLearnedPanelProps) {

    const { currentUser, wordCounts } = useContext(UserContext);
    console.log(wordCounts);

    const renderBar = (title: string, total: number, value: number) => (
        <View style={styles.barContainer}>
            <Text style={styles.barCountText}>{value}</Text>
            <View style={styles.barBackground} >
                <View style={{
                    height: (value / total) * 150,
                    ...styles.barForeground
                }}></View>
            </View>
            <Text style={styles.barLabelText}>{title}</Text>
        </View>
    );

    return (
    <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={() => {navigation.navigate('WordList')}}
        >
        <View style={styles.titleBar}>
            <Text style={styles.titleText}>Words Learned</Text>
        </View>
        <View style={styles.panelBody}>
            {wordCounts ?
                Object.entries(wordCounts).map(([key, value]) => renderBar(key.replace(/00[01]/g, 'k'), 1000, value))
            : <ActivityIndicator size="large" color={constants.ORANGE} />
            }
        </View>
    </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        height: 'auto',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: constants.GREEN
    },
    titleBar: {
        flexDirection: 'row',
        backgroundColor: constants.GREEN,
        marginBottomColor: constants.GREEN
    },
    titleText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.BLACK,
        padding: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    panelBody: {
        flexDirection: 'row',
        height: 230
    },
    barContainer: {
        height: 150,
        width: '16.666%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },
    barCountText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.CONTENTFONTSIZE,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    barLabelText: {
        fontFamily: constants.FONTFAMILY,
        fontSize: constants.CONTENTFONTSIZE,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    barBackground: {
        backgroundColor: constants.GREEN,
        height: '100%',
        margin: 10
    },
    barForeground: {
        backgroundColor: constants.PRIMARYCOLOR,
        marginTop: 'auto'
    }
});