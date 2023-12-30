import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
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

    const data = [
        {
            text: 'Words Learned',
            subText: '243 / 30129',
            image: require('../../assets/words_learned.png')
        },
        {
            text: 'Progress',
            subText: '+49 words this week',
            image: require('../../assets/progress.png')
        },
        {
            text: 'Achievements',
            subText: '2 / 56',
            image: require('../../assets/achievements.png')
        },
        {
            text: 'Leaderboard',
            subText: '6th this week',
            image: require('../../assets/leaderboard.png')
        },
    ];

        return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Your {currentLanguageName} Progress</Text>
            {/*<WordsLearnedPanel currentLanguageName={currentLanguageName} />
            <DailyProgressPanel />*/}
            <View style={styles.panelContainer}>
                <TouchableOpacity style={styles.panel}>
                    <Text style={styles.panelHeader}>Level</Text>
                    <View style={styles.panelLevelNumber}>
                        <Text style={styles.panelLevelNumberText}>3</Text>
                    </View>
                    <View style={styles.progressBarBackground}>
                        <View style={styles.progressBar}></View>
                    </View>
                </TouchableOpacity>
                {data.map((item, index) => {
                    return (
                    <TouchableOpacity style={styles.panel}>
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
    header: {
        textTransform: 'capitalize',
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        marginBottom: 20,
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
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },
    panelLevelNumber: {
        width: 120,
        height: 120,
        marginTop: -10,
        marginBottom: 5,
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
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    progressBarBackground: {
        height: 10,
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 2,
        borderColor: constants.BLACK,
        borderRadius: 10,
        overflow: 'hidden'
    },
    progressBar: {
        width: '70%',
        height: 10,
        backgroundColor: constants.PRIMARYCOLOR
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