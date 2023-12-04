import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, Image, Animated, Dimensions } from "react-native";
import { useState, useRef, useContext } from "react";
import * as Speech from 'expo-speech';
import UserContext from '../contexts/UserContext';
import * as constants from "../constants";
import client from "../utils/axios";
import { capitalizeFirstLetter } from "../utils/text";

interface IWordProps {
    word: string;
    wordData: object;
    isFirstWord: string;
    index: number;
}
export default function LearnScreenWord ({word, wordData, isFirstWord, index}: IWordProps) {

    const { currentUser } = useContext(UserContext);
    const wordRef = useRef(null);
    
    const [textColor, setTextColor] = useState(wordData.user_knows ? constants.PRIMARYCOLOR : constants.BLACK);
    // Temps écoulé depuis la dérnière fois qu'on a tapé sur le mot
    // Initialiser à 0 millisecondes. Trouver une meilleure solution qui necessite moins
    // de variables
    const [lastPress, setLastPress] = useState(0);
    const [wordTranslationVisible, setWordTranslationVisible] = useState(false);

    const [pressedOnce, _setPressedOnce] = useState(false);

    // This seems like a ridiculously convoluted approach but it's the only
    // way I could find to achieve this behaviour using react's conventions
    const pressedOnceRef = useRef(pressedOnce);

    const setPressedOnce = (value) => {
      pressedOnceRef.current = value;
      _setPressedOnce(value);
    };

    // setTimeout rend un identifiant numérique unique
    let tapDelayTimeout;
    let definitionDisplayTimeout;

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
            
            client.post(
                'api/users/' + currentUser.user_id + '/toggleknownword/' + word
            ).then(function(res) {  
                console.log('word changed in database');
            }).catch(function(e) {
                console.log(e.response.data)
            });
            
            // Basculer entre deux couleurs selon si le mot a déjà été ajouté au dictionnaire
            setTextColor(textColor === constants.BLACK ? constants.PRIMARYCOLOR : constants.BLACK);

            setLastPress(0);
            setPressedOnce(false);
            setWordTranslationVisible(false);

            // Supprimer les timeOut q'on a initialisés lors de la première tape pour ne
            // plus afficher la traduction
            clearTimeout(tapDelayTimeout);
            clearTimeout(definitionDisplayTimeout);

        } else { // C'est la première fois que l'utilisateur a tapé le mot

            // Le timeOut attend la fin de la fenêtre où l'utilisateur pourrait taper une deuxième fois
            // avant d'fficher la traduction pendant la période choisie.
            setPressedOnce(true);

            Speech.speak(word, {language: 'fr'})
            
            tapDelayTimeout = setTimeout(() => {

                // Si l'utilisateur a tape deux fois le timeout lastPress sera remis a zero au moment que
                // ce timeout va s'activer, et pressedOnce sera faux. Dans ce cas, on ne veut plus afficher
                // la traduction
                if (pressedOnceRef.current) {
                    console.log(pressedOnce);
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
            <>
            {wordTranslationVisible && (
                <View style={styles.infoBox}>
                    <Text style={styles.translationText}>Translation</Text>
                    <Text style={styles.frequencyScoreText}>Frequency rank: {wordData.rank}</Text>
                </View>
            )}
            </>
            <TouchableOpacity activeOpacity={1} key={index} onPress={() => handlePress()}>
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
    mainText: {
        fontSize: constants.H1FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        textAlign: "center"
    },
    infoBox: {
        backgroundColor: constants.PRIMARYCOLOR,
        width: 250,
        height: 80,
        marginLeft: -100,
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
        color: constants.TERTIARYCOLOR
    },
    frequencyScoreText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILY,
        color: constants.TERTIARYCOLOR
    }
});