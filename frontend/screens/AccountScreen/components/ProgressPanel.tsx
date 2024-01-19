import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useContext } from "react";
import UserContext from '../../../contexts/UserContext';
import * as constants from '../../../constants';
import { LineChart } from "react-native-chart-kit";

export default function ProgressPanel() {

    const { currentUser, knownLanguages, currentLanguage, monthlyWordCounts } = useContext(UserContext);

    const wordCounts = monthlyWordCounts.map(item => item.word_count);
    const dayLabels = monthlyWordCounts.map(item => {
        let parts = item.day.split('-');
        return parts[parts.length - 1];
    });
    
    const dataMap: Record<string, number[]> = {
        '7 Days': wordCounts.slice(-7),
        '30 Days': wordCounts,
    }

    const labelsMap: Record<string, string[]> = {
        '7 Days': dayLabels.slice(-7),
        '30 Days': []//dayLabels
    }

    const wordsThisWeek = monthlyWordCounts.map(item => item.word_count).slice(-7).reduce((a, b) => a + b, 0);
    const wordsThisMonth = monthlyWordCounts.map(item => item.word_count).reduce((a, b) => a + b, 0);

    const [activeTab, setActiveTab] = useState<string>('7 Days');
    const [data, setData] = useState<number[]>(wordCounts.slice(-7));
    const [labels, setLabels] = useState<string[]>(dayLabels.slice(-7));

    const TABS = ['30 Days', '7 Days'];

    const renderTabButton = (tabTitle: string) => (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                setActiveTab(tabTitle);
                setData(dataMap[tabTitle]);
                setLabels(labelsMap[tabTitle]);
            }}
            style={{backgroundColor: activeTab === tabTitle ? constants.PRIMARYCOLOR : constants.TERTIARYCOLOR, ...styles.titleTab}}
        >
            <Text style={{color: activeTab === tabTitle ? constants.TERTIARYCOLOR : constants.PRIMARYCOLOR, ...styles.titleText}}>{tabTitle}</Text>
        </TouchableOpacity>
        );

    return (
    <View style={styles.container}>
        <View style={styles.titleBar}>
            {TABS.map(tabTitle => renderTabButton(tabTitle))}
        </View>
        <View style={styles.wordsLearnedPanel}>
            {data && labels && <>
            <LineChart
                //key={data.toString()}
                data={{
                    labels: labels,
                    datasets: [{ data: data }]}}
                    width={Dimensions.get("window").width - 65} // from react-native
                    height={200}
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
            <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                    <View style={styles.tableColumn}>
                        <Text style={styles.columnOneText}>New words</Text>
                    </View>
                    <View style={styles.tableColumn}>
                        <Text style={styles.columnTwoText}>{activeTab === '7 Days' ? wordsThisWeek : wordsThisMonth} </Text>
                    </View>
                </View>
                <View style={styles.tableRow}>
                    <View style={styles.tableColumn}>
                        <Text style={styles.columnOneText}>Avg. per day</Text>
                    </View>
                    <View style={styles.tableColumn}>
                        <Text style={styles.columnTwoText}>{Math.round(activeTab === '7 Days' ? (wordsThisWeek / 7) : (wordsThisMonth / 30))}</Text>
                    </View>
                </View>
            </View>
            </>}
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        height: 'auto',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: constants.PRIMARYCOLOR
    },
    titleBar: {
        flexDirection: 'row',
        backgroundColor: constants.PRIMARYCOLOR,
        marginBottomColor: constants.PRIMARYCOLOR
    },
    titleTab: {
        padding: 10,
        borderColor: constants.PRIMARYCOLOR,
        borderBottomWidth: 3,
        //borderRightWidth: 3,
        width: '50%',
    },
    titleText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        textAlign: 'center'
    },
    contentTabContainer: {
        padding: 10
    },
    wordsLearnedPanel: {
        backgroundColor: constants.TERTIARYCOLOR,
        padding: 10
    },
    tableContainer: {
        marginTop: 10,
        height: 80,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: constants.PRIMARYCOLOR,
        overflow: 'hidden'
    },
    tableRow: {
        flexDirection: 'row',
        height: 40,
        borderBottomWidth: 2,
        borderBottomColor: constants.PRIMARYCOLOR
    },
    tableColumn: {
        width: '50%',
        marginHorizontal: 1,
        paddingVertical: 8,
        borderRightWidth: 2,
        borderRightColor: constants.PRIMARYCOLOR
    },
    columnOneText: {
        fontSize: constants.H3FONTSIZE,
        fontFamily: constants.FONTFAMILY,
        color: constants.BLACK,
        //marginLeft: 'auto',
        marginLeft: 10,
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
        //marginTop: 5    
    },
    columnTwoText: {
        fontSize: constants.H3FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.PRIMARYCOLOR,
        marginLeft: 'auto',
        marginRight: 10,
        //marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    infoText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILY,
        margin: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});