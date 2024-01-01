import { View, SafeAreaView, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useContext } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import UserContext from '../../contexts/UserContext';
import * as constants from '../../constants';
import { LineChart } from "react-native-chart-kit";
import NavBar from "../../components/NavBar";

export default function ProgressScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser, knownLanguages, currentLanguage } = useContext(UserContext);

    const [activeTab, setActiveTab] = useState<'90 Days' | '30 Days' | '7 Days'>('7 Days');

    let labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    let numDataPoints = 7;

    let data = [5, 14, 2, 35, 52, 29, 31];

    return (
    <SafeAreaView style={styles.container}>
        <NavBar title="Progress" navigation={navigation} />
        <View style={styles.subContainer}>
            <View style={styles.titleBar}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {setActiveTab('90 Days')}}
                    style={{backgroundColor: activeTab === '90 Days' ? constants.PRIMARYCOLOR : constants.TERTIARYCOLOR, ...styles.titleTab}}
                >
                    <Text style={{color: activeTab === '90 Days' ? constants.TERTIARYCOLOR : constants.PRIMARYCOLOR, ...styles.titleText}}>90 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {setActiveTab('30 Days')}}
                    style={{backgroundColor: activeTab === '30 Days' ? constants.PRIMARYCOLOR : constants.TERTIARYCOLOR, ...styles.titleTab}}
                >
                    <Text style={{color: activeTab === '30 Days' ? constants.TERTIARYCOLOR : constants.PRIMARYCOLOR, ...styles.titleText}}>30 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {setActiveTab('7 Days')}}
                    style={{backgroundColor: activeTab === '7 Days' ? constants.PRIMARYCOLOR : constants.TERTIARYCOLOR, ...styles.titleTab}}
                >
                    <Text style={{color: activeTab === '7 Days' ? constants.TERTIARYCOLOR : constants.PRIMARYCOLOR, ...styles.titleText}}>7 Days</Text>
                </TouchableOpacity>
            </View>
            {/*<View style={styles.contentTabContainer}>
                {activeTab === 'followers' && <FollowScreen type={'followers'} />}
                {activeTab === 'following' && <FollowScreen type={'following'} />}
            </View>
            */}
            <View style={styles.wordsLearnedPanel}>
                <Text style={styles.wordsLearnedTitle}>Previous Week</Text>
                <LineChart
                    data={{
                        labels: labels,
                        datasets: [{ data: data }]}}
                        width={Dimensions.get("window").width - 60} // from react-native
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
        </View>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 16
    },
    subContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        height: 'auto',
        marginTop: 10,
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
        width: '33.33%',
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
    },
});