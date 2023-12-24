import { View, Text, Dimensions, StyleSheet } from "react-native";
import { useContext } from "react";
import UserContext from '../../../contexts/UserContext';
import * as constants from '../../../constants';
import { LineChart } from "react-native-chart-kit";

export default function DailyProgressPanel() {

    const { currentUser, knownLanguages, currentLanguage } = useContext(UserContext);

    let labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    let numDataPoints = 7;

    let data = [5, 14, 2, 35, 52, 29, 31];

    return (
    <View style={styles.wordsLearnedPanel}>
        <Text style={styles.wordsLearnedTitle}>Daily Progress</Text>
        <LineChart
            data={{
                labels: labels,
                datasets: [{ data: data }]}}
                width={Dimensions.get("window").width - 80} // from react-native
                height={200}
                //yAxisSuffix="%"
                //yAxisInterval={25} // optional, defaults to 1
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
            bezier
                style={{
                borderRadius: 10,
                }}
        />
    </View>
    );
}

const styles = StyleSheet.create({
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
