import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState, useContext } from "react";
import UserContext from '../../../contexts/UserContext';
import Slider from '@react-native-community/slider';
import * as constants from "../../../constants";

export default function SetKnownWordsPanel() {

    const { currentUser, currentLanguage } = useContext(UserContext);

    const exampleSentences: Record<string, string> = {
        'fr': 'Malgré la pluie, Marie a décidé de sortir pour acheter des légumes frais au marché local ce matin.',
        'de': 'Obwohl es regnet, gehen wir spazieren, weil wir die frische Luft und die Schönheit der Natur sehr genießen.'
    }

    const [knownWordsPerc, setKnownWordsPerc] = useState(50);
    const [sentenceComponents, setSentenceComponents] = useState<React.JSX.Element[]>([]);
    const [activeWordMask, setActiveWordMask] = useState<(0 | 1)[]>([1,0,0,1,0,1,1,1,0,0,0,1,0,1,0,1,1,0,1,0]);
    //const [activeWordMask, setActiveWordMask] = useState(createInitialActiveWordMask(20, 50))

    useEffect(() => {
        // activeWordMask getting set to undefined here
        setActiveWordMask(createActiveWordMask());
    }, [knownWordsPerc]);

    useEffect(() => {
        let components: React.JSX.Element[] = formatSentence(exampleSentences[currentLanguage]);
        setSentenceComponents(components);
    }, [activeWordMask]);

    function formatSentence(sentence: string) {

        // Want to match into one of two categories: valid french words (using same regex as one shown above) and everything else
        const wordsRegex: Record<string, RegExp> = {
            'fr': /(?:[Aa]ujourd\'hui|[Pp]resqu\'île|[Qq]uelqu\'un|[Dd]\'accord|-t-|[a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüùÛÜÙçÇîÎïÏ]+)/g,
            'de': /(?:[a-zA-ZäöüÄÖÜß]+)/g
        };

        const inclusiveRegex: Record<string, RegExp> = {
            'fr': /(?:[Aa]ujourd\'hui|[Pp]resqu\'île|[Qq]uelqu\'un|[Dd]\'accord|-t-|[a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüùÛÜÙçÇîÎïÏ]+|[^a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüùÛÜÙçÇîÎïÏ]+)/g,
            'de': /(?:[a-zA-ZäöüÄÖÜß]+|[^a-zA-ZäöüÄÖÜß])/g
        };
        
        const words = sentence.match(wordsRegex[currentLanguage]) || [];
        const splitSentence = sentence.match(inclusiveRegex[currentLanguage]) || [];

        const sentenceComponents = [];

        let wordIndex = 0;

        for (let i = 0; i < splitSentence.length; i++) {
            
            let substring: string = splitSentence[i];
            
            // Same as word unless in shortened_word_map
            if (words.includes(substring)) {
                let wordColor = activeWordMask[wordIndex] ? constants.PRIMARYCOLOR : constants.BLACK
                wordIndex++;
                sentenceComponents.push(
                    <Text style={{ color: wordColor, ...styles.exampleSentenceText }} key={i}>
                        {substring}
                    </Text>
                );
            } else {
                sentenceComponents.push(
                    <Text style={{ color: constants.GREY, ...styles.exampleSentenceText }} key={i}>
                        {substring}
                    </Text>
                );
            }
        };

        return sentenceComponents;
    }

    function createInitialActiveWordMask(num_words: number, percentage: number) {
        let array = Array(num_words).fill(0).map((v, i) => i < num_words * percentage ? 1 : 0);
        array.sort(() => Math.random() - 0.5);
        return array;
    }

    function replaceValues(array: (0 | 1)[], n: number, to_replace: number) {
        // Get the indices of values to replace
        var indices = array.reduce(function(result, value, index) {
            if (value === to_replace) result.push(index);
            return result;
        }, []);
        
        // Randomly select n indices to replace
        var indicesToReplace = indices.sort(() => 0.5 - Math.random()).slice(to_replace, n);

        // Replace the selected indices with ones
        indicesToReplace.forEach(
            index => array[index] = (to_replace === 0 ? 1 : 0)
            );
        
        // Need to return a copy to trigger hook update
        return [...array];
    }

    function createActiveWordMask() {
        
        const totalWords = activeWordMask.length;
        
        const newActiveWordCount = activeWordMask.filter(num => num === 1).length;
        // Find new known words percentage to the nearest 10%
        const newKnownWordsPerc = Math.round((newActiveWordCount / totalWords) * 10) * 10;
        
        const percChange = knownWordsPerc - newKnownWordsPerc;
        const absWordChange = Math.abs(Math.round(percChange * totalWords / 100));
        
        if (percChange > 0) {
            console.log('Percentage has increased by:' + percChange + '%');
            // Percentage has increased. Need to make new words active
            return replaceValues(activeWordMask, absWordChange, 0);

        } else if (percChange < 0) {
            console.log('Percentage has decreased by:' + percChange + '%');
            // Percentage has decreased, so need to deactivate some active words
            return replaceValues(activeWordMask, absWordChange, 1);
        }

        return activeWordMask;
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