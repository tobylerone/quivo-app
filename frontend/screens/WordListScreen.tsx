import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    FlatList
} from "react-native";
import { useEffect, useState, useContext, useRef } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import UserContext from "../contexts/UserContext";
import * as constants from "../constants";
import client from "../utils/axios";
import { capitalizeFirstLetter } from "../utils/text";

interface IProgressBarButton {
    label: string,
    currentValue: number,
    maxValue: number,
    defaultActive: boolean
}

const ProgressBarButton = ({label, currentValue, maxValue, defaultActive}: IProgressBarButton) => {

    const progressPercentage = Math.floor((currentValue / maxValue) * 100);

    const [borderColor, setBorderColor] = useState(defaultActive ? constants.BLACK: constants.SECONDARYCOLOR);
    
    const handlePress = () => {

        // TODO: Fix this because it's stupid
        setBorderColor(borderColor == constants.SECONDARYCOLOR ? constants.BLACK: constants.SECONDARYCOLOR);
    };
    
    return (
        <TouchableOpacity
            activeOpacity={1}
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
            <View style={styles.progressBarButtonNumberContainer}>
                <Text style={styles.progressBarButtonNumberText}>{currentValue}</Text>
            </View>
        </TouchableOpacity>
    );
};

// TODO: Move this to interface folder and import
interface IWordItem {
    id: number,
    rank: number,
    word: string,
    frequency: number,
    user_knows: boolean
}

interface IWordItem {
    word: string,
    item: IWordItem,
}

const WordItem = ({word, item}: IWordItem) => {

    const { currentUser, currentLanguage } = useContext(UserContext);

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
    
    const [userKnows, setUserKnows] = useState(item.user_knows);
    const [styling, setStyling] = useState(item.user_knows ? selectedStyling : unselectedStyling);
    const [lastPress, setLastPress] = useState(0);
    const [wordTranslationVisible, setWordTranslationVisible] = useState(false);
    const [pressedOnce, _setPressedOnce] = useState(false);

    // This is super messy but it's the only way I could find to achieve this behaviour
    const pressedOnceRef = useRef(pressedOnce);

    useEffect(() => {
        // Update styling
        setStyling(userKnows ? selectedStyling : unselectedStyling);
    }, [userKnows]);
    
    const setPressedOnce = (value: boolean) => {
        pressedOnceRef.current = value;
        _setPressedOnce(value);
    };
    
    // setTimeout rend un identifiant numérique unique
    let tapDelayTimeout: TimeOut;
    let definitionDisplayTimeout: TimeOut;

    const handlePress = () => {

        const currentTime = new Date().getTime();

        // L'utilisateur a tapé deux fois
        if (currentTime - lastPress < constants.DOUBLETAPDELAY) {
            console.log('pressed twice');
            setUserKnows(!userKnows);
            client.post(
                'api/users/' + currentUser.user_id + '/toggleknownword/' + item.word
            ).then(function(res) {
            }).catch(function(e) {
                console.log(e.response.data)
            });

            setLastPress(0);
            setPressedOnce(false);
            setWordTranslationVisible(false);

            // Supprimer les timeOut q'on a initialisés lors de la première tape pour ne
            // plus afficher la traduction
            clearTimeout(tapDelayTimeout);
            clearTimeout(definitionDisplayTimeout);

        } else {
            setPressedOnce(true)
            console.log('pressed once');
        }

        setLastPress(currentTime);

    };
    
    return (
        <TouchableOpacity
            style={{
                backgroundColor: styling.backgroundColor,
                ...styles.wordItem
            }}
            activeOpacity={1}
            onPress={() => {handlePress()}}
            >
            <View style={{
                backgroundColor: styling.numberBox.backgroundColor,
                ...styles.numberContainer
                }}>
                <Text style={{color: styling.numberBox.color, ...styles.numberText}}>{Math.round(item.rank)}</Text>
            </View>
            <View style={styles.word}>
                <Text style={{
                    color: styling.color,
                    ...styles.wordText
                    }}>
                    {capitalizeFirstLetter(item.word)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default function WordListScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser } = useContext(UserContext);
    
    const [words, setWords] = useState([]);
    const [wordCounts, setWordCounts] = useState<Record<string, number>>({});
    const [showLoadMore, setShowLoadMore] = useState(false);

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
            <ScrollView
                style={styles.topButtonContainer}
                horizontal={true}
                bounces={false}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
                >
                <ProgressBarButton 
                    label={'0-1k'}
                    currentValue={wordCounts['1-1000']}
                    maxValue={1000}
                    defaultActive={true}
                />
                <ProgressBarButton 
                    label={'1k-2k' }
                    currentValue={wordCounts['1001-2000']}
                    maxValue={1000}
                    defaultActive={false}
                />
                <ProgressBarButton 
                    label={'2k-3k' }
                    currentValue={wordCounts['2001-3000']}
                    maxValue={1000}
                    defaultActive={false}
                />
                <ProgressBarButton 
                    label={'3k-4k' }
                    currentValue={wordCounts['3001-4000']}
                    maxValue={1000}
                    defaultActive={false}
                />
                <ProgressBarButton 
                    label={'4k-5k' }
                    currentValue={wordCounts['4001-5000']}
                    maxValue={1000}
                    defaultActive={false}
                />
                <ProgressBarButton 
                    label={'5k+' }
                    currentValue={wordCounts['5000+']}
                    maxValue={1000}
                    defaultActive={false}
                />
            </ScrollView>
            <View style={styles.headerContainer}>
                <Text style={styles.headerContainerText}>1000 Most Common</Text>
            </View>
            <FlatList
                style={styles.wordList}
                data={words}
                bounces={false}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
                onEndReached={() => setShowLoadMore(true)}
                onEndReachedThreshold={0.1}
                //keyExtractor={(item) => item.username}
                renderItem={({item}) => (<WordItem item={item}></WordItem>)}
                />
            {showLoadMore && 
            <TouchableOpacity
                activeOpacity={1}
                style={styles.loadMoreButton}
                onPress={() => {setShowLoadMore(false)}}
            >
                <Text style={styles.loadMoreButtonText}>Load more</Text>
            </TouchableOpacity>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    
    // WordListScreen
    container: {
        flex: 1,
        marginHorizontal: 10,
    },
    topButtonContainer: {
        flexDirection: 'row',
        padding: 5,
        marginBottom: 10
    },
    headerContainer: {
        marginHorizontal: 10
    },
    headerContainerText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK
    },
    wordList: {
        height: "100%",
        marginTop: 10,
        marginHorizontal: 10
    },
    loadMoreButton: {
        backgroundColor: constants.PRIMARYCOLOR,
        borderRadius: 10,
        width: 150,
        padding: 5,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 10
    },
    loadMoreButtonText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.TERTIARYCOLOR,
        marginLeft: "auto",
        marginRight: "auto"
    },

    // WordItem
    wordItem: {
        flexDirection: "row",
        borderRadius: 10,
        marginBottom: 5,
        padding: 10
    },
    numberContainer: {
        borderRadius: 5,
        padding: 5,
        marginRight: 10
    },
    numberText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H3FONTSIZE
    },
    word: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    wordText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE
    },

    // ProgressBarButton
    progressBarButton: {
        backgroundColor: constants.SECONDARYCOLOR,
        flexDirection: "row",
        borderWidth: 3,
        borderRadius: 10,
        overflow: 'hidden',
        verticalAlign: 'center',
        marginHorizontal: 5,
        paddingHorizontal: 5,
        marginBottom: 15,
        height: 40
    },
    progressBarButtonTextContainer: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: 10
    },
    progressBarButtonText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD
    },
    progressBarButtonNumberContainer: {
        backgroundColor: constants.PRIMARYCOLOR,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    progressBarButtonNumberText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.TERTIARYCOLOR,
    },
    progressBar: {
        position: 'absolute',
        height: 40,
        backgroundColor: constants.PRIMARYCOLOR,
        borderColor: constants.PRIMARYCOLOR
    }
});