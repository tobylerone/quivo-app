import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, StatusBar } from "react-native"
import { useEffect, useState, useContext } from "react"
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { FontAwesome } from "@expo/vector-icons"
import UserContext from '../contexts/UserContext';
import * as constants from "../constants";
import client from "../utils/axios";

const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
    }

const ProgressBarButton = ({label, currentValue, maxValue, defaultActive}) => {

    const [borderColor, setBorderColor] = useState(defaultActive ? constants.BLACK: constants.SECONDARYCOLOR);

    const progressPercentage = Math.floor((currentValue / maxValue) * 100)
    
    const handlePress = () => {

        // TODO: Fix this because it's stupid
        setBorderColor(borderColor == constants.SECONDARYCOLOR ? constants.BLACK: constants.SECONDARYCOLOR)
    };
    
    return (
        <TouchableOpacity
            style={{
                ...styles.progressBarButton,
                borderColor: borderColor
            }}
            onPress={handlePress}
            >
            <View style={{width: progressPercentage + '%', ...styles.progressBar}}></View>
            <View style={styles.progressBarButtonTextContainer}>
                <Text style={styles.progressBarButtonText}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
};

const WordItem = ({ item }) => {

    const selectedStyling = {
        'backgroundColor': constants.PRIMARYCOLOR,
        'color': constants.TERTIARYCOLOR,
        'numberBox': {
            'backgroundColor': constants.TERTIARYCOLOR,
            'color': constants.BLACK
        }
    }

    const unselectedStyling = {
        'backgroundColor': constants.SECONDARYCOLOR,
        'color': constants.BLACK,
        'numberBox': {
            'backgroundColor': constants.PRIMARYCOLOR,
            'color': constants.TERTIARYCOLOR
        }
    }
    
    const [styling, setStyling] = useState(item.user_knows ? selectedStyling: unselectedStyling);

    return (
        <View style={{
            backgroundColor: styling.backgroundColor,
            ...styles.wordItem
            }}>
            <View style={{
                backgroundColor: styling.numberBox.backgroundColor,
                ...styles.numberContainer
                }}>
                <Text style={{color: styling.numberBox.color, ...styles.numberText}}>{item.id}</Text>
            </View>
            <View style={styles.word}>
                <Text style={{
                    color: styling.color,
                    ...styles.wordText
                    }}>
                    {capitalizeFirstLetter(item.word)}
                </Text>
            </View>
        </View>
    );
};

export default function WordListScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser } = useContext(UserContext);
    
    const [words, setWords] = useState([]);
    const [wordCounts, setWordCounts] = useState([]);

    useEffect(() => {
        fetchWordCounts();
        fetchWordsData();
    }, []);

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

    const fetchWordsData = async() => {
        try {
            const res = await client.post('./api/words', {
                start_index: 0,
                end_index: 100,
                withCredentials: true
            });

            // Don't need the word keys, just an array of each word's data
            let valuesArray = Object.values(res.data);
            setWords(valuesArray);
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topButtonContainer}>
                <ProgressBarButton 
                    label={'0-1k (' + wordCounts['1-1000'] + ')' }
                    currentValue={wordCounts['1-1000']}
                    maxValue={1000}
                    defaultActive={true}
                />
                <ProgressBarButton 
                    label={'1k-2k (' + wordCounts['1001-2000'] + ')' }
                    currentValue={wordCounts['1001-2000']}
                    maxValue={1000}
                    defaultActive={false}
                />
                <ProgressBarButton 
                    label={'2k-3k (' + wordCounts['2001-3000'] + ')' }
                    currentValue={wordCounts['2001-3000']}
                    maxValue={1000}
                    defaultActive={false}
                />
                <ProgressBarButton 
                    label={'3k-4k (' + wordCounts['3001-4000'] + ')' }
                    currentValue={wordCounts['3001-4000']}
                    maxValue={1000}
                    defaultActive={false}
                />
                <ProgressBarButton 
                    label={'4k-5k (' + wordCounts['4001-5000'] + ')' }
                    currentValue={wordCounts['4001-5000']}
                    maxValue={1000}
                    defaultActive={false}
                />
                <ProgressBarButton 
                    label={'5k+ (' + wordCounts['5000+'] + ')' }
                    currentValue={wordCounts['5000+']}
                    maxValue={1000}
                    defaultActive={false}
                />
            </View>
            <FlatList
                style={styles.wordList}
                data={words}
                bounces={false}
                //keyExtractor={(item) => item.username}
                renderItem={({ item }) => (<WordItem item={item}></WordItem>)}
                />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    
    // WordListScreen
    container: {
        flex: 1,
        //paddingTop: StatusBar.currentHeight,
        marginHorizontal: 10,
    },
    topButtonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    wordList: {
        height: "100%",
        marginTop: 10,
        marginHorizontal: 10
    },

    // WordItem
    wordItem: {
        flexDirection: "row",
        //justifyContent: 'space-between',
        borderRadius: 10,
        //borderRadius: 5,
        marginBottom: 5,
        padding: 10
    },
    numberContainer: {
        borderRadius: 5,
        padding: 5,
        marginRight: 10
    },
    numberText: {
        fontWeight: 'bold',
        fontSize: constants.H3FONTSIZE
    },
    word: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    wordText: {
        fontSize: constants.H2FONTSIZE
    },

    // ProgressBarButton
    progressBarButton: {
        width: '30%',
        backgroundColor: constants.SECONDARYCOLOR,
        borderWidth: 2,
        borderRadius: 10,
        overflow: 'hidden',
        verticalAlign: 'center',
        marginHorizontal: 5,
        marginBottom: 5,
        height: 40
    },
    progressBarButtonTextContainer: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 5
    },
    progressBarButtonText: {
        fontSize: constants.H2FONTSIZE,
        fontWeight: 'bold'
    },
    progressBar: {
        position: 'absolute',
        //top: -2,
        //left: -2,
        height: 40,
        //borderRadius: 10,
        backgroundColor: constants.PRIMARYCOLOR,
        borderColor: constants.PRIMARYCOLOR
    }
});