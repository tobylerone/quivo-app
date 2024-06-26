import { View, ScrollView, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from "react-native";
import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
// Constants
import * as constants from "../../constants";
// Utils
import client from "../../utils/axios";
// Contexts
import UserContext from "../../contexts/UserContext";
// Components
import BottomNavBar from "../../components/BottomNavBar";
import ProgressBarButton from "./components/ProgressBarButton";
import WordItem from "./components/WordItem";
import ToggleButton from "../../components/ToggleButton";

export default function WordListScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser, knownWords, dailyWordCount } = useContext(UserContext);
    
    const [primaryColor, setPrimaryColor] = useState<string>(constants.PURPLEREGULAR);
    const [words, setWords] = useState([]);
    const [paginator, setPaginator] = useState<number>(0);
    const [wordCounts, setWordCounts] = useState<Record<string, number>>({});
    const [activeButton, setActiveButton] = useState<string>('1-1000');
    const [showKnownWords, setShowKnownWords] = useState<boolean>(true);

    const flatListRef = useRef();

    const renderItem = useCallback(({item}) => <WordItem navigation={navigation} item={item} primaryColor={primaryColor} showKnownWords={showKnownWords} />, [primaryColor, showKnownWords]);
    
    useEffect(() => {
        fetchWordCounts();
        fetchWordsData(1, 100);
    }, []);

    useEffect(() => {
        // Change the color scheme
        setPrimaryColor(colorByRange[activeButton]);

        fetchWordsData(
            initialWordIndex[activeButton],
            initialWordIndex[activeButton] + 99
        ).then(() => {
            // Make sure Flatlist returns to top when new data added
            flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
        });
    }, [activeButton]);

    useEffect(() => {
        // Fetch more words data when paginator is incremented;
        fetchWordsData(
            initialWordIndex[activeButton] + (paginator * 100),
            initialWordIndex[activeButton] + 99 + (paginator * 100)
            )
    }, [paginator]);

    // Temporary just to test
    const initialWordIndex: Record<string, number> = {
        '1-1000': 1,
        '1001-2000': 1001,
        '2001-3000': 2001,
        '3001-4000': 3001,
        '4001-5000': 4001,
        '5000+': 5001,   
    }

    const colorByRange: Record<string, string> = {
        '1-1000': constants.PURPLEREGULAR,
        '1001-2000': constants.PRIMARYCOLOR,
        '2001-3000': constants.ORANGEREGULAR,
        '3001-4000': constants.BLUEREGULAR,
        '4001-5000': constants.GREENREGULAR,
        '5000+': constants.PURPLEREGULAR,   
    }

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

    const fetchWordsData = async(start_index: number, end_index: number) => {
        try {
            const res = await client.post('./api/words', {
                start_index: start_index,
                end_index: end_index,
                withCredentials: true
            });

            // Don't need the word keys, just an array of each word's data
            let valuesArray = Object.values(res.data);
            setWords([...words, ...valuesArray]);
        } catch (error) {
            console.error(error);
        }
    }

    const handlePress = (activeButton: string) => {
        setActiveButton(activeButton);

        // Clear words and set paginator back to zero
        setWords([]);
        setPaginator(0);
    }

    const loadMore = () => {
        console.log('Loading more');
        setPaginator((val) => val + 1);
    }

    const buttonData = [
        {id: '1-1000', label: '0-1k'},
        {id: '1001-2000', label: '1-2k'},
        {id: '2001-3000', label: '2-3k'},
        {id: '3001-4000', label: '3-4k'},
        {id: '4001-5000', label: '4-5k'},
        {id: '5000+', label: '5k+'},
    ];

    const renderProgressBarButton = (id: string, label: string) => (
        <ProgressBarButton
            id={id}
            primaryColor={colorByRange[id]}
            label={label}
            currentValue={wordCounts[id]}
            isActive={activeButton === id}
            onPress={handlePress}
            maxValue={1000}
        />
    );
    
    return (
        <>
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Frequency List</Text>
            <View>
                <ScrollView
                    style={styles.topButtonContainer}
                    horizontal={true}
                    bounces={false}
                    showsVerticalScrollIndicator={false} 
                    showsHorizontalScrollIndicator={false}
                    overScrollMode="never"
                    removeClippedSubviews={true}
                    >
                    {buttonData.map(({id, label}) => renderProgressBarButton(id, label))}
                </ScrollView>
                <View style={styles.headerContainer}>
                    <View style={styles.knownWordsToggleContainer}>
                        <Text style={styles.knownWordsToggleText}>Inc. known words</Text>
                        <ToggleButton
                            initiallySelected={showKnownWords}
                            size={20}
                            onValueChange={() => {setShowKnownWords(!showKnownWords)}}
                            primaryColor={primaryColor}
                            secondaryColor={primaryColor + '55'}
                            />
                    </View>
                    <Text style={styles.headerContainerText}>{activeButton + ' Most Common'}</Text>
                </View>
            </View>
            {words.length !== 0 ?
            <FlatList
                style={styles.wordList}
                data={words}
                bounces={false}
                overScrollMode="never"
                removeClippedSubviews={true}
                ref={flatListRef}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                onEndReached={() => loadMore()}
                onEndReachedThreshold={0.2}
                initialNumToRender={30} // Look into these two
                maxToRenderPerBatch={10}
                renderItem={renderItem}
            />
            : <ActivityIndicator style={styles.activityIndicator} size='large' color={primaryColor} />
            }
        </SafeAreaView>
        <BottomNavBar hilighted='WordList' navigation={navigation} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingBottom: 180,
        paddingHorizontal: 20,
        backgroundColor: constants.TERTIARYCOLOR
    },
    titleText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.BLACK,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10
    },
    headerContainerText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK
    },
    knownWordsToggleContainer: {
        flexDirection: 'row',
        height: 20
    },
    knownWordsToggleText: {
        marginRight: 5,
        marginLeft: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    wordList: {
        marginTop: 10
    },
    activityIndicator: {
        marginTop: 20
    }
});