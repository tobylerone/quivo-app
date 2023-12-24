import { View, SafeAreaView, Text, StyleSheet, Dimensions } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import UserContext from '../../contexts/UserContext';
import * as constants from '../../constants';
import { LineChart } from "react-native-chart-kit";
import WordsLearnedPanel from "./components/WordsLearnedPanel";
import DailyProgressPanel from "./components/DailyProgressPanel";

export default function HomeScreen({navigation}: NativeStackHeaderProps) {

    interface ILanguage {
        id: number,
        language_code: string,
        language_name: string
    }

    const { currentUser, knownLanguages, currentLanguage } = useContext(UserContext);

    let currentLanguageName: string = knownLanguages.find(
        (lang: ILanguage) => lang.language_code === currentLanguage
        ).language_name;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Your {currentLanguageName} Progress</Text>
            <WordsLearnedPanel currentLanguageName={currentLanguageName} />
            <DailyProgressPanel />
        </SafeAreaView>
    )
 }

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginLeft:20,
        marginRight: 20,
        marginTop: 50,
        flex: 1
    },
    header: {
        textTransform: 'capitalize',
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        marginBottom: 20
    }
});