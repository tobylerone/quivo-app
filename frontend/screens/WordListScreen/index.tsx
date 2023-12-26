import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList
} from "react-native";
import { useEffect, useState, useContext, useRef } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import UserContext from "../../contexts/UserContext";
import * as constants from "../../constants";
import client from "../../utils/axios";
import ProgressBarButton from "./components/ProgressBarButton";
import WordItem from "./components/WordItem";
import { endAsyncEvent } from "react-native/Libraries/Performance/Systrace";

export default function WordListScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser } = useContext(UserContext);
    
    const [words, setWords] = useState([]);
    const [wordCounts, setWordCounts] = useState<Record<string, number>>({});
    const [activeButton, setActiveButton] = useState<string>('1-1000');

    const flatListRef = useRef();
    
    useEffect(() => {
        fetchWordCounts();
        fetchWordsData(1, 100);
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
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.topButtonContainer}
                horizontal={true}
                bounces={false}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
                removeClippedSubviews={true}
                >
                <ProgressBarButton
                    id={'1-1000'}
                    label={'0-1k'}
                    currentValue={wordCounts['1-1000']}
                    isActive={activeButton === '1-1000'}
                    onPress={handlePress}
                    maxValue={1000}
                />
                <ProgressBarButton
                    id={'1001-2000'}
                    label={'1k-2k'}
                    currentValue={wordCounts['1001-2000']}
                    isActive={activeButton === '1001-2000'}
                    onPress={handlePress}
                    maxValue={1000}
                />
                <ProgressBarButton
                    id={'2001-3000'}
                    label={'2k-3k'}
                    currentValue={wordCounts['2001-3000']}
                    isActive={activeButton === '2001-3000'}
                    onPress={handlePress}
                    maxValue={1000}
                />
                <ProgressBarButton
                    id={'3001-4000'}
                    label={'3k-4k'}
                    currentValue={wordCounts['3001-4000']}
                    isActive={activeButton === '3001-4000'}
                    onPress={handlePress}
                    maxValue={1000}
                />
                <ProgressBarButton
                    id={'4001-5000'}
                    label={'4k-5k'}
                    currentValue={wordCounts['4001-5000']}
                    isActive={activeButton === '4001-5000'}
                    onPress={handlePress}
                    maxValue={1000}
                />
                <ProgressBarButton
                    id={'5000+'}
                    label={'5k+'}
                    currentValue={wordCounts['5000+']}
                    isActive={activeButton === '5000+'}
                    onPress={handlePress}
                    maxValue={1000}
                />
            </ScrollView>
            <View style={styles.headerContainer}>
                <Text style={styles.headerContainerText}>{activeButton + ' Most Common'}</Text>
            </View>
            <FlatList
                style={styles.wordList}
                data={words}
                bounces={false}
                ref={flatListRef}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                onEndReached={() => loadMore()}
                onEndReachedThreshold={0.1}
                renderItem={({item}) => (<WordItem item={item}></WordItem>)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
    }
});