import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState, useContext } from "react";
import UserContext from '../../../contexts/UserContext';
import Slider from '@react-native-community/slider';
import * as constants from "../../../constants";

export default function SetKnownWordsPanel() {

    const { currentUser, currentLanguage } = useContext(UserContext);

    const exampleSentences = {
        'fr': 'Malgré la pluie, Marie a décidé de sortir pour acheter des légumes frais au marché local ce matin.',
        'de': 'Obwohl es regnet, gehen wir spazieren, weil wir die frische Luft und die Schönheit der Natur sehr genießen.'
    }

    const [knownWordsPerc, setKnownWordsPerc] = useState(50);
    const [sentenceComponents, setSentenceComponents] = useState();
    const [activeWordMask, setActiveWordMask] = useState([1,0,0,1,0,1,1,1,0,0,0,1,0,1,0,1,1,0,1,0,]);

    useEffect(() => {
        let components = formatSentence(exampleSentences[currentLanguage]);
        setSentenceComponents(components);
    }, [knownWordsPerc]);

    const formatSentence = (sentence: string) => {

        // Regex used to create word frequency set: \b(?:[Aa]ujourd\'hui|[Pp]resqu\'île|[Qq]uelqu\'un|[Dd]\'accord|[a-zA-ZéèêëÉÈÊËàâäÀÂÄôöÔÖûüÛÜçÇîÎïÏ]+)\b
        // Want to match into one of two categories: valid french words (using same regex as one shown above) and everything else
        const wordsRegex = {
            'fr': /(?:[Aa]ujourd\'hui|[Pp]resqu\'île|[Qq]uelqu\'un|[Dd]\'accord|-t-|[a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüÛÜçÇîÎïÏ]+)/g,
            'de': /(?:[a-zA-ZäöüÄÖÜß]+)/g
        }
        const inclusiveRegex = {
            'fr': /(?:[Aa]ujourd\'hui|[Pp]resqu\'île|[Qq]uelqu\'un|[Dd]\'accord|-t-|[a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüÛÜçÇîÎïÏ]+|[^a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüÛÜçÇîÎïÏ]+)/g,
            'de': /(?:[a-zA-ZäöüÄÖÜß]+|[^a-zA-ZäöüÄÖÜß])/g
        }
        
        const words = sentence.match(wordsRegex[currentLanguage]) || [];
        const splitSentence = sentence.match(inclusiveRegex[currentLanguage]) || [];

        const sentenceComponents = [];

        let wordIndex = 0;

        for (let i = 0; i < splitSentence.length; i++) {
            
            let substring = splitSentence[i]
            // Same as word unless in shortened_word_map
    
            if (words.includes(substring)) {
                let wordColor = activeWordMask[wordIndex] ? constants.PRIMARYCOLOR : constants.BLACK
                wordIndex++;
                sentenceComponents.push(<Text style={{ color: wordColor, ...styles.exampleSentenceText }} key={i}>{substring}</Text>);
            } else {
                sentenceComponents.push(<Text style={{ color: constants.GREY, ...styles.exampleSentenceText }} key={i}>{substring}</Text>);
            }
        };
        return sentenceComponents;

    }

    return (
    <View style={styles.mainContainer}>
        <View style={styles.sliderHeaderContainer}>
            <Text style={styles.sliderHeaderText}>Known Words Per Sentence</Text>
        </View>
        <Text style={styles.knownWordsPercText}>{knownWordsPerc}%</Text>
        <View style={styles.sliderContainer}>
            <Slider
                style={{height: 40, padding: 0, margin: 0}}
                minimumValue={20}
                maximumValue={80}
                value={knownWordsPerc}
                onValueChange={setKnownWordsPerc}
                step={10}
                minimumTrackTintColor={constants.PRIMARYCOLOR}
                maximumTrackTintColor={constants.GREY}
                thumbTintColor={constants.PRIMARYCOLOR}
            />
        </View>
        <View style={styles.exampleSentenceContainer}>
            <Text style={styles.exampleSentenceText}>
                {sentenceComponents}
            </Text>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: constants.SECONDARYCOLOR,
        //width: '100%',
        marginHorizontal: 25,
        padding: 10,
        borderRadius: 10
    },
    sliderHeaderContainer: {
        marginVertical: 10,
    },
    sliderHeaderText: {
        fontFamily: constants.FONTFAMILY,
        fontSize: constants.H2FONTSIZE,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    sliderContainer: {
        width: '100%',
        flexDirection: 'column',
    },
    knownWordsPercText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H1FONTSIZE,
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    exampleSentenceContainer: {
        marginBottom: 10
    },
    exampleSentenceText: {
        fontFamily: constants.FONTFAMILY,
        fontSize: constants.H2FONTSIZE,
        textAlign: 'center'
    }
});