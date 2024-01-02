import { View, Text, Dimensions, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect, useContext } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import UserContext from '../../contexts/UserContext';
import client from "../../utils/axios";
import * as constants from '../../constants';
import { LineChart } from "react-native-chart-kit";
import NavBar from "../../components/NavBar";

interface ILanguage {
    id: number,
    language_code: string,
    language_name: string
}

export default function WordsLearnedScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser, knownLanguages, currentLanguage } = useContext(UserContext);

    const [wordCounts, setWordCounts] = useState({});
    const [comprehensionPercentage, setComprehensionPercentage] = useState<number| null>(null);

    let currentLanguageName: string = knownLanguages.find(
        (lang: ILanguage) => lang.language_code === currentLanguage
        ).language_name;
    
    useEffect(() => {
        fetchWordCounts();
    }, []);

    useEffect(() => {
        setComprehensionPercentage(
            getComprehensionPercentage(wordCounts)
            );
    }, [wordCounts]);

    // NOTE: Used in a few places. Should move centrally
    const fetchWordCounts = async() => {
        try {
            const res = await client.get(
                './api/users/' + currentUser.user_id + '/wordcounts',
                { withCredentials: true }
                );
            setWordCounts(res.data);
        } catch (error) {
            console.error(error);
        }
    };
    
    const f = (n: number) => {
        // Models the word frequency distribution normalised to between 0-100
        return n == 0 ? 0 : Math.round(-83.32317585 + 191.39405783 / (1 + Math.E**(-0.39771826 * n**0.20018198)));
    }

    const getComprehensionPercentage = (wordCounts: Record<string, number>) => {
        /*
        All words in the corpus are listed in descending order of total appearance, and
        normalised to between 0-100 to model the percentage of the corpus a user should
        be able to understand with each additional new word learned, assuming the words
        were learned from most frequent to least frequent, which is then modelled by 
        a + b/(1 + e**(c * n)), where n represents the frequency rank of a word in the
        corpus, and a, b and c are constants that are determined for a given corpus to
        model its word frequency distribution.
        If the user learned the words of the corpus in perfect frequency order you could
        work out their percentage comprehension by taking n to be the total number of
        words they've learned so far, but since they'll learn new words in an unpredictable
        order, their total comprehension can be found by summing each word's individual
        contribution to overall corpus comprehension. For example, if the user knows the
        nth most frequent word in the corpus, the additional percentage comprehension gained
        by learning that word will be f(n) - f(n-1). By summing this value for all words
        that the user knows, you can calculate the percentage of the corpus they should be
        capable of understanding.

        However, this is computationally expensive, so instead I've counted the number of
        words a user knows in each section of 1000 words in descending order of frequency:
        1-1000, 1001-2000, ... 5000+ most frequent etc. I then make the assumption that the
        user learned the words in this 'bucket' in correct frequency order to arrive at an
        estimate of the overall comprehension percentage that will still heavily discount
        the least frequent words.
        */

        let result = 0;

        for (let i = 1; i <= 4001; i += 1000) {
            result += f(i + wordCounts[`${i}-${i+999}`]) - f(i);
        }
        result += f(5001 + wordCounts['5000+']) - f(5001)

        return result;
    }
    
    //let labels = [0, 5000];
    let numDataPoints = 101;
    let step = 100;
    
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
                {currentUser.known_words_count[currentLanguage]} Words Learned
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
