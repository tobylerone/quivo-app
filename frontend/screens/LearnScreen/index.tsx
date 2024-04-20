import { useState, useEffect, useContext } from "react";
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, FlatList, Image, Animated, Dimensions } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLanguage, faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
// Constants
import * as constants from "../../constants";
// Assets
import { flagImageSources } from "../../assets/img/imageSources";
// Utils
import { speak } from '../../utils/text';
// Contexts
import UserContext from '../../contexts/UserContext';
// Components
import BottomNavBar from '../../components/BottomNavBar';
import CheckBox from '../../components/CheckBox';
import FlagButton from './components/FlagButton';
import RaisedButton from "../../components/RaisedButton";
import ToggleButton from "../../components/ToggleButton";
// Hooks
import { useSwipe } from "./hooks/useSwipe";
import useLanguagePopupVisible from "./hooks/useLanguagePopupVisible";
import useFetchItems from './hooks/useFetchItems';
import useLevelData from './hooks/useLevelData';
import useFetchWordsData from "./hooks/useFetchWordsData";
import useSentenceComponents from "./hooks/useSentenceComponents";
import useFilterPopupVisible from "./hooks/useFilterPopupVisible";
import useKnownWords from "./hooks/useKnownWords";

export default function LearnScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser, knownLanguages, currentLanguageCode, knownWords, dailyWordCount, streakLimitReached, userStreak, setUserStreak } = useContext(UserContext);
    
    const [translationVisible, setTranslationVisible] = useState(false);
    const [autoDictEnabled, setAutoDictEnabled] = useState<boolean>(true);

    const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);
    const { languagePopupVisible, languagePopupAnimation, toggleLanguagePopup } = useLanguagePopupVisible();
    const { filterPopupVisible, filterPopupAnimation, toggleFilterPopup } = useFilterPopupVisible();
    const { currentItem, changeItem } = useFetchItems();
    const { level, wordsInLevel, knownWordsInLevel} = useLevelData(knownWords);
    const { wordsData } = useFetchWordsData(currentItem);

    useEffect(() => {
        if (streakLimitReached === true){
            setUserStreak(userStreak => userStreak + 1);
            // TODO: Update in database
            navigation.navigate('IncreaseStreak')
        };
    }, [streakLimitReached]);
    
    // TODO: This hook returns jsx which needs fixing
    const { sentenceComponents, setActiveWords } =  useSentenceComponents(navigation, currentItem, wordsData, autoDictEnabled);

    // TODO: Had to do extra useEffect to avoid circular dependency, but this whole screen needs cleaning
    // up
    useEffect(() => {
        setActiveWords([]);
    }, [currentItem]);
    
    const popupItemData = [
        {title: '1000 most common words'},
        {title: '2000 most common words'},
        {title: '5000 most common words'},
        {title: 'Art and culture'},
        {title: 'Technology'},
        {title: 'Fashion'},
        {title: 'Politics'},
        {title: 'Finance'},
    ];

    // Handle swiping between sentences
    function onSwipeLeft() {changeItem()}
    function onSwipeRight() {}

    const renderPopupItem = (item: Record<string, string>) => (
        <View style={[styles.checkBoxContainer, styles.shadow]}>
            <CheckBox initiallySelected={item.initiallySelected ? true : false} size={30} />
            <Text style={styles.checkBoxLabel}>{item.title}</Text>
        </View>
    );

    const renderStreakCircle = (i: number) => (
        <View style={{
            backgroundColor: dailyWordCount >= i
                ? constants.PRIMARYCOLOR
                : constants.GREEN + '44',
            ...styles.streakCircle
        }}></View>
    );

    return (
    <>
    <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
            <TouchableOpacity
                style={styles.streakContainer}
                onPress={() => {navigation.navigate('Streak')}}
                >
                <View style={styles.streakImagesContainer}>
                    <View style={styles.streakImageContainer}><Image style={[styles.streakImage, styles.streakImageEmpty]} source={require('../../assets/streak-rocket-empty.png')} /></View>
                    <View style={{overflow: 'hidden', height: dailyWordCount <= 10 ? Math.round(28 * dailyWordCount / 10) : 28, marginLeft: -28, ...styles.streakImageContainer}}><Image style={styles.streakImage} source={require('../../assets/streak-rocket-full.png')} /></View>
                </View>
                <Text style={styles.streakNumberText}>{userStreak}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.levelBox}
                onPress={() => {navigation.navigate('Level')}}
                >
                <View style={styles.levelTextContainer}>
                    <Text style={styles.levelText}>Lv. {level}</Text>
                    <Text style={styles.levelWordText}>{knownWordsInLevel}/{wordsInLevel}</Text>
                </View>
                <View style={styles.progressBarBackground}>
                    <View style={{width: knownWordsInLevel ? Math.floor((knownWordsInLevel/wordsInLevel) * 100) + '%' : 0, ...styles.progressBar}}></View>
                </View>
            </TouchableOpacity>
            <View style={styles.topButtonsContainer}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { toggleLanguagePopup() }}
                    >
                    <View style={styles.flagImageContainer}>
                        <Image
                            source={flagImageSources[currentLanguageCode]}
                            style={styles.flagImage}
                        />
                    </View>
                </TouchableOpacity>
                {/*<TouchableOpacity
                    activeOpacity={1}
                    style={styles.filterButton}
                    onPress={() => { toggleFilterPopup() }}
                    >
                    <FontAwesomeIcon icon={faFilter} size={25} color={constants.BLACK} />
                </TouchableOpacity>*/}
            </View>
        </View>
        <Animated.View style={{
            height: languagePopupAnimation,
            ...styles.languagePopupAnimatedContainer
            }}>
            <View style={{
                opacity: languagePopupVisible ? 1: 0,
                ...styles.languagePopupContainer
                }}>
                <View style={styles.languagePopupListContainer}>
                    <FlatList
                        data={knownLanguages}
                        style={styles.languagePopupList}
                        bounces={false}
                        horizontal={true}
                        renderItem={({item}) => (
                            <FlagButton item={item} />
                        )}
                    />
                </View>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigation.navigate("AccountLanguages")}
                    style={styles.languagePopupAddButton}
                    >
                    <FontAwesomeIcon icon={faPlus} size={20} color={constants.TERTIARYCOLOR} />
                </TouchableOpacity>
            </View>
        </Animated.View>
        <View style={styles.separatorBar}></View>
        {dailyWordCount < constants.STREAKDAILYWORDS &&
        <View style={styles.streakCirclesContainer}>
            {Array.from(
                {length: constants.STREAKDAILYWORDS},
                (_, i) => i + 1).map((i) => renderStreakCircle(i)
            )}
        </View>
        }
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
                style={styles.translateButton}
                onPressIn={() => setTranslationVisible(true)}
                onPressOut={() => setTranslationVisible(false)}
                >
                <FontAwesomeIcon icon={faLanguage} size={30} color={constants.BLACK} />
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={1}
                style={styles.speakButton}
                onPress={() => {
                    speak(currentItem.sentence, currentLanguageCode)
                }}
                >
                <FontAwesomeIcon icon={faCommentDots} size={30} color={constants.BLACK} />
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
        {/*<Animated.View style={[styles.filterPopupContainer, { top: filterPopupAnimation }]}>
            <Text style={styles.filterPopupHeader}>Filter Sentences</Text>
            {popupItemData.map((item) => renderPopupItem(item))}
            <TouchableOpacity
                style={styles.filterPopupSubmitButton}
                activeOpacity={1}
                >
                <Text style={styles.filterPopupSubmitButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            </Animated.View>*/}
    </SafeAreaView>
    <BottomNavBar hilighted='Learn' navigation={navigation} />
    </>
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
        marginTop: 'auto',
        marginRight: 5
    },
    levelWordText: {
        fontSize: constants.CONTENTFONTSIZE,
        fontFamily: constants.FONTFAMILY,
        marginTop: 'auto'
    },
    progressBarBackground: {
        width: 110,
        height: 10,
        padding: -1,
        //marginTop: 'auto',
        marginBottom: 'auto',
        //borderWidth: 2,
        //borderColor: constants.PRIMARYCOLOR,
        backgroundColor: constants.GREEN + '55',
        borderRadius: 5,
        overflow: 'hidden'
    },
    progressBar: {
        height: 12,
        marginTop: -1,
        backgroundColor: constants.PRIMARYCOLOR,
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
        color: constants.ORANGE,
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
    separatorBar: {
        borderBottomColor: constants.GREY,
        borderBottomWidth: 2
    },
    languagePopupAnimatedContainer: {
        backgroundColor: constants.PRIMARYCOLOR,
        marginTop: 20,
        //marginBottom: 10
    },
    languagePopupContainer: {
        paddingVertical: 10,
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
        //borderWidth: 2,
        //borderColor: constants.GREY,
        flexWrap: "wrap",
        flex: 1
    },
    streakCirclesContainer: {
        flexDirection: 'row',
        marginHorizontal: 40,
        marginTop: 20,
        marginBottom: -40,
        zIndex: 2
    },
    streakCircle: {
        //borderWidth: 3,
        //borderColor: constants.PRIMARYCOLOR,
        width: 20,
        height: 20,
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
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
        marginBottom: 75
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
        backgroundColor: constants.SECONDARYCOLOR,
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
        backgroundColor: constants.SECONDARYCOLOR,
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