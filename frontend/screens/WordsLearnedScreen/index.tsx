import { View, Text, Dimensions, StyleSheet, ActivityIndicator } from "react-native";
import { useContext } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { LineChart } from "react-native-chart-kit";
// Contexts
import UserContext from '../../contexts/UserContext';
// Utils
import { frequencyIndexToComprehensionPercentage as f } from "../../utils/functions";
// Constants
import * as constants from '../../constants';
// Components
import NavBar from "../../components/NavBar";
// Hooks
import { useFetchWordCounts } from "./hooks/useFetchWordCounts";
import { useComprehensionPercentage } from "./hooks/useComprehensionPercentage";

interface ILanguage {
    id: number,
    language_code: string,
    language_name: string
}

export default function WordsLearnedScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser, currentLanguageCode, knownLanguages, knownWords} = useContext(UserContext);

    const wordCounts = useFetchWordCounts(currentUser);
    const comprehensionPercentage = useComprehensionPercentage(wordCounts);

    //let labels = [0, 5000];
    let numDataPoints = 101;
    let step = 100;
    
    let currentLanguageName: string = knownLanguages.find(
        (lang: ILanguage) => lang.language_code === currentLanguageCode
        ).language_name;
    
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
        (_, i) => f(i * step)
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
    <View style={styles.container}>
        <NavBar title='Known Words' navigation={navigation} />
        {comprehensionPercentage ?
        <View style={styles.wordsLearnedPanel}>
            <Text style={styles.wordsLearnedTitle}>
                {knownWords} Words Learned
            </Text>
            <LineChart
                data={{
                    labels: ['10000'],
                    datasets: [{ data: data }]
                }}
                width={Dimensions.get("window").width - 60} // from react-native
                height={200}
                yAxisSuffix="%"
                yAxisInterval={25}
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
                        r: "8"
                    },
                }}
                hidePointsAtIndex={getHiddenIndexes()}
                bezier
                style={{
                    borderRadius: 10,
                }}
            />
            <Text style={styles.wordsLearnedInfo}>
                Based on the words you know, you should be able to understand around <Text style={{
                    fontFamily: constants.FONTFAMILYBOLD,
                    color: constants.PRIMARYCOLOR
                    }}>
                        {comprehensionPercentage}%
                </Text> of written {currentLanguageName}.
            </Text>
        </View>
        : <ActivityIndicator style={styles.activityIndicator} size="large" color={constants.PRIMARYCOLOR} />}
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 16
    },
    wordsLearnedPanel: {
        backgroundColor: constants.TERTIARYCOLOR,
        borderWidth: 3,
        borderColor: constants.PRIMARYCOLOR,
        padding: 10,
        borderRadius: 20,
        marginBottom: 20
    },
    wordsLearnedTitle: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.PRIMARYCOLOR,
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
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
