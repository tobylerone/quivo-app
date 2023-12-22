import { View, SafeAreaView, Text, StyleSheet, Dimensions } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import UserContext from '../contexts/UserContext';
import * as constants from '../constants';
import { LineChart } from "react-native-chart-kit";

export default function HomeScreen({navigation}: NativeStackHeaderProps) {

    interface ILanguage {
        id: number,
        language_code: string,
        language_name: string
    }
    
    const getComprehensionPercentage = (known_words: number) => {
        /* Returns the percentage of text a user should understand based on the number of words
        they know. This will need to be found by fitting a curve to the cumulative word counts
        starting at the most frequent word and going to the least frequent. I don't have this yet
        but it should look something like the function returned here
        */
        
        return known_words == 0 ? 0 : Math.round(-100 + 200/(1 + Math.E**(-0.001 * known_words)));
    }
    
    //Not sure if you can import hook setters like this but it didn't seem to work
    const { currentUser, knownLanguages, currentLanguage } = useContext(UserContext);

    // May make this a hook later
    const comprehensionPercentage = getComprehensionPercentage(
        currentUser.known_words_count[currentLanguage]
        );

    let currentLanguageName = knownLanguages.find(
        (lang: ILanguage) => lang.language_code === currentLanguage
        ).language_name;

    let labels = [0, 10000];
    let numDataPoints = 101;

    let data = Array.from(
        {length: numDataPoints},
        (_, i) => getComprehensionPercentage(i * 100)
    );

    // Want to hide all points except index to keep (which is comprehensionPercentage)
    let hiddenIndexes = Array.from(
        {length: numDataPoints},
        (_, i) => i
        ).filter(i => i !== comprehensionPercentage);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Your {currentLanguageName} Progress</Text>
            <View style={styles.wordsLearnedPanel}>
                <Text style={styles.wordsLearnedTitle}>
                    {currentUser.known_words_count[currentLanguage]} Words Learned
                </Text>
                <LineChart
                    data={{
                        labels: labels,
                        datasets: [{ data: data }]}}
                        width={Dimensions.get("window").width - 80} // from react-native
                        height={200}
                        yAxisSuffix="%"
                        yAxisInterval={25} // optional, defaults to 1
                        chartConfig={{
                        backgroundColor: constants.PRIMARYCOLOR,//"#e26a00",
                        backgroundGradientFrom: constants.PRIMARYCOLOR,//"#fb8c00",
                        backgroundGradientTo: constants.PRIMARYCOLOR,//"#ffa726",
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 10
                        },
                        propsForDots: {
                            r: "5"
                        },
                    }}
                    hidePointsAtIndex={hiddenIndexes}
                    bezier
                        style={{
                        borderRadius: 10,
                        }}
                />
                <Text style={styles.wordsLearnedInfo}>
                    This means you should be able to understand <Text style={{
                        fontFamily: constants.FONTFAMILYBOLD,
                        color: constants.PRIMARYCOLOR
                        }}>
                            {comprehensionPercentage}%
                    </Text> of written {currentLanguageName}.
                </Text>
            </View>
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
    },
    wordsLearnedPanel: {
        backgroundColor: constants.SECONDARYCOLOR,
        padding: 10,
        borderRadius: 10
    },
    wordsLearnedTitle: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    wordsLearnedInfo: {
        fontSize: constants.H3FONTSIZE,
        fontFamily: constants.FONTFAMILY,
        marginTop: 10
    }
});