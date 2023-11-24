import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, Image, Animated, Dimensions } from "react-native";
import { useEffect, useState, useRef } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesome } from '@expo/vector-icons';
import CheckBox from "../components/CheckBox";
import LearnScreenWord from "../components/LearnScreenWord";
import * as constants from "../constants";
import client from "../utils/axios";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

const windowHeight = Dimensions.get('window').height;

interface WordProps {
    word: string;
    index: number;
    initialColor: string;
}

const Word: React.FC<WordProps> = ({ word, index, initialColor }) => {

    const wordRef = useRef(null);
    
    const [textColor, setTextColor] = useState(constants.BLACK);
    // Temps écoulé depuis la dérnière fois qu'on a tapé sur le mot
    // Initialiser à 0 millisecondes
    const [lastPress, setLastPress] = useState(0);
    const [wordTranslationVisible, setWordTranslationVisible] = useState(false);

    // setTimeout rend un identifiant numérique unique
    let tapDelayTimeout;
    let definitionDisplayTimeout

    // on n'a plus besoin de trouver ces coordonnes car position: absolute
    // est par rapport a l'element qui contient le mot et pas a l'ecran
    /*useEffect(() => {
        const handle = findNodeHandle(wordRef.current);
        UIManager.measure(handle, (x, y, w, h, pageX, pageY) => {
            setXCoord(pageX);
            setYCoord(pageY);
            setWidth(w);
            setHeight(h);
        });
    }, []);
    */
  
    const handlePress = () => {

        const currentTime = new Date().getTime();

        // L'utilisateur a tapé deux fois
        if (currentTime - lastPress < constants.DOUBLETAPDELAY) {

            // Basculer entre deux couleurs selon si le mot a déjà été ajouté au dictionnaire
            setTextColor(textColor === constants.BLACK ? constants.PRIMARYCOLOR : constants.BLACK);

            setLastPress(0);
            setWordTranslationVisible(false);

            // Supprimer les timeOut q'on a initialisés lors de la première tape pour ne
            // plus afficher la traduction
            clearTimeout(tapDelayTimeout);
            clearTimeout(definitionDisplayTimeout);

        } else { // C'est la première fois que l'utilisateur a tapé le mot
            
            // Vérifier que DOUBLETAPDELAY est términé avant d'afficher la traduction
            
            // Basculer entre traduction visible/pas visible
            //setTranslationVisible(translationVisible ? false : true);

            // Le timeOut attend la fin de la fenêtre où l'utilisateur pourrait taper une deuxième fois
            // avant d'fficher la traduction pendant la période choisie.
            tapDelayTimeout = setTimeout(() => {

                // Si l'utilisateur a tape deux fois le timeout lastPress sera remis a zero au moment que
                // ce timeout va s'activer. Dans ce cas, on ne vaut plus montrer la traduction
                if (lastPress != 0) {
                    setWordTranslationVisible(true);
                };

            }, constants.DOUBLETAPDELAY);

            // setTimeout n'empêche pas la prochaine partie du code de s'éxécuter pendant le temps
            // d'attente, même si javascript n'utilise q'un seul thread
            definitionDisplayTimeout = setTimeout(() => {
                setWordTranslationVisible(false);
            }, constants.TRANSLATIONDISPLAYTIME);

        }

        setLastPress(currentTime);

    };
  
    return (
        <View>
            <>
            {wordTranslationVisible && (
                <View style={styles.translationBox}>
                    <Text style={styles.translationText}>Translation</Text>
                </View>
            )}
            </>
            <TouchableOpacity activeOpacity={1} key={index} onPress={() => handlePress()}>
                <Text style={{...styles.mainText, color: textColor}} ref={wordRef}>{word}</Text>
            </TouchableOpacity>
        </View>
    );
  };

export default function LearnScreen({navigation}: NativeStackHeaderProps) {

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

    // Need to set new sentence components when item has been updated
    useEffect(() => {
        setSentenceComponents(createSentenceComponents());
    }, [item]);

    const fetchData = async() => {
        client.get("/api/frsentences", { withCredentials: true })
        .then(function(res) {
          setItems(res.data);
          changeSentence();
        })
        .catch(function(error) {
        });

    }

    const changeSentence = () => {

        const randomIndex = Math.floor(Math.random() * items.length);
        const newItem = items[randomIndex];

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

    // Split sentence by word boundaries and return either text or a LearnScreenWord if it is to be clickable
    function createSentenceComponents() {
        
        if (item.sentence.length == 0) {
            return <Text></Text>;
        };
        //The sentence is split by matching either strings of alphanumeric (inc. special french chars) or strings of non-alphanumeric chars
        const splitSentence = item.sentence.match(/([a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüÛÜçÇîÎïÏ]+|[^a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüÛÜçÇîÎïÏ]+)/g);
    
        const sentenceComponents = splitSentence.map((word, index) => {

            //const words = JSON.parse(item.words.replace(/'/g, '"'));
            
            if (item.words.includes(word.toLowerCase())) {
                return <LearnScreenWord
                        word={word}
                        initialColor={constants.BLACK}
                        index={index}
                        key={`${item.id}-${index}`}
                    />;
            } else {
                return <Text style={{ color: constants.GREY, ...styles.mainText }} key={index}>{word}</Text>;
            }
            });

        return sentenceComponents;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
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
        marginTop: 60
    },
    topButtonsContainer: {
        flexDirection: "row",
        alignSelf: 'flex-end',
        marginRight: 20
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