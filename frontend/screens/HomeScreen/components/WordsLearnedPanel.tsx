import { View, Text, Dimensions, StyleSheet } from "react-native";
import { useContext } from "react";
import UserContext from '../../../contexts/UserContext';
import * as constants from '../../../constants';
import { LineChart } from "react-native-chart-kit";

interface IWordsLearnedPanel {
    currentLanguageName: string
}

export default function WordsLearnedPanel({currentLanguageName}: IWordsLearnedPanel) {

    const { currentUser, knownLanguages, currentLanguage } = useContext(UserContext);

    const getComprehensionPercentage = (known_words: number) => {
        /* Returns the percentage of text a user should understand based on the number of words
        they know. This will need to be found by fitting a curve to the cumulative word counts
        starting at the most frequent word and going to the least frequent. I don't have this yet
        but it should look something like the function returned here
        */
        return known_words == 0 ? 0 : Math.round(-100 + 200/(1 + Math.E**(-0.001 * known_words)));
    }

    // May make this a hook later
    const comprehensionPercentage = getComprehensionPercentage(
        currentUser.known_words_count[currentLanguage]
        );
    
    let labels = [0, 10000];
    let numDataPoints = 101;

    let data = Array.from(
        {length: numDataPoints},
        (_, i) => getComprehensionPercentage(i * 100)
    );

    // Get nearest value on graph to comprehensionPercentage. prev contains
    // the callback from the previous iteration (the closest value to num so far)
    function findNearest(num: number, arr: number[]) {
        return arr.reduce((prev, curr) => {
            return (Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev);
        });
    }

    const nearestDataPoint = findNearest(comprehensionPercentage, data);

    // Want to hide all points except index to keep (which is comprehensionPercentage)
    let hiddenIndexes = Array.from(
        {length: numDataPoints},
        (_, i) => i
        ).filter(i => getComprehensionPercentage(i * 100) != nearestDataPoint);

    return (
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
    );
}

const styles = StyleSheet.create({
    wordsLearnedPanel: {
        backgroundColor: constants.SECONDARYCOLOR,
        padding: 10,
        borderRadius: 10,
        marginBottom: 20
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
