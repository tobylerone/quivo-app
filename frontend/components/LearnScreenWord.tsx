import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, Image, Animated, Dimensions } from "react-native";
import { useState, useRef } from "react";
import * as constants from "../constants";

interface IWordProps {
    word: string;
    index: number;
    initialColor: string;
}
export default function LearnScreenWord ({word, index, initialColor}: IWordProps) {

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

  const styles= StyleSheet.create({
    mainText: {
        fontSize: constants.H1FONTSIZE,
        fontWeight: "bold",
        textAlign: "center"
    },
    translationBox: {
        backgroundColor: constants.PRIMARYCOLOR,
        width: 200,
        height: 50,
        marginLeft: -100,
        borderRadius: 20,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        //zIndex: 1,
        top: -50
    },
    translationText: {
        fontSize: constants.H1FONTSIZE - 8,
        fontWeight: "bold",
        color: constants.TERTIARYCOLOR
    }
});