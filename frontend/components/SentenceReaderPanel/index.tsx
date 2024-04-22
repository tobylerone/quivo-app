import { useState, useEffect, useContext } from "react";
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity } from "react-native";
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
// Hooks
import { useSwipe } from "./hooks/useSwipe";
import useLanguagePopupVisible from "./hooks/useLanguagePopupVisible";
import useFetchItems from './hooks/useFetchItems';
import useLevelData from './hooks/useLevelData';
import useFetchWordsData from "./hooks/useFetchWordsData";
import useSentenceComponents from "./hooks/useSentenceComponents";
import useFilterPopupVisible from "./hooks/useFilterPopupVisible";

export default function SentenceReaderPanel(navigation) {

    const { currentLanguageCode, knownWords, dailyWordCount } = useContext(UserContext);
    
    const [translationVisible, setTranslationVisible] = useState(false);
    const [autoDictEnabled, setAutoDictEnabled] = useState<boolean>(true);

    const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);
    const { currentItem, changeItem } = useFetchItems();
    const { wordsData } = useFetchWordsData(currentItem);
    
    // TODO: This hook returns jsx which needs fixing
    const { sentenceComponents, setActiveWords } =  useSentenceComponents(navigation, currentItem, wordsData, autoDictEnabled);

    // TODO: Had to do extra useEffect to avoid circular dependency, but this whole screen needs cleaning
    // up
    useEffect(() => {
        setActiveWords([]);
    }, [currentItem]);

    // Handle swiping between sentences
    function onSwipeLeft() {changeItem()}
    function onSwipeRight() {}

    return (
    <SafeAreaView style={styles.container}>
        <View
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={styles.contentContainer}
            >
            {currentItem &&
            <View style={styles.sentenceContainer}>
                <View style={{
                    display: translationVisible ? "visible": "none",
                    ...styles.translatedSentence
                    }}>
                    <Text style={styles.mainText}>{currentItem.translated_sentence}</Text>
                </View>
                <View style={{
                    display: translationVisible ? "none": "visible",
                    ...styles.realSentence
                    }}>
                    {sentenceComponents}
                </View>
            </View>
            }
        </View>
        <View style={styles.bottomContainer}>
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.translateButton, styles.shadow]}
                onPressIn={() => setTranslationVisible(true)}
                onPressOut={() => setTranslationVisible(false)}
                >
                <FontAwesomeIcon icon={faLanguage} size={30} color={constants.PRIMARYCOLOR} />
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.speakButton, styles.shadow]}
                onPress={() => {
                    speak(currentItem.sentence, currentLanguageCode)
                }}
                >
                <FontAwesomeIcon icon={faCommentDots} size={30} color={constants.PRIMARYCOLOR} />
            </TouchableOpacity>
            <View style={styles.autoplayContainer}>
                <Text style={styles.autoplayText}>Autoplay</Text>
                <View style={styles.toggleButtonContainer}>
                    <ToggleButton
                        initiallySelected={autoDictEnabled}
                        size={20}
                        onValueChange={() => setAutoDictEnabled(!autoDictEnabled)}
                    />
                </View>
            </View>
        </View>
    </SafeAreaView>
    )
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.TERTIARYCOLOR
    },
    topContainer: {
        marginTop: 60,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20
    },
    levelBox: {
        flexDirection: 'column',
        height: 40,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    levelTextContainer: {
        flexDirection: 'row',
        marginBottom: 'auto'
    },
    levelText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK,
        marginTop: 'auto',
        marginRight: 5
    },
    levelWordText: {
        fontSize: constants.CONTENTFONTSIZE,
        fontFamily: constants.FONTFAMILY,
        color: constants.BLACK,
        marginTop: 'auto'
    },
    progressBarBackground: {
        width: 210,
        height: 10,
        padding: -1,
        //marginTop: 'auto',
        marginBottom: 'auto',
        //borderWidth: 2,
        //borderColor: constants.PRIMARYCOLOR,
        backgroundColor: constants.LIGHTGREY,//constants.GREEN + '55',
        borderRadius: 5,
        overflow: 'hidden'
    },
    progressBar: {
        height: 12,
        marginTop: -1,
        backgroundColor: constants.PRIMARYCOLOR,
        borderRadius: 6
    },
    streakContainer: {
        flexDirection: 'row',
        height: 40,
        borderRadius: 10,
        backgroundColor: constants.SECONDARYCOLOR,
        paddingHorizontal: 7
    },
    streakImagesContainer: {
        flexDirection: 'row',
        height: 28,
        width: 28,
        marginRight: 5,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    streakImageContainer: {
        marginTop: 'auto',
    },
    streakImage: {
        width: 28,
        height: 28,
        marginTop: 'auto'
    },
    streakImageEmpty: {
        opacity: 0.3
    },
    streakNumberText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H1FONTSIZE - 5,
        color: constants.PRIMARYCOLOR,
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: 5
    },
    topButtonsContainer: {
        flexDirection: "row",
        height: 40,
        alignSelf: 'flex-end',
        marginLeft: 'auto',
    },
    languagePopupAnimatedContainer: {
        backgroundColor: constants.PRIMARYCOLOR,
        marginTop: 20,
        //borderBottomColor: constants.GREY,
        //borderBottomWidth: 3
    },
    languagePopupContainer: {
        paddingVertical: 9,
        paddingLeft: 10,
        flexDirection: 'row',
    },
    contentContainer: {
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: constants.TERTIARYCOLOR,
        marginHorizontal: 20,
        marginBottom: 20,
        //marginTop: 10,
        padding: 15,
        borderRadius: 20,
        //borderColor: constants.GREY,
        flexWrap: "wrap",
        flex: 1
    },
    autoplayContainer: {
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10,
        height: 50,
        //marginTop: -80,
        marginBottom: 25,
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
        bottom: 75,
        marginTop: 'auto',
        marginBottom: -75
    },
    filterPopupContainer: {
        backgroundColor: constants.SECONDARYCOLOR,
        position: 'absolute',
        padding: 20,
        width: '100%',
        height: '80%',
        borderRadius: 60,
        zIndex: 1
    },
    languagePopupListContainer: {
    },
    languagePopupList: {
    },
    flagImageContainer: {
        borderRadius: 10,
        //marginRight: 10,
        overflow: "hidden",
        height: 40,
        width: 55,
    },
    flagImageContainerPopup: {
        borderWidth: 3
    },
    flagImage: {
        width: "100%",
        height: "100%",
    },
    languagePopupAddButton: {
        borderWidth: 3,
        borderColor: constants.TERTIARYCOLOR,
        padding: 5,
        width: 35,
        height: 35,
        borderRadius: 10,
        marginTop: 'auto',
        marginBottom: 'auto',
        justifyContent: 'center',
        alignItems: 'center'
    },
    filterButton: {
        backgroundColor: constants.SECONDARYCOLOR,
        height: 50,
        width: 50,
        borderRadius: 25,
        flexDirection: 'column',
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sentenceContainer: {
        width: "100%"
    },
    mainText: {
        fontSize: constants.H1FONTSIZE + 7,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK,
        textAlign: "center"
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
    filterPopupHeader: {
        fontSize: constants.H1FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        textAlign: 'center',
        color: constants.BLACK,
        marginBottom: 20
    },
    checkBoxContainer: {
        flexDirection: 'row',
        padding: 5,
        backgroundColor: constants.TERTIARYCOLOR,
        borderRadius: 10,
        marginBottom: 10
    },
    checkBoxLabel: {
        color: constants.BLACK,
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILY,
        marginLeft: 10,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    filterPopupSubmitButton: {
        backgroundColor: constants.PRIMARYCOLOR,
        width: 200,
        padding: 10,
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },
    filterPopupSubmitButtonText: {
        color: constants.TERTIARYCOLOR,
        fontFamily: constants.FONTFAMILY,
        fontSize: constants.H2FONTSIZE,
        marginLeft: 'auto',
        marginRight: 'auto'
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