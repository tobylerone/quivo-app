import { useState, useEffect, useContext } from "react";
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLanguage, faPlus, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-regular-svg-icons';
// Constants
import * as constants from "../../constants";
// Utils
import { speak } from '../../utils/text';
// Contexts
import UserContext from '../../contexts/UserContext';
// Components
import ToggleButton from "../../components/ToggleButton";
// Interfaces
import { ISentence } from "../../interfaces";
// Hooks
import { useSwipe } from "./hooks/useSwipe";
import useFetchItems from './hooks/useFetchItems';
import useFetchWordsData from "./hooks/useFetchWordsData";
import useSentenceComponents from "./hooks/useSentenceComponents";

interface ISentenceReaderProps {
    navigation: any,
    primaryColor?: string,
    sentencesData?: ISentence[] | null,
    onSentenceReaderLeftSwipe: Function,
    onSentenceReaderRightSwipe: Function,
    marginBottom: number
}

export default function SentenceReaderPanel({
    navigation,
    primaryColor = constants.PRIMARYCOLOR,
    sentencesData = null,
    onSentenceReaderLeftSwipe,
    onSentenceReaderRightSwipe,
    marginBottom = 25,
}: ISentenceReaderProps) {

    const { currentLanguageCode, autoplayEnabled, setAutoplayEnabled } = useContext(UserContext);
    
    const [sentenceVisible, setSentenceVisible] = useState(false);
    const [translationVisible, setTranslationVisible] = useState(false);

    const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);
    
    // If no sentenceData provided (defaults to null), fetch sentences from database.
    const { currentItem, changeItem } = useFetchItems(sentencesData);
    const { wordsData } = useFetchWordsData(currentItem);
    
    // TODO: This hook returns jsx which needs fixing
    const { sentenceComponents, setActiveWords } =  useSentenceComponents(navigation, primaryColor, currentItem, wordsData, autoplayEnabled, setSentenceVisible);
    
    // TODO: Had to do extra useEffect to avoid circular dependency, but this whole screen needs cleaning
    // up
    useEffect(() => {
        setActiveWords([]);
        setSentenceVisible(true);
    }, [currentItem]);

    // Handle swiping between sentences
    function onSwipeLeft() {
        setSentenceVisible(false)
        onSentenceReaderLeftSwipe();
        changeItem(1);
    }
    function onSwipeRight() {
        setSentenceVisible(false);
        onSentenceReaderRightSwipe(1);
        changeItem(-1);
    }

    return (<>
    <View
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={styles.contentContainer}
        >
        {currentItem && sentenceVisible ? 
        <View style={styles.sentenceContainer}>
            <View style={{
                display: translationVisible ? "visible": "none",
                ...styles.translatedSentence
                }}>
                <Text style={{color: constants.BLACK, ...styles.mainText}}>{currentItem.translated_sentence}</Text>
            </View>
            <View style={{
                display: translationVisible ? "none": "visible",
                ...styles.realSentence
                }}>
                {sentenceComponents}
            </View>
        </View>
        : <ActivityIndicator size="large" color={primaryColor} />}
    </View>
    <View style={{
        marginBottom: marginBottom,
        ...styles.bottomContainer
        }}>
        <TouchableOpacity
            activeOpacity={1}
            style={[styles.translateButton, styles.shadow]}
            onPressIn={() => setTranslationVisible(true)}
            onPressOut={() => setTranslationVisible(false)}
            >
            <FontAwesomeIcon icon={faLanguage} size={30} color={primaryColor} />
        </TouchableOpacity>
        <TouchableOpacity
            activeOpacity={1}
            style={[styles.speakButton, styles.shadow]}
            onPress={() => {
                speak(currentItem.sentence, currentLanguageCode)
            }}
            >
            <FontAwesomeIcon icon={faCommentDots} size={30} color={primaryColor} />
        </TouchableOpacity>
        <View style={styles.autoplayContainer}>
            <Text style={styles.autoplayText}>Autoplay</Text>
            <View style={styles.toggleButtonContainer}>
                <ToggleButton
                    initiallySelected={autoplayEnabled}
                    size={20}
                    primaryColor={primaryColor}
                    secondaryColor={primaryColor + '55'}
                    onValueChange={() => setAutoplayEnabled(!autoplayEnabled)}
                />
            </View>
        </View>
    </View>
    </>)
}

const styles= StyleSheet.create({
    contentContainer: {
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: constants.TERTIARYCOLOR,
        padding: 15,
        flex: 1
    },
    autoplayContainer: {
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10,
        height: 50,
        //marginTop: -80,
        marginLeft: 'auto',
        marginRight: 10,
        borderRadius: 10,
        //elevation: 4
    },
    autoplayText: {
        fontFamily: constants.FONTFAMILY,
        fontSize: constants.H3FONTSIZE,
        color: constants.BLACK,
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: 5
    },
    toggleButtonContainer: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    bottomContainer: {
        flexDirection: "row",
        height: 50,
    },
    sentenceContainer: {
        width: "100%"
    },
    mainText: {
        fontSize: constants.H1FONTSIZE + 7,
        fontFamily: constants.FONTFAMILYBOLD,
        textAlign: "center",

    },
    realSentence: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap"

    },
    translatedSentence: {
        width: "100%"
    },
    translateButton: {
        backgroundColor: constants.TERTIARYCOLOR,
        height: 50,
        width: 50,
        borderRadius: 25,
        flexDirection: 'column',
        marginTop: 0,
        marginLeft: 20,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    speakButton: {
        backgroundColor: constants.TERTIARYCOLOR,
        height: 50,
        width: 50,
        borderRadius: 25,
        flexDirection: 'column',
        marginTop: 0,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    shadow: {
        shadowColor: constants.BLACK,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.15,
        shadowRadius: 1,
        elevation: 3,
        borderWidth: 0
    }
});