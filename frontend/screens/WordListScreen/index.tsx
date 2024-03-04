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
import NavBar from "../../components/NavBar";
import BottomNavBar from "../../components/BottomNavBar";
import ProgressBarButton from "./components/ProgressBarButton";
import WordItem from "./components/WordItem";

export default function WordListScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser, knownWords, dailyWordCount } = useContext(UserContext);
    
    const [words, setWords] = useState([]);
    const [wordCounts, setWordCounts] = useState<Record<string, number>>({});
    const [activeButton, setActiveButton] = useState<string>('1-1000');

    const flatListRef = useRef();

    const renderItem = useCallback(({item}) => <WordItem navigation={navigation} item={item} />, []);
    
    useEffect(() => {
        fetchWordCounts();
        fetchWordsData(1, 100);
    }, []);

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
            setWords(valuesArray);
        } catch (error) {
            console.error(error);
        }
    }

    const handlePress = (activeButton: string) => {
        setActiveButton(activeButton);
        // Temporary just to test
        const wordsRange: Record<string, number[]> = {
            '1-1000': [1, 100],
            '1001-2000': [1001, 1100],
            '2001-3000': [2001, 2100],
            '3001-4000': [3001, 3100],
            '4001-5000': [4001, 4100],
            '5000+': [5001, 5100],   
        }

        // Clear words
        setWords([]);

        fetchWordsData(
            wordsRange[activeButton][0],
            wordsRange[activeButton][1]
        ).then(() => {
            // Make sure Flatlist returns to top when new data added
            flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
        });
    }

    const loadMore = () => {
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
                    <Text style={styles.headerContainerText}>{activeButton + ' Most Common'}</Text>
                </View>
            </View>
            {words.length !== 0 ?
            <FlatList
                style={styles.wordList}
                data={words}
                bounces={false}
                ref={flatListRef}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                onEndReached={() => loadMore()}
                onEndReachedThreshold={0.1}
                initialNumToRender={10} // Look into these two
                maxToRenderPerBatch={10}
                renderItem={renderItem}
            />
            : <ActivityIndicator style={styles.activityIndicator} size='large' color={constants.PRIMARYCOLOR} />
            }
        </SafeAreaView>
        <BottomNavBar hilighted='WordList' navigation={navigation} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 20,
    },
    titleText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10
    },
    headerContainerText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK
    },
    wordList: {
        marginTop: 10
    },
    activityIndicator: {
        marginTop: 20
    }
});