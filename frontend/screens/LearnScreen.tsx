import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import { useEffect, useState } from "react"
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { FontAwesome } from '@expo/vector-icons'
import * as constants from "../constants"

const sentences = [
    "привет! я ира, и это мой канал “о русском по-русски”",
    "сегодня в этом видео мы будем учиться разговаривать с продавцом в магазине, а именно в магазине, где вы хотите купить одежду или обувь",
    "если эта тема вам интересна, продолжайте смотреть видео",
    "итак, давайте посмотрим с вами на первый вопрос, на который мы научимся отвечать: 'что вам нужно?' когда вы приходите в магазин с одеждой или с обувью, вам нужно объяснить продавцу, что вам нужно",
    "так читаем дальше",
    "здесь будет диалог уже в примерочной",
    "вам подошли платья? – первое мне велико"
]

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
    const [translationVisible, setTranslationVisible] = useState(false);

    // setTimeout rend un identifiant numérique unique
    let tapDelayTimeout;
    let definitionDisplayTimeout;
  
    const handlePress = () => {

        const currentTime = new Date().getTime();

        // L'utilisateur a tapé deux fois
        if (currentTime - lastPress < constants.DOUBLETAPDELAY) {

            // Basculer entre deux couleurs selon si le mot a déjà été ajouté au dictionnaire
            setTextColor(textColor === constants.PRIMARYCOLOR ? constants.OFFWHITE : constants.PRIMARYCOLOR);

            setTranslationVisible(false);

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
                setTranslationVisible(true);
            }, constants.DOUBLETAPDELAY);

            // setTimeout n'empêche pas la prochaine partie du code de s'éxécuter pendant le temps
            // d'attente, même si javascript n'utilise q'un seul thread
            definitionDisplayTimeout = setTimeout(() => {
                setTranslationVisible(false);
            }, constants.TRANSLATIONDISPLAYTIME);

        }

        setLastPress(currentTime);

    };
  
    return (
        <View>
            <>
            {translationVisible && (
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

    useEffect(() =>{
        console.log("Rendering Learnscreen")
    }, [])

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

    const [sentence, setSentence] = useState(sentences[0]);

    const changeSentence = () => {

        const randomIndex = Math.floor(Math.random() * sentences.length);

        const newSentence = sentences[randomIndex];

        setSentence(newSentence);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity activeOpacity={1} style={styles.filterButton}>
                    <FontAwesome name="filter" size={25} color={constants.SECONDARYCOLOR} />
                </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.sentenceContainer}>
                    {splitSentence(sentence).map((word, index) => (
                        <>
                            {word === " " && (
                                <Text style={{...styles.mainText, color: constants.PRIMARYCOLOR,}} key={index}>{word}</Text>
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
            <TouchableOpacity
                activeOpacity={1}
                style={{...styles.nextButton, marginBottom: 120}}
                onPress={() => changeSentence()}
            >
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <FontAwesome name="arrow-right" size={25} color={constants.OFFWHITE} />
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

/*
export default function LearnScreen({navigation}: NativeStackHeaderProps) {

    const [sentences, setSentences] = useState('');
    
    useEffect(() =>{
        fetchData();
    }, [])

    const fetchData = async() => {
        //const response = await fetch("http://127.0.0.1:8000/api/rusentences/");
        const response = await fetch("http://192.168.1.242:8000/api/rusentences");
        const data = await response.json();
        setSentences(data);
        if (data.length > 0) {
            setSentence(data[0]);
        }
    }
    
    const [sentence, setSentence] = useState(sentences[0]);

    const changeSentence = () => {
        const randomIndex = Math.floor(Math.random() * sentences.length);
        setSentence(sentences[randomIndex]);
    };
*/

const styles= StyleSheet.create({
    container: {
        flex: 1,
        //borderWidth: 1
    },
    topContainer: {
        marginTop: 60,
        //borderWidth: 1
    },
    contentContainer: {
        flexDirection: "column",
        justifyContent: "center",
        margin: 15,
        flexWrap: "wrap",
        flex: 1,
        //borderWidth: 1
    },
    filterButton: {
        backgroundColor: constants.PRIMARYCOLOR,
        height: 50,
        width: 50,
        borderRadius: 25,
        flexDirection: 'column',
        marginTop: 0,
        marginRight: 15,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sentenceContainer: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap"
    },
    mainText: {
        fontSize: constants.H1FONTSIZE,
        fontWeight: "bold"
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
    nextButton: {
        backgroundColor: constants.PRIMARYCOLOR,
        paddingTop: 11,
        margin: 10,
        width: 100,
        height: 50,
        borderRadius: 60,
        marginRight: "auto",
        marginLeft: "auto",
        textAlign: "center"
    }
});