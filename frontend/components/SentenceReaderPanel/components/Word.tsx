import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, findNodeHandle, UIManager } from "react-native";
import { useState, useEffect, useRef, useContext } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { transliterate } from 'transliteration';
//import Sound from 'react-native-sound';
import { Audio } from 'expo-av';

// Contexts
import UserContext from "../../../contexts/UserContext";
// Constants
import * as constants from "../../../constants";
// Utils
import client from "../../../utils/axios";
import { speak } from "../../../utils/text";
import { capitalizeFirstLetter } from "../../../utils/text";

interface IFrequencyBar {
    frequency_rank: number
}

const FrequencyBar = ({ frequency_rank }: IFrequencyBar) => {
    
    // Assign frequency score between 1 and 5
    let value = frequency_rank < 5000 ? Math.ceil(frequency_rank/1000) : 5;
    let labels = ['Very Common', 'Common', 'Less Common', 'Rare', 'Very Rare'];
    let colors = ['#008000', '#ADFF2F', '#FFFF00O', '#FFA500', '#FF0000'];

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
    navigation: any,
    word: string,
    wordData: IWordData,
    textColor: string,
    textBackgroundColor: string,
    onPress: Function,
    isFirstWord: boolean,
    screenWidth: number,
    index: number,
    key: string
}

export default function Word ({navigation, word, wordData, textColor, textBackgroundColor, onPress, isFirstWord, screenWidth, index, key}: IWordProps) {

    const { currentUser, currentLanguageCode, setKnownWords, dailyWordCount, setDailyWordCount, streakLimitReached } = useContext(UserContext);

    const wordRef = useRef(null);
    //const [textColor, setTextColor] = useState(wordData.user_knows ? constants.PRIMARYCOLOR : constants.BLACK);
    // Temps écoulé depuis la dérnière fois qu'on a tapé sur le mot. Initialiser à 0 millisecondes
    const [lastPress, setLastPress] = useState(0);
    const [wordTranslationVisible, setWordTranslationVisible] = useState(false);
    const [pressedOnce, _setPressedOnce] = useState(false);
    const [correctSound, setCorrectSound] = useState();
    const [wordWidth, setWordWidth] = useState(0);
    const [infoBoxXAdjust,  setInfoBoxXAdjust] = useState(0);

    let infoBoxWidth = 300;

    // This is super messy but it's the only way I could find to achieve this behaviour
    const pressedOnceRef = useRef(pressedOnce);

    const setPressedOnce = (value: boolean) => {
      pressedOnceRef.current = value;
      _setPressedOnce(value);
    };

    // TODO: Make correctSound into custom hook
    useEffect(() => {
        return correctSound
          ? () => {
                // Unload sound
                correctSound.unloadAsync();
            }
          : undefined;
      }, [correctSound]);

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

    async function playCorrectSound() {
        // Load sound
        const { sound } = await Audio.Sound.createAsync( require('../../../assets/audio/correct.mp3')
        );
        setCorrectSound(correctSound);
        await sound.playAsync();
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
            if (dailyWordCount < constants.MAXDAILYWORDS) {
                // Basculer entre deux couleurs selon si le mot a déjà été ajouté au dictionnaire
                //setTextColor(
                //    textColor === constants.BLACK
                //    ? constants.PRIMARYCOLOR
                //    : constants.BLACK
                //);
                onPress(word);
                playCorrectSound();

                client.post(
                    'api/users/' + currentUser.user_id + '/toggleknownword/' + wordData.word
                ).then(function(res) {
                    // Update local word count record accordingly
                    if (res.data.word_added) {
                        // I need a function that does all this together
                        setKnownWords(prevKnownWords => prevKnownWords + 1)
                        setDailyWordCount(prevDailyWordCount => prevDailyWordCount + 1)
                    } else {
                        setKnownWords(prevKnownWords => prevKnownWords - 1)
                        setDailyWordCount(prevDailyWordCount => prevDailyWordCount - 1)
                    }
                }).catch(function(e) {
                    console.log(e.response.data)
                });
            } else {
                navigation.navigate('MaxWordsReached');
            }

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
            speak(wordData.word, currentLanguageCode);
            
            tapDelayTimeout = setTimeout(() => {

                // Si l'utilisateur a tape deux fois le timeout lastPress sera remis a zero au moment que
                // ce timeout va s'activer, et pressedOnce sera faux. Dans ce cas, on ne veut plus afficher
                // la traduction
                if (pressedOnceRef.current) {
                    setWordTranslationVisible(true);
                };

                setPressedOnce(false);

            }, constants.DOUBLETAPDELAY);

            definitionDisplayTimeout = setTimeout(() => {
                setWordTranslationVisible(false);
            }, constants.TRANSLATIONDISPLAYTIME);

        }

        setLastPress(currentTime);

    }
    return (
        <View>
            {wordTranslationVisible && (<>
                <View style={{
                    width: infoBoxWidth,
                    marginLeft: (wordWidth-infoBoxWidth)/2 + infoBoxXAdjust,
                    ...styles.infoBoxShadow
                    }}></View>
                <View style={{
                    width: infoBoxWidth,
                    marginLeft: (wordWidth-infoBoxWidth)/2 + infoBoxXAdjust,
                    ...styles.infoBox
                    }}>
                    <View style={styles.translationContainer}>
                        <View style={styles.targetLanguageContainer}>
                            {currentLanguageCode === 'ru' &&
                                <Text style={styles.transliterationText}>{capitalizeFirstLetter(transliterate(wordData.word))}</Text>
                            }
                            <Text style={styles.translationText}>
                                {capitalizeFirstLetter(wordData.word)}:
                            </Text>
                        </View>
                        <Text style={styles.translationText}>Translation</Text>
                    </View>
                    <View style={styles.additionalDataContainer}>
                        <FrequencyBar frequency_rank={wordData.rank} />
                    </View>
                </View>
            </>)}
            <TouchableOpacity
                activeOpacity={1}
                key={index}
                onPress={() => handlePress()}
                >
                <Text
                    style={{
                        ...styles.mainText,
                        backgroundColor: textBackgroundColor,
                        borderRadius: 15,
                        color: textColor
                    }}
                    ref={wordRef}
                    >
                    {isFirstWord ? capitalizeFirstLetter(word) : word}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

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
        fontSize: constants.H1FONTSIZE + 7,
        fontFamily: constants.FONTFAMILYBOLD
    },
    infoBoxShadow: {
        backgroundColor: constants.PRIMARYCOLORSHADOW,
        height: 80,
        borderRadius: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -83
    },
    infoBox: {
        backgroundColor: constants.PRIMARYCOLOR,
        height: 80,
        borderRadius: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
        top: -90
    },
    translationContainer: {
        flexDirection: 'row',
    },
    translationText: {
        fontSize: constants.H1FONTSIZE - 10,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.TERTIARYCOLOR,
        marginTop: 'auto',
        marginBottom: 5,
        marginRight: 10
    },
    targetLanguageContainer: {
        flexDirection: 'column'
    },
    additionalDataContainer: {
        flexDirection: 'row',
        marginBottom: 10
    },
    transliterationText: {
        fontFamily: constants.FONTFAMILY,
        color: constants.GREEN,
        fontSize: constants.CONTENTFONTSIZE,
        marginRight: 'auto'
    },
    frequencyScoreText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILY,
        color: constants.TERTIARYCOLOR
    }
});