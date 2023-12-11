import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, Image, Animated, Dimensions, useWindowDimensions } from "react-native";
import { useEffect, useState, useRef, useContext } from "react";
import * as Speech from 'expo-speech';
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesome } from '@expo/vector-icons';
import CheckBox from "../../components/CheckBox";
import Word from "./components/Word";
import UserContext from '../../contexts/UserContext';
import * as constants from "../../constants";
import client from "../../utils/axios";
import { capitalizeFirstLetter } from "../../utils/text";

const windowHeight = Dimensions.get('window').height;

export default function LearnScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser } = useContext(UserContext);

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
    const [sentenceComponents, setSentenceComponents] = useState();
    
    const languagePopupAnimation = useRef(new Animated.Value(0)).current;
    const filterPopupAnimation = useRef(new Animated.Value(windowHeight)).current;

    const screenWidth = useWindowDimensions().width;
    
    useEffect(() => {
        console.log("Rendering Learnscreen");
        fetchData();
    }, [])

    // After updating items, set current item to first one in the list
    useEffect(() => {
        if (items.length > 0) { setItem(items[0]); }
    }, [items]);

    useEffect(() => {
        // Split sentence by word boundaries and return either text or a Word component if it is to be clickable
        createSentenceComponents().then(components => {
            setSentenceComponents(components);
        });
    }, [item]);

    const fetchData = async() => {
        client.get("/api/frsentences", { withCredentials: true })
        .then(function(res) {
            setItems(res.data);
            changeSentence();
        })
        .catch(function(error) {
        });
    };

    const changeSentence = () => {
        const randomIndex = Math.floor(Math.random() * items.length);
        let newItem = items[randomIndex];

        if (typeof newItem.words === 'string') {
            newItem = { ...newItem, words: JSON.parse(newItem.words) };
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
            let shortened_word_map = {
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

        console.log('words object type is:' + typeof(item.words));

        // Regex used to create word frequency set: \b(?:[Aa]ujourd\'hui|[Pp]resqu\'île|[Qq]uelqu\'un|[Dd]\'accord|[a-zA-ZéèêëÉÈÊËàâäÀÂÄôöÔÖûüÛÜçÇîÎïÏ]+)\b
        // Want to match into one of two categories: valid french words (using same regex as one shown above) and everything else
        const splitSentence = item.sentence.match(
            /(?:[Aa]ujourd\'hui|[Pp]resqu\'île|[Qq]uelqu\'un|[Dd]\'accord|-t-|[a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüÛÜçÇîÎïÏ]+|[^a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüÛÜçÇîÎïÏ]+)/g
            ) || [];
        const wordsData = await fetchWordsData()

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
            {language: 'fr'}
            );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.starBox}>
                    <View style={styles.starContainer}>
                        <FontAwesome name="star" size={30} color={constants.PRIMARYCOLOR} />
                    </View>
                    <Text style={styles.starCountText}>27</Text>
                    <View style={styles.starBarContainer}></View>
                </View>
                <View style={styles.topButtonsContainer}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { toggleLanguagePopup() }}
                        >
                        <View style={styles.flagImageContainer}>
                          <Image
                                source={require("../../assets/fr.png")}
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
            <Animated.View style={{ height: languagePopupAnimation, ...styles.languagePopupAnimatedContainer}}>
                <View style={{opacity: languagePopupVisible ? 1: 0, ...styles.languagePopupContainer}}>
                    <TouchableOpacity activeOpacity={1}>
                        <View style={{
                            ...styles.flagImageContainer,
                            ...styles.flagImageContainerPopup,
                            borderColor: constants.PRIMARYCOLOR
                            }}>
                            <Image
                                source={require("../../assets/es.png")}
                                style={styles.flagImage}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}>
                        <View style={{
                            ...styles.flagImageContainer,
                            ...styles.flagImageContainerPopup,
                            borderColor: constants.TERTIARYCOLOR
                        }}>
                            <Image
                                source={require("../../assets/fr.png")}
                                style={styles.flagImage}
                            />
                        </View>
                    </TouchableOpacity>
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
                        ...styles.translatedSentence,
                        display: translationVisible ? "visible": "none"
                        }}>
                        <Text style={styles.mainText}>{item.translated_sentence}</Text>
                    </View>
                    <View style={{
                        ...styles.realSentence,
                        display: translationVisible ? "none": "visible"
                        }}>
                        { sentenceComponents }
                    </View>
                    
                </View>
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
                    <CheckBox initiallySelected={true} size={30} />
                    <Text style={styles.checkBoxLabel}>1000 most common words</Text>
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
        flex: 1,
        //borderWidth: 1
    },
    topContainer: {
        marginTop: 60,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20
    },
    starBox: {
        flexDirection: 'row',
        backgroundColor: constants.SECONDARYCOLOR,
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
        marginBottom: 'auto',
    },
    topButtonsContainer: {
        flexDirection: "row",
        alignSelf: 'flex-end',
        //width: 'auto',
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
    flagImageContainer: {
        borderRadius: 10,
        marginRight: 10,
        //borderWidth: 4,
        //borderColor: constants.SECONDARYCOLOR,
        overflow: "hidden",
        height: 50,
        width: 70,
    },
    flagImageContainerPopup: {
        borderWidth: 3
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
    flagImage: {
        width: "100%",
        height: "100%",
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
        //marginRight: -70,
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
        //marginLeft: -70,
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