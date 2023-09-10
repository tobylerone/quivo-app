import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, Image } from "react-native"
import { useEffect, useState } from "react"
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { FontAwesome } from '@expo/vector-icons'
import * as constants from "../constants"

interface WordProps {
    word: string;
    index: number;
    initialColor: string;
}

const Word: React.FC<WordProps> = ({ word, index, initialColor }) => {

    const [textColor, setTextColor] = useState(constants.PRIMARYCOLOR);
    // Temps écoulé depuis la dérnière fois qu'on a tapé sur le mot
    // Initialiser à 0 millisecondes
    const [lastPress, setLastPress] = useState(0);
    const [wordTranslationVisible, setWordTranslationVisible] = useState(false);

    // setTimeout rend un identifiant numérique unique
    let tapDelayTimeout;
    let definitionDisplayTimeout
  
    const handlePress = () => {

        const currentTime = new Date().getTime();

        // L'utilisateur a tapé deux fois
        if (currentTime - lastPress < constants.DOUBLETAPDELAY) {

            // Basculer entre deux couleurs selon si le mot a déjà été ajouté au dictionnaire
            setTextColor(textColor === constants.PRIMARYCOLOR ? constants.OFFWHITE : constants.PRIMARYCOLOR);

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
                setWordTranslationVisible(true);
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
                <View style={styles.definitionBox}>
                    <Text style={styles.definitionText}>Definition</Text>
                </View>
            )}
            </>
            <TouchableOpacity activeOpacity={1} key={index} onPress={() => handlePress()}>
                <Text style={{...styles.mainText, color: textColor}}>{word}</Text>
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
            'difficulty_score': 1
        }]);
    
    const [item, setItem] = useState(items[0]);

    const [translationVisible, setTranslationVisible] = useState(false)
    
    useEffect(() =>{
        console.log("Rendering Learnscreen");
        fetchData();
    }, [])

    useEffect(() => {
        
        // A chaque fois q'on recois un nouveau groupe de phrases,
        // il faut mettre a jour la phrase affiche sur l'ecran
        if (items.length > 0) { setItem(items[0]); }
    }, [items]);

    const fetchData = async() => {
        //const response = await fetch("https://10.0.2.2:8000/api/frsentences/");
        const response = await fetch("http://192.168.1.232:8000/api/frsentences/");
        const data = await response.json();

        //setSentences(data.map(item => item.sentence));
        setItems(data);

    }

    function splitSentence(input: string): string[] {
        const parts: string[] = input.split(/(\s+)/);
      
        const result: string[] = parts.map(part => {
          // Vérifier que l'éspace n'en contient pas plusieurs
          if (/\s+/.test(part)) {
            return " ";
          } else {
            return part;
          }
        });
      
        return parts;
    }

    const changeSentence = () => {

        const randomIndex = Math.floor(Math.random() * items.length);

        const newItem = items[randomIndex];

        setItem(newItem);
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
                    <TouchableOpacity activeOpacity={1} style={styles.filterButton}>
                        <FontAwesome name="filter" size={25} color={constants.SECONDARYCOLOR} />
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
                        {splitSentence(item.sentence).map((word, index) => (
                            <>
                                {word === " " && (
                                    <Text style={styles.mainText} key={index}>{word}</Text>
                                )}
                                {word !== " " && (
                                    <Word
                                        word={word}
                                        initialColor={constants.PRIMARYCOLOR}
                                        index={index}
                                    />
                                )}
                            </>
                        ))}
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
                    <FontAwesome name="language" size={25} color={constants.SECONDARYCOLOR} />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.nextButton}
                    onPress={() => changeSentence()}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome name="arrow-right" size={25} color={constants.OFFWHITE} />
                    </View>
                </TouchableOpacity>
            </View>
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
        margin: 20,
        padding: 15,
        flexWrap: "wrap",
        flex: 1
    },
    bottomContainer: {
        flexDirection: "row",
        height: 50,
        marginBottom: 120
    },
    flagImageContainer: {
        borderRadius: 10,
        borderWidth: 4,
        borderColor: constants.PRIMARYCOLOR,
        overflow: "hidden",
        height: 50,
        width: 70,
    },
    flagImage: {
        width: "100%",
        height: "100%",
    },
    filterButton: {
        backgroundColor: constants.PRIMARYCOLOR,
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
    realSentence: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap"

    },
    translatedSentence: {
        width: "100%"
    },
    mainText: {
        fontSize: constants.H1FONTSIZE,
        fontWeight: "bold",
        textAlign: "center",
        color: constants.PRIMARYCOLOR
    },
    definitionBox: {
        backgroundColor: constants.PRIMARYCOLOR,
        height: 30,
        borderRadius: 20,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    definitionText: {
        fontSize: constants.H1FONTSIZE - 8,
        fontWeight: "bold",
        color: constants.OFFWHITE
    },
    translateButton: {
        backgroundColor: constants.PRIMARYCOLOR,
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
        borderRadius: 60,
        marginRight: "auto",
        marginLeft: "auto",
        textAlign: "center"
    },
    shadow: {
        shadowColor: constants.PRIMARYCOLOR,
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