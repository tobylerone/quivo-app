import { View, Text, Dimensions, StyleSheet, ActivityIndicator } from "react-native";
import { useContext } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { LineChart } from "react-native-chart-kit";
// Contexts
import UserContext from '../../../contexts/UserContext';
// Utils
import { frequencyIndexToComprehensionPercentage as f } from "../../../utils/functions";
// Constants
import * as constants from '../../../constants';
// Components
import NavBar from "../../../components/NavBar";
// Hooks
import { useFetchWordCounts } from "../hooks/useFetchWordCounts";
import { useComprehensionPercentage } from "../hooks/useComprehensionPercentage";

interface ILanguage {
    id: number,
    language_code: string,
    language_name: string
}

export default function ComprehensionPercPanel({navigation}: NativeStackHeaderProps) {

    const { currentUser, currentLanguageCode, knownLanguages, knownWords} = useContext(UserContext);
    
    //let labels = [0, 5000];
    let numDataPoints = 101;
    let step = 100;
    
    let currentLanguageObj = knownLanguages.find(
        (lang: ILanguage) => lang.language_code === currentLanguageCode
        )

    const wordCounts = useFetchWordCounts(currentUser);
    const comprehensionPercentage = useComprehensionPercentage(wordCounts, currentLanguageObj.coeffs);
    
    // Short-term solution
    let labels: string[] = Array.from({length: numDataPoints}, (_, i) => {
        i = i * step;
        if (i === 0 || i === 2500 || i === 5000 || i === 7500 || i === 10000) {
            return `${i}`;
        } else {
            return '';
        }
    });

    let data = Array.from(
        {length: numDataPoints},
        (_, i) => f(i * step, currentLanguageObj.coeffs)
    );

    function findIndex(array: number[], value: number) {
        // Given an array of increasing numbers, use binary search
        // to find appropriate index to insert new number
        let low = 0, high = array.length;
        while (low < high) {
            let mid = Math.floor((low + high) / 2);
            if (array[mid] < value) low = mid + 1;
            else high = mid;
        }
        return low;
    }

    const getHiddenIndexes = () => {
        let indexToInsert = findIndex(data, comprehensionPercentage);

        // Add the comprehensionPercentage to the data array at the appropriate index
        data.splice(indexToInsert, 0, comprehensionPercentage);
    
        // Hide all indexes except for indexToInsert
        let hiddenIndexes = Array.from(
            {length: numDataPoints + 1},
            (_, i) => i
            ).filter(i => i !== indexToInsert);

        return hiddenIndexes;
    }

    return (
        <View style={styles.wordsLearnedPanel}>
            <View style={styles.wordsLearnedTitle}>
            <Text style={styles.wordsLearnedTitleText}>Comprehension</Text>
            </View>
            {comprehensionPercentage ? <>
            <View style={styles.chartContainer}>
                <LineChart
                    data={{
                        labels: ['10000'],
                        datasets: [{ data: data }]
                    }}
                    width={Dimensions.get("window").width - 65} // from react-native
                    height={200}
                    yAxisSuffix="%"
                    yAxisInterval={25}
                    chartConfig={{
                        backgroundColor: constants.LIGHTBLUE,
                        backgroundGradientFrom: constants.LIGHTBLUE,
                        backgroundGradientTo: constants.LIGHTBLUE,
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 10
                        },
                        propsForDots: {
                            r: "8"
                        },
                    }}
                    hidePointsAtIndex={getHiddenIndexes()}
                    bezier
                    style={{
                        borderRadius: 10,
                    }}
                />
            </View>
            <Text style={styles.wordsLearnedInfo}>
                Based on the words you know, you should be able to understand around <Text style={{
                    fontFamily: constants.FONTFAMILYBOLD,
                    color: constants.ORANGE
                    }}>
                        {comprehensionPercentage}%
                </Text> of written {currentLanguageObj.language_name}.
            </Text>
            </>
            : <ActivityIndicator style={styles.activityIndicator} size="large" color={constants.LIGHTBLUE} />}
        </View>
    );
}

const styles = StyleSheet.create({
    wordsLearnedPanel: {
        backgroundColor: constants.TERTIARYCOLOR,
        borderWidth: 3,
        borderColor: constants.LIGHTBLUE,
        padding: 10,
        overflow: 'hidden',
        borderRadius: 20,
        marginBottom: 20
    },
    wordsLearnedTitle: {
        backgroundColor: constants.LIGHTBLUE,
        marginBottom: 10,
        marginTop: -10,
        marginHorizontal: -10
    },
    wordsLearnedTitleText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 10
    },
    chartContainer: {
        backgroundColor: constants.TERTIARYCOLOR,
        paddingRight: 20
    },
    wordsLearnedInfo: {
        fontSize: constants.H3FONTSIZE,
        fontFamily: constants.FONTFAMILY,
        marginTop: 10
    },
    activityIndicator: {
        marginTop: 20
    }
});
