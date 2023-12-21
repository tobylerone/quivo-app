import { View, SafeAreaView, Text, StyleSheet, Dimensions } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import UserContext from '../contexts/UserContext';
import * as constants from '../constants';
import { useWorkouts } from "../hooks/useWorkouts";
import { LineChart } from "react-native-chart-kit";

export default function HomeScreen({navigation}: NativeStackHeaderProps) {

    const getComprehensionPercentage = (known_words: number) => {
        /* Returns the percentage of text a user should understand based
        on the number of words they know. This will need to be found
        by fitting a curve to the cumulative word counts starting at
        the most frequent word and going to the least frequent. I
        don't have this yet but it should look something like the
        function returned here */
        
        return known_words == 0 ? 0 : Math.round(-100 + 200/(1 + Math.E**(-0.001 * known_words)));
    }
    
    //Not sure if you can import hook setters like this but it didn't seem to work
    const { currentUser, currentLanguage } = useContext(UserContext);

    //let labels = Array.from({ length: 10 }, (_, i) => i * 1000);
    let labels = [0, 10000];
    //labels = labels.map((label, index) => index % 10 === 0 ? label : '');

    let data = Array.from({ length: 101 }, (_, i) => getComprehensionPercentage(i * 100));

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>{currentUser.username} Stats</Text>
            <View style={styles.wordsLearnedPanel}>
                <Text style={styles.wordsLearnedTitle}>{ currentUser.known_words_count[currentLanguage] } Words Learned</Text>
                <LineChart
                    data={{
                    labels: labels,
                    datasets: [{ data: data }]}}
                    width={Dimensions.get("window").width - 80} // from react-native
                    height={200}
                    //yAxisLabel="$"
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
                        r: "0",
                        strokeWidth: "2",
                        stroke: constants.TERTIARYCOLOR//"#ffa726"
                    }
                    }}
                    bezier
                    style={{
                    //marginVertical: 8,
                    borderRadius: 10
                    }}
                />
                <Text style={styles.wordsLearnedInfo}>This means you should be able to understand <Text style={{fontFamily: constants.FONTFAMILYBOLD, color: constants.PRIMARYCOLOR}}>{getComprehensionPercentage(currentUser.known_words_count[currentLanguage])}%</Text> of written text.</Text>
            </View>
        </SafeAreaView>
    )
 }

        const styles = StyleSheet.create({
            container: {
                padding: 10,
                margin:20,
                flex: 1
            },
            header: {
                textTransform: 'capitalize',
                fontSize: 20,
                marginTop: 20,
                marginBottom: 20,
                fontWeight: "bold",
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
})