import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, Image, Animated, Dimensions } from "react-native";
import { useEffect, useState, useRef, useContext } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesome } from '@expo/vector-icons';
import CheckBox from "../components/CheckBox";
import LearnScreenWord from "../components/LearnScreenWord";
import UserContext from '../contexts/UserContext';
import * as constants from "../constants";
import client from "../utils/axios";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

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
    const [filterPopupVisible, setFilterPopupVisible] = useState(false);
    const [sentenceComponents, setSentenceComponents] = useState();
    
    const slideAnimation = useRef(new Animated.Value(windowHeight)).current;
    
    useEffect(() => {
        console.log("Rendering Learnscreen");
        fetchData();
    }, [])

    // A chaque fois q'on recois un nouveau groupe de phrases,
    // il faut mettre a jour la phrase affiche sur l'ecran
    useEffect(() => {
        if (items.length > 0) { setItem(items[0]); }
    }, [items]);

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

    const togglePopup = () => {
        setFilterPopupVisible(!filterPopupVisible);
        Animated.timing(slideAnimation, {
        toValue: filterPopupVisible ? windowHeight : 0.2 * windowHeight,
        duration: 400,
        useNativeDriver: false,
        }).start();
    };

    useEffect(() => {
        // Split sentence by word boundaries and return either text or a LearnScreenWord if it is to be clickable
        const createSentenceComponents = async() => {
            if (item.sentence.length == 0) {
                return [<Text></Text>];
            }

            console.log('words object type is:' + typeof(item.words));

            const splitSentence = item.sentence.match(/([a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüÛÜçÇîÎïÏ]+|[^a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüÛÜçÇîÎïÏ]+)/g);

            const sentenceComponents = [];

            for (let i = 0; i < splitSentence.length; i++) {
                let word = splitSentence[i].toLowerCase();

                if (item.words.includes(word)) {
                    try {
                        //TODO: This is a completely ridiculous way to get the data, making a separate API
                        // request for each individual word, each time I render a sentence. Just doing it
                        // for proof-of-concept but very important to fix this ASAP.
                        const res = await client.get("/api/word/" + word, { withCredentials: true });
                        sentenceComponents.push(
                            <LearnScreenWord
                                word={word}
                                wordData={res.data}
                                initialColor={constants.BLACK}
                                index={i}
                                key={`${item.id}-${i}`}
                            />
                        );
                    } catch (error) {
                        sentenceComponents.push(
                            <Text style={{ color: constants.GREY, ...styles.mainText }} key={i}>{word}</Text>
                        );
                    }
                } else {
                    sentenceComponents.push(
                        <Text style={{ color: constants.GREY, ...styles.mainText }} key={i}>{word}</Text>
                    );
                }
            }

            return sentenceComponents;
        };

        createSentenceComponents().then(components => {
            setSentenceComponents(components);
        });
    }, [item]);

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
                    <TouchableOpacity activeOpacity={1}>
                        <View style={styles.flagImageContainer}>
                            <Image
                                source={require("../assets/ru.png")}
                                style={styles.flagImage}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.filterButton}
                        onPress={() => { togglePopup() }}
                        >
                        <FontAwesome name="filter" size={25} color={constants.BLACK} />
                    </TouchableOpacity>
                </View>
            </View>
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
            </View>
            <Animated.View style={[styles.filterPopupContainer, { top: slideAnimation }]}>
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
        fontWeight: 'bold',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    topButtonsContainer: {
        flexDirection: "row",
        alignSelf: 'flex-end',
        //width: 'auto',
        marginLeft: 'auto',
    },
    contentContainer: {
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: constants.TERTIARYCOLOR,
        margin: 20,
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
        //borderWidth: 4,
        //borderColor: constants.SECONDARYCOLOR,
        overflow: "hidden",
        height: 50,
        width: 70,
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
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sentenceContainer: {
        width: "100%"
    },
    mainText: {
        fontSize: constants.H1FONTSIZE,
        fontWeight: "bold",
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
        marginRight: -70,
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
    filterPopupHeader: {
        fontSize: constants.H1FONTSIZE,
        textAlign: 'center',
        color: constants.BLACK,
        marginBottom: 10
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
        fontWeight: 'bold',
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