import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, findNodeHandle, UIManager } from "react-native";
import { useState, useEffect, useRef, useContext } from "react";
import * as Speech from "expo-speech";
import UserContext from "../../../contexts/UserContext";
import * as constants from "../../../constants";
import client from "../../../utils/axios";
import { capitalizeFirstLetter } from "../../../utils/text";

interface IFrequencyBar {
    frequency_rank: number
}

const FrequencyBar = ({ frequency_rank }: IFrequencyBar) => {
    
    // Assign frequency score between 1 and 5
    let value = frequency_rank < 5000 ? Math.ceil(frequency_rank/1000) : 5
    let labels = ['Very Common', 'Common', 'Less Common', 'Rare', 'Very Rare']
    let colors = ['#008000', '#ADFF2F', '#FFFF00O', '#FFA500', '#FF0000']

    return (
        <View style={styles.frequencyBarContainer}>
            <View style={{
                backgroundColor: colors[value - 1],
                ...styles.frequencyBar
                }}>
            </View>
            <Text style={styles.frequencyBarText}>{labels[value - 1]}</Text>
        </View>
    );
}

// TODO: This should be moved to an interface folder and imported
interface IWordData {
    id: number,
    rank: number,
    word: string,
    frequency: number,
    user_knows: boolean
}

interface IWordProps {
    word: string;
    wordData: IWordData;
    isFirstWord: boolean;
    screenWidth: number,
    index: number;
}

export default function Word ({word, wordData, isFirstWord, screenWidth, index}: IWordProps) {

    const { currentUser, currentLanguage } = useContext(UserContext);

    const wordRef = useRef(null);
    
    const [textColor, setTextColor] = useState(wordData.user_knows ? constants.PRIMARYCOLOR : constants.BLACK);
    // Temps écoulé depuis la dérnière fois qu'on a tapé sur le mot. Initialiser à 0 millisecondes
    const [lastPress, setLastPress] = useState(0);
    const [wordTranslationVisible, setWordTranslationVisible] = useState(false);
    const [pressedOnce, _setPressedOnce] = useState(false);

    const [wordWidth, setWordWidth] = useState(0);
    const [infoBoxXAdjust,  setInfoBoxXAdjust] = useState(0);

    let infoBoxWidth = 300;

    // This is super messy but it's the only way I could find to achieve this behaviour
    const pressedOnceRef = useRef(pressedOnce);

    const setPressedOnce = (value: boolean) => {
      pressedOnceRef.current = value;
      _setPressedOnce(value);
    };

    interface ICalculateXPositionAdjust {
        wordXCentroid: number,
        margin: number
    }
    const calculateXPositionAdjust = ({ wordXCentroid, margin }: ICalculateXPositionAdjust) => {
        //Amount X coordinate of info box should be adjusted to ensure it stays on the screen

        const halfInfoBoxWidth = infoBoxWidth / 2;

        if (wordXCentroid + halfInfoBoxWidth + margin > screenWidth) {
            return -((wordXCentroid + halfInfoBoxWidth) - screenWidth) - margin;

        } else if (wordXCentroid - halfInfoBoxWidth - margin < 0) {
            return -(wordXCentroid - halfInfoBoxWidth) + margin;
        }

        return 0;
    }

    // setTimeout rend un identifiant numérique unique
    let tapDelayTimeout: TimeOut;
    let definitionDisplayTimeout: TimeOut;

    useEffect(() => {
        const handle = findNodeHandle(wordRef.current);
        UIManager.measure(handle, (x, y, w, h, pageX, pageY) => {
            const wordXCentroid = pageX + (w / 2);
            setWordWidth(w);
            setInfoBoxXAdjust(
                calculateXPositionAdjust({
                    wordXCentroid:wordXCentroid,
                    margin: 10 
                })
            );
        });
    }, []);
  
    const handlePress = () => {

        const currentTime = new Date().getTime();

        // L'utilisateur a tapé deux fois
        if (currentTime - lastPress < constants.DOUBLETAPDELAY) {
            
            client.post(
                'api/users/' + currentUser.user_id + '/toggleknownword/' + wordData.word
            ).then(function(res) {
            }).catch(function(e) {
                console.log(e.response.data)
            });
            
            // Basculer entre deux couleurs selon si le mot a déjà été ajouté au dictionnaire
            setTextColor(
                textColor === constants.BLACK
                ? constants.PRIMARYCOLOR
                : constants.BLACK
            );

            setLastPress(0);
            setPressedOnce(false);
            setWordTranslationVisible(false);

            // Supprimer les timeOut q'on a initialisés lors de la première tape pour ne
            // plus afficher la traduction
            clearTimeout(tapDelayTimeout);
            clearTimeout(definitionDisplayTimeout);

        } else { // C'est la première fois que l'utilisateur tape le mot

            // Le timeOut attend la fin de la fenêtre où l'utilisateur pourrait taper une deuxième fois
            // avant d'fficher la traduction pendant la période choisie.
            setPressedOnce(true);

            // WordData.word contains the full word
            Speech.speak(wordData.word, {language: currentLanguage})
            
            tapDelayTimeout = setTimeout(() => {

                // Si l'utilisateur a tape deux fois le timeout lastPress sera remis a zero au moment que
                // ce timeout va s'activer, et pressedOnce sera faux. Dans ce cas, on ne veut plus afficher
                // la traduction
                if (pressedOnceRef.current) {
                    setWordTranslationVisible(true);
                };

                setPressedOnce(false);

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
            {wordTranslationVisible && (
                <View style={{
                    width: infoBoxWidth,
                    marginLeft: (wordWidth-infoBoxWidth)/2 + infoBoxXAdjust,
                    ...styles.infoBox
                    }}>
                    <Text style={styles.translationText}>
                        {capitalizeFirstLetter(wordData.word)} - Translation
                    </Text>
                    <FrequencyBar frequency_rank={wordData.rank} />
                </View>
            )}
            <TouchableOpacity
                activeOpacity={1}
                key={index}
                onPress={() => handlePress()}>
                <Text
                    style={{...styles.mainText, color: textColor}}
                    ref={wordRef}
                    >
                    {isFirstWord ? capitalizeFirstLetter(word) : word}
                </Text>
            </TouchableOpacity>
        </View>
    );
  };

  const styles= StyleSheet.create({

    // FrequencyBar
    frequencyBarContainer: {
        flexDirection: 'row'
    },
    frequencyBar: {
        borderRadius: 5,
        padding: 5,
        marginRight: 5,
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: constants.TERTIARYCOLOR
    },
    frequencyBarText: {
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.TERTIARYCOLOR,
        fontSize: constants.CONTENTFONTSIZE
    },
    
    // Word
    mainText: {
        fontSize: constants.H1FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        //textAlign: "center"
    },
    infoBox: {
        backgroundColor: constants.PRIMARYCOLOR,
        height: 80,
        borderRadius: 20,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
        top: -80
    },
    translationText: {
        fontSize: constants.H1FONTSIZE - 8,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.TERTIARYCOLOR,
        marginBottom: 10
    },
    frequencyScoreText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILY,
        color: constants.TERTIARYCOLOR
    }
});