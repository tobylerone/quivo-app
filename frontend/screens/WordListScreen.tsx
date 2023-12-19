import { View, ScrollView, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, StatusBar } from "react-native"
import { useEffect, useState, useContext } from "react"
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { FontAwesome } from "@expo/vector-icons"
import UserContext from '../contexts/UserContext';
import * as constants from "../constants";
import client from "../utils/axios";
import { capitalizeFirstLetter } from "../utils/text";

/*

How to fix the issue of only hilighting one button at a time:
If each highlighted button is its own component, you can still manage the highlighted state at a higher level component and pass it down as props to the button components. Here’s an example:

import React, { useState } from 'react';
import { View } from 'react-native';
import HighlightedButton from './HighlightedButton'; // import your button component

const MyComponent = () => {
  const [highlightedButton, setHighlightedButton] = useState(null);

  const handlePress = (buttonId) => {
    setHighlightedButton(buttonId);
  };

  return (
    <View>
      <HighlightedButton 
        id='button1' 
        isHighlighted={highlightedButton === 'button1'} 
        onPress={handlePress} 
      />
      <HighlightedButton 
        id='button2' 
        isHighlighted={highlightedButton === 'button2'} 
        onPress={handlePress} 
      />
    </View>
  );
};

export default MyComponent;

And here’s how you might define the HighlightedButton component:

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const HighlightedButton = ({ id, isHighlighted, onPress }) => {
  return (
    <TouchableOpacity 
      style={isHighlighted ? styles.highlighted : styles.button} 
      onPress={() => onPress(id)}
    >
      <Text>{id}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // your normal button styles
  },
  highlighted: {
    // your highlighted button styles
  },
});

export default HighlightedButton;

In this example, the HighlightedButton component receives its id, whether it’s highlighted, and the onPress function as props. When the button is pressed, it calls the onPress function with its id as an argument. The MyComponent component keeps track of which button is currently highlighted and passes this information down to each HighlightedButton. I hope this helps! 😊

*/

const ProgressBarButton = ({label, currentValue, maxValue, defaultActive}) => {

    const [borderColor, setBorderColor] = useState(defaultActive ? constants.BLACK: constants.SECONDARYCOLOR);

    const progressPercentage = Math.floor((currentValue / maxValue) * 100)
    
    const handlePress = () => {

        // TODO: Fix this because it's stupid
        setBorderColor(borderColor == constants.SECONDARYCOLOR ? constants.BLACK: constants.SECONDARYCOLOR)
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
        </View>
    );
};

export default function WordListScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser } = useContext(UserContext);
    
    const [words, setWords] = useState([]);
    const [wordCounts, setWordCounts] = useState([]);
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
                renderItem={({ item }) => (<WordItem item={item}></WordItem>)}
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
        //paddingTop: StatusBar.currentHeight,
        marginHorizontal: 10,
    },
    topButtonContainer: {
        flexDirection: 'row',
        padding: 5,
        marginBottom: 10
        //flexWrap: 'wrap'
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
        //top: -2,
        //left: -2,
        height: 40,
        //borderRadius: 10,
        backgroundColor: constants.PRIMARYCOLOR,
        borderColor: constants.PRIMARYCOLOR
    }
});