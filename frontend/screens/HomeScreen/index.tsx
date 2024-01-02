import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import PNG from 'pngjs';
import UserContext from '../../contexts/UserContext';
import * as constants from '../../constants';
import { LineChart } from "react-native-chart-kit";
import WordsLearnedPanel from "./components/WordsLearnedPanel";
import DailyProgressPanel from "./components/DailyProgressPanel";
import { calcLevel } from "../../utils/functions";

export default function HomeScreen({navigation}: NativeStackHeaderProps) {

    interface ILanguage {
        id: number,
        language_code: string,
        language_name: string
    }

    const flagImageMap: Record<string, PNG> = {
        'ru': require('../../assets/ru.png'),
        'de': require('../../assets/de.png'),
        'es': require('../../assets/es.png'),
        'fr': require('../../assets/fr.png')
    };

    const { currentUser, knownLanguages, currentLanguage } = useContext(UserContext);

    const userStreak = 26;

    const { level, levelResidual } = calcLevel(currentUser.known_words_count[currentLanguage], 30000);

    let currentLanguageName: string = knownLanguages.find(
        (lang: ILanguage) => lang.language_code === currentLanguage
        ).language_name;

    const data = [
        {
            text: 'Words Learned',
            subText: currentUser.known_words_count[currentLanguage] + ' / 30129',
            image: require('../../assets/words_learned.png'),
            navigateTo: 'WordsLearned'
        },
        {
            text: 'Progress',
            subText: '+49 words this week',
            image: require('../../assets/progress.png'),
            navigateTo: 'Progress'
        },
        {
            text: 'Leaderboard',
            subText: '6th this week',
            image: require('../../assets/leaderboard.png'),
            navigateTo: 'Progress'
        },
    ];

        return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Image source={flagImageMap[currentLanguage]} style={styles.flagImage} />
                <Text style={styles.header}>Your {currentLanguageName} Progress</Text>
            </View>
            {/*<WordsLearnedPanel currentLanguageName={currentLanguageName} />
            <DailyProgressPanel />*/}
            <View style={styles.panelContainer}>
                <TouchableOpacity style={styles.panel}>
                    <Text style={styles.panelHeader}>Level</Text>
                    <View style={styles.panelLevelNumber}>
                        <Text style={styles.panelLevelNumberText}>{level}</Text>
                    </View>
                    <View style={styles.progressBarBackground}>
                        <View style={{width: Math.floor(levelResidual * 100) + '%', ...styles.progressBar}}></View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.panel}>
                    <Text style={styles.panelHeader}>Streak</Text>
                    <View style={styles.streakPanelSubcontainer}>
                        <Image
                                source={require('../../assets/streak-rocket.png')}
                                style={styles.streakPanelImage}
                            />
                        <View style={styles.panelStreakNumber}>
                            <Text style={{
                                fontSize: userStreak.toString().length === 1 ? 90 : userStreak.toString().length === 2 ? 70 : 60
                                , ...styles.panelStreakNumberText
                                }}>{userStreak}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {data.map((item, index) => {
                    return (
                    <TouchableOpacity
                        style={styles.panel}
                        onPress={() => navigation.navigate(item.navigateTo)}
                        >
                        <Text style={styles.panelHeader}>{item.text}</Text>
                        <Image
                            source={item.image}
                            style={styles.panelImage}
                        />
                        <Text style={styles.panelSubText}>{item.subText}</Text>
                    </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    )
 }

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginHorizontal: 0,
        marginTop: 50,
        flex: 1
    },
    topContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginBottom: 10
    },
    flagImage: {
        height: 35,
        width: 50,
        borderRadius: 5
    },
    header: {
        textTransform: 'capitalize',
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        marginBottom: 'auto',
        marginTop: 'auto',
        marginLeft: 10
    },
    panelContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    panel: {
        backgroundColor: constants.SECONDARYCOLOR,
        width: '46%',
        margin: '2%',
        borderRadius: 10
    },
    panelHeader: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.BLACK,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },
    panelLevelNumber: {
        width: 120,
        height: 120,
        marginTop: -15,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 5,
    },
    panelLevelNumberText: {
        fontSize: 90,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.PRIMARYCOLOR,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    progressBarBackground: {
        height: 15,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: constants.PRIMARYCOLOR,
        borderRadius: 10,
        overflow: 'hidden'
    },
    progressBar: {
        height: 10,
        backgroundColor: constants.PRIMARYCOLOR
    },
    streakPanelSubcontainer: {
        flexDirection: 'row',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    streakPanelImage: {
        width: 60,
        height: 60,
        padding: 5,
        marginTop: 25,
        marginBottom: 'auto',
        marginRight: 10
    },
    panelStreakNumber: {
        marginTop: 25,
        marginLeft: -20
    },
    panelStreakNumberText: {
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.ORANGE,
    },
    panelImage: {
        width: 120,
        height: 120,
        padding: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
        overflow: 'hidden'
    },
    panelSubText: {
        fontFamily: constants.FONTFAMILY,
        fontSize: constants.H3FONTSIZE,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 5,
        marginTop: -15,
        marginBottom: 5
    }
});