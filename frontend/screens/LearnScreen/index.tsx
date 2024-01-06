import { useState, useRef, useContext } from "react";
import { StyleSheet, Switch, View, SafeAreaView, Text, TouchableOpacity, FlatList, Image, Animated, Dimensions } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLanguage, faFilter, faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
// Constants
import * as constants from "../../constants";
// Assets
import { flagImageSources } from "../../assets/img/imageSources";
// Utils
import { speak } from '../../utils/text';
// Contexts
import UserContext from "../../contexts/UserContext";
// Components
import CheckBox from "../../components/CheckBox";
import FlagButton from "./components/FlagButton";
// Hooks
import useLanguagePopupVisible from "./hooks/useLanguagePopupVisible";
import useFetchItems from './hooks/useFetchItems';
import useLevel from './hooks/useLevel';
import useFetchWordsData from "./hooks/useFetchWordsData";
import useSentenceComponents from "./hooks/useSentenceComponents";
import useFilterPopupVisible from "./hooks/useFilterPopupVisible";
import useKnownWords from "./hooks/useKnownWords";

export default function LearnScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser, knownLanguages, currentLanguage } = useContext(UserContext);
    
    const [translationVisible, setTranslationVisible] = useState(false);
    const [autoDictEnabled, setAutoDictEnabled] = useState<boolean>(false);

    const { knownWords } = useKnownWords();
    const { languagePopupVisible, languagePopupAnimation, toggleLanguagePopup } = useLanguagePopupVisible();
    const { filterPopupVisible, filterPopupAnimation, toggleFilterPopup } = useFilterPopupVisible();
    const { currentItem, changeItem } = useFetchItems();
    const { level, levelResidual } = useLevel(knownWords);
    const { wordsData } = useFetchWordsData(currentItem);
    // TODO: This hook returns jsx which needs fixing
    const { sentenceComponents } =  useSentenceComponents(currentItem, wordsData, autoDictEnabled);

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

    const renderPopupItem = (item: Record<string, string>) => (
        <View style={[styles.checkBoxContainer, styles.shadow]}>
            <CheckBox initiallySelected={item.initiallySelected ? true : false} size={30} />
            <Text style={styles.checkBoxLabel}>{item.title}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity
                    style={styles.streakContainer}
                    onPress={() => {navigation.navigate('Streak')}}
                    >
                    <Image style={styles.streakImage} source={require('../../assets/streak-rocket.png')} />
                    <Text style={styles.streakNumberText}>26</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.starBox}
                    onPress={() => {navigation.navigate('Level')}}
                    >
                    <Text style={styles.starCountText}>Lv. {level}</Text>
                    <View style={styles.progressBarBackground}>
                        <View style={{width: levelResidual ? Math.floor(levelResidual * 100) + '%' : 0, ...styles.progressBar}}></View>
                    </View>
                </TouchableOpacity>
                <View style={styles.topButtonsContainer}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { toggleLanguagePopup() }}
                        >
                        <View style={styles.flagImageContainer}>
                          <Image
                                source={flagImageSources[currentLanguage]}
                                style={styles.flagImage}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.filterButton}
                        onPress={() => { toggleFilterPopup() }}
                        >
                        <FontAwesomeIcon icon={faFilter} size={25} color={constants.PRIMARYCOLOR} />
                    </TouchableOpacity>
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
            <View style={[styles.contentContainer, styles.shadow]}>
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
            <View style={styles.autoplayContainer}>
                <Text style={styles.autoplayText}>Autoplay</Text>
                <Switch
                    trackColor={{false: constants.SECONDARYCOLOR, true: constants.PRIMARYCOLOR}}
                    thumbColor={constants.PRIMARYCOLOR/*autoDictEnabled ? '#f5dd4b' : '#f4f3f4'*/}
                    ios_backgroundColor={constants.SECONDARYCOLOR}
                    onValueChange={() => {setAutoDictEnabled(!autoDictEnabled)}}
                    value={autoDictEnabled}
                />
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
                    style={styles.nextButton}
                    onPress={() => changeItem()}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faArrowRight} size={25} color={constants.TERTIARYCOLOR} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.speakButton}
                    onPress={() => {speak(currentItem.sentence, currentLanguage.language_code);}}
                    >
                    <FontAwesomeIcon icon={faComment} size={30} color={constants.BLACK} />
                </TouchableOpacity>
            </View>
            <Animated.View style={[styles.filterPopupContainer, { top: filterPopupAnimation }]}>
                <Text style={styles.filterPopupHeader}>Filter Sentences</Text>
                {popupItemData.map((item) => renderPopupItem(item))}
                <TouchableOpacity
                    style={styles.filterPopupSubmitButton}
                    activeOpacity={1}
                    >
                    <Text style={styles.filterPopupSubmitButtonText}>Apply Filters</Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    )
}

const styles= StyleSheet.create({
    container: {
        flex: 1
    },
    topContainer: {
        marginTop: 60,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20
    },
    starBox: {
        flexDirection: 'column',
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    starContainer: {
        marginRight: 10,
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    starCountText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        marginTop: 'auto',
        marginRight: 5,
        marginBottom: 'auto',
    },
    progressBarBackground: {
        width: 100,
        height: 10,
        marginTop: 'auto',
        marginBottom: 'auto',
        borderWidth: 2,
        borderColor: constants.PRIMARYCOLOR,
        borderRadius: 5,
        overflow: 'hidden'
    },
    progressBar: {
        height: 10,
        backgroundColor: constants.PRIMARYCOLOR,
    },
    streakContainer: {
        flexDirection: 'row',
        height: 50,
        borderRadius: 10,
        backgroundColor: constants.SECONDARYCOLOR,
        paddingHorizontal: 7
    },
    streakImage: {
        width: 30,
        height: 30,
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: 5
    },
    streakNumberText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H1FONTSIZE - 5,
        color: constants.BLACK,
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: 5
    },
    topButtonsContainer: {
        flexDirection: "row",
        alignSelf: 'flex-end',
        marginLeft: 'auto',
    },
    languagePopupAnimatedContainer: {
        backgroundColor: constants.PRIMARYCOLOR,
        marginTop: 10,
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
        marginTop: 10,
        padding: 15,
        borderRadius: 30,
        flexWrap: "wrap",
        flex: 1
    },
    autoplayContainer: {
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10,
        height: 50,
        marginTop: -80,
        marginBottom: 30,
        marginLeft: 'auto',
        marginRight: 30,
        borderRadius: 10
    },
    autoplayText: {
        fontFamily: constants.FONTFAMILY,
        fontSize: constants.H3FONTSIZE,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    bottomContainer: {
        flexDirection: "row",
        height: 50,
        marginBottom: 105
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
        marginRight: 10,
        overflow: "hidden",
        height: 50,
        width: 70,
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
        fontSize: constants.H1FONTSIZE,
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    nextButton: {
        backgroundColor: constants.PRIMARYCOLOR,
        paddingTop: 11,
        width: 100,
        height: 50,
        borderRadius: 30,
        marginRight: "auto",
        marginLeft: "auto",
        textAlign: "center"
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