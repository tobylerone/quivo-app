import { useEffect, useState, useRef, useContext } from "react";
import {
    StyleSheet,
    Switch,
    View,
    SafeAreaView,
    Text, 
    TouchableOpacity,
    FlatList,
    Image,
    Animated,
    Dimensions,
    useWindowDimensions
} from "react-native";
import PNG from 'pngjs';
import * as Speech from "expo-speech";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import CheckBox from "../../components/CheckBox";
import Word from "./components/Word";
import FlagButton from "./components/FlagButton";
import UserContext from "../../contexts/UserContext";
import * as constants from "../../constants";
import client from "../../utils/axios";
import { capitalizeFirstLetter } from "../../utils/text";

const windowHeight = Dimensions.get('window').height;

export default function LearnScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser, knownLanguages, currentLanguage } = useContext(UserContext);

    const flagImageSources: Record<string, PNG> = {
        'fr': require("../../assets/fr.png"),
        'de': require("../../assets/de.png")
    }
    
    // TODO: Remove this default
    const [items, setItems] = useState([
        {
            'id': 1,
            'sentence': '',
            'translated_sentence': 'No translation',
            'words': '',
			'average_count': '',
			'min_count': ''
        }]);
    
    const [item, setItem] = useState(items[0]);
    const [translationVisible, setTranslationVisible] = useState(false);
    const [languagePopupVisible, setLanguagePopupVisible] = useState(false);
    const [filterPopupVisible, setFilterPopupVisible] = useState(false);
    const [sentenceComponents, setSentenceComponents] = useState<React.JSX.Element[]>([]);
    const [autoDictEnabled, setAutoDictEnabled] = useState<boolean>(false);
    const [sentenceIndex, setSentenceIndex] = useState<number>(0);

    const languagePopupAnimation = useRef(new Animated.Value(0)).current;
    const filterPopupAnimation = useRef(new Animated.Value(windowHeight)).current;

    const screenWidth = useWindowDimensions().width;
    
    useEffect(() => {
        console.log("Rendering Learnscreen");
        fetchData();
    }, [currentLanguage])

    // After updating items, set current item to first one in the list
    useEffect(() => {
        if (items.length > 0) { setItem(items[0]); }
    }, [items]);

    useEffect(() => {
        // Split sentence by word boundaries and return either text or a Word component if it is to be clickable
        createSentenceComponents().then(components => {
            setSentenceComponents(components);
        });

        if (autoDictEnabled) speak();
    }, [item]);

    const fetchData = async() => {
        client.get("/api/sentences", { withCredentials: true })
        .then(function(res) {
            // Make sure each item's word field in converted from stringified
            // json to real object   
            const data = res.data.map(item => {

                // Convert from postgresql array format
                if (typeof item.words === 'string') {
                    item = { ...item, words: JSON.parse(item.words) };
                }
                return item;
            })
            setSentenceIndex(0);
            setItems(data);
            changeSentence();
        })
        .catch(function(error) {
            console.log(error);
        });
    };

    const changeSentence = () => {
        //const randomIndex = Math.floor(Math.random() * items.length);
        
        let newItem = items[sentenceIndex];

        if (sentenceIndex < items.length - 1) {
            console.log(sentenceIndex);
            setSentenceIndex(sentenceIndex + 1);
        } else {
            // Want to get new sentences and reset index to 0
            setSentenceIndex(0);
            //fetchData();
            console.log(sentenceIndex);
        }
        setItem(newItem);
    };

    const toggleLanguagePopup = () => {
        Animated.timing(languagePopupAnimation, {
        toValue: languagePopupVisible ? 0 : 70,
        duration: 400,
        useNativeDriver: false,
        }).start(() => {
            setLanguagePopupVisible(!languagePopupVisible);
        });
        if (languagePopupVisible) {
            setLanguagePopupVisible(false);
        }
    };

    const toggleFilterPopup = () => {
        setFilterPopupVisible(!filterPopupVisible);
        Animated.timing(filterPopupAnimation, {
        toValue: filterPopupVisible ? windowHeight : 0.2 * windowHeight,
        duration: 400,
        useNativeDriver: false,
        }).start();
    };

    const fetchWordsData = async() => {
        try {
            const res = await client.post('./api/words', {
                words: item.words,
                withCredentials: true
            });
            return res.data
        } catch (error) {
            console.error(error);
        }
    }

    const createSentenceComponents = async() => {
        
        const getFullWord = (word: string) => {
        
            // TODO: This map gets repeated three times. Need to sort this out
            let shortened_word_map: Record<string, string> = {
                'j': 'je',
			    'l': 'le', // Always replace with le for now. Figure out a better solution here
			    't': 'tu', // This will assign the t in a-t-on to tu for example, which will give tu a higher frequency than it should have, but it's only one very common word so I'm not going to address it
			    'd': 'de', // Need to check whether this is ever du
			    'c': 'ce',
			    's': 'se',
			    'qu': 'que',
			    'm': 'me',
			    'n': 'ne',
		    }

            return word in shortened_word_map ? shortened_word_map[word] : word;
        }
        
        if (item.sentence.length == 0) {
            return <Text></Text>;
        }

        // Want to match into one of two categories: valid french words (using same regex as one shown above) and everything else
        const regex: Record<string, RegExp> = {
            'fr': /(?:[Aa]ujourd\'hui|[Pp]resqu\'île|[Qq]uelqu\'un|[Dd]\'accord|-t-|[a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüùÛÜÙçÇîÎïÏ]+|[^a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüùÛÜÙçÇîÎïÏ]+)/g,
            'de': /(?:[a-zA-ZäöüÄÖÜß]+|[^a-zA-ZäöüÄÖÜß])/g
        }
        
        const splitSentence = item.sentence.match(regex[currentLanguage]) || [];
        const wordsData = await fetchWordsData();

        const sentenceComponents = [];

        for (let i = 0; i < splitSentence.length; i++) {
            
            let word = splitSentence[i]
            // Same as word unless in shortened_word_map
            let fullWord = getFullWord(word.toLowerCase());
    
            if (wordsData.hasOwnProperty(fullWord)) {

                sentenceComponents.push(<Word
                    word={word}
                    wordData={wordsData[fullWord]}
                    isFirstWord={i==0}
                    screenWidth={screenWidth}
                    index={i}
                    key={`${item.id}-${i}`}
                />);
            } else {
                sentenceComponents.push(<Text style={{ color: constants.GREY, ...styles.mainText }} key={i}>{i==0 ? capitalizeFirstLetter(word) : word}</Text>);
            }
        };
        return sentenceComponents;
    };

    const speak = () => {
        Speech.speak(
            item.sentence,
            {language: currentLanguage}
            );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.starBox}>
                    {/*<View style={styles.starContainer}>
                        <FontAwesome name="star" size={30} color={constants.PRIMARYCOLOR} />
                    </View>*/}
                    <Text style={styles.starCountText}>Lv. 27</Text>
                    <View style={styles.progressBarBackground}>
                        <View style={styles.progressBar}></View>
                    </View>
                </View>
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
                        <FontAwesome name="filter" size={25} color={constants.BLACK} />
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
                        <FontAwesome name='plus' size={20} color={constants.TERTIARYCOLOR} />
                    </TouchableOpacity>
                </View>
            </Animated.View>
            <View style={[styles.contentContainer, styles.shadow]}>
                <View style={styles.sentenceContainer}>
                    <View style={{
                        display: translationVisible ? "visible": "none",
                        ...styles.translatedSentence
                        }}>
                        <Text style={styles.mainText}>{item.translated_sentence}</Text>
                    </View>
                    <View style={{
                        display: translationVisible ? "none": "visible",
                        ...styles.realSentence
                        }}>
                        {sentenceComponents}
                    </View>
                    
                </View>
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
                    <FontAwesome name="repeat" size={25} color={constants.BLACK} />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.nextButton}
                    onPress={() => changeSentence()}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome name="arrow-right" size={25} color={constants.TERTIARYCOLOR} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.speakButton}
                    onPress={() => {speak()}}
                    >
                    <FontAwesome name="comment" size={25} color={constants.BLACK} />
                </TouchableOpacity>
            </View>
            <Animated.View style={[styles.filterPopupContainer, { top: filterPopupAnimation }]}>
                <Text style={styles.filterPopupHeader}>Filter Sentences</Text>
                <View style={[styles.checkBoxContainer, styles.shadow]}>
                    <CheckBox initiallySelected={false} size={30} />
                    <Text style={styles.checkBoxLabel}>1000 most common words</Text>
                </View>
                <View style={[styles.checkBoxContainer, styles.shadow]}>
                    <CheckBox initiallySelected={false} size={30} />
                    <Text style={styles.checkBoxLabel}>2000 most common words</Text>
                </View>
                <View style={[styles.checkBoxContainer, styles.shadow]}>
                    <CheckBox initiallySelected={false} size={30} />
                    <Text style={styles.checkBoxLabel}>5000 most common words</Text>
                </View>
                <View style={[styles.checkBoxContainer, styles.shadow]}>
                    <CheckBox initiallySelected={false} size={30} />
                    <Text style={styles.checkBoxLabel}>Art and culture</Text>
                </View>
                <View style={[styles.checkBoxContainer, styles.shadow]}>
                    <CheckBox initiallySelected={false} size={30} />
                    <Text style={styles.checkBoxLabel}>Technology</Text>
                </View>
                <View style={[styles.checkBoxContainer, styles.shadow]}>
                    <CheckBox initiallySelected={false} size={30} />
                    <Text style={styles.checkBoxLabel}>Fashion</Text>
                </View>
                <View style={[styles.checkBoxContainer, styles.shadow]}>
                    <CheckBox initiallySelected={false} size={30} />
                    <Text style={styles.checkBoxLabel}>Politics</Text>
                </View>
                <View style={[styles.checkBoxContainer, styles.shadow]}>
                    <CheckBox initiallySelected={false} size={30} />
                    <Text style={styles.checkBoxLabel}>Finance</Text>
                </View>
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
        //backgroundColor: constants.SECONDARYCOLOR,
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
        width: 30,
        height: 10,
        backgroundColor: constants.PRIMARYCOLOR,
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
        borderRadius: 10,
        //elevation: 5
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
        marginBottom: 120
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