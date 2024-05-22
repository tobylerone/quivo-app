import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState, useContext } from "react";
import UserContext from '../../../contexts/UserContext';
import Slider from '@react-native-community/slider';
import * as constants from "../../../constants";

export default function SetKnownWordsPanel() {

    const { currentUser, currentLanguageCode, knownWordsPercentage, setKnownWordsPercentage } = useContext(UserContext);

    const exampleSentences: Record<string, string> = {
        'fr': 'Malgré la pluie, Marie a décidé de sortir pour acheter des légumes frais au marché local ce matin.',
        'de': 'Obwohl es regnet, gehen wir spazieren, weil wir die frische Luft und die Schönheit der Natur sehr genießen.',
        'ru': 'Мама всегда говорила, что жизнь похожа на коробку шоколадных конфет: никогда не знаешь, какую конфету ты достанешь.',
        'th': 'มชอบที่จะเดินเล่นในสวนสาธารณะหลังจากที่ทำงานเสร็จเพื่อผ่อนคลายและสัมผัสกับธรรมชาติที่สวยงาม'
    }

    const [sentenceComponents, setSentenceComponents] = useState<React.JSX.Element[]>([]);
    const [activeWordMask, setActiveWordMask] = useState<(0 | 1)[]>([1,0,0,1,0,1,1,1,0,0,0,1,0,1,0,1,1,0,1,0]);
    //const [activeWordMask, setActiveWordMask] = useState(createInitialActiveWordMask(20, 50))

    useEffect(() => {
        // TODO: Changing the language doesn't cause this to update straight away
        setActiveWordMask(createActiveWordMask());
    }, [knownWordsPercentage, currentLanguageCode]);

    useEffect(() => {
        let components: React.JSX.Element[] = (
            currentLanguageCode == 'th'
            ? formatThaiSentence(exampleSentences[currentLanguageCode])
            : formatSentence(exampleSentences[currentLanguageCode])
        );
        setSentenceComponents(components);
    }, [activeWordMask]);

    function formatSentence(sentence: string) {

        // Want to match into one of two categories: valid french words (using same regex as one shown above) and everything else
        const wordsRegex: Record<string, RegExp> = {
            'fr': /(?:[Aa]ujourd\'hui|[Pp]resqu\'île|[Qq]uelqu\'un|[Dd]\'accord|-t-|[a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüùÛÜÙçÇîÎïÏ]+)/g,
            'de': /(?:[a-zA-ZäöüÄÖÜß]+)/g,
            'ru': /(?:[А-Яа-яЁё]+)/g
        };

        const inclusiveRegex: Record<string, RegExp> = {
            'fr': /(?:[Aa]ujourd\'hui|[Pp]resqu\'île|[Qq]uelqu\'un|[Dd]\'accord|-t-|[a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüùÛÜÙçÇîÎïÏ]+|[^a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüùÛÜÙçÇîÎïÏ]+)/g,
            'de': /(?:[a-zA-ZäöüÄÖÜß]+|[^a-zA-ZäöüÄÖÜß])/g,
            'ru': /(?:[А-Яа-яЁё]+|[^А-Яа-яЁё])/g
        };
        
        const words = sentence.match(wordsRegex[currentLanguageCode]) || [];
        const splitSentence = sentence.match(inclusiveRegex[currentLanguageCode]) || [];

        const sentenceComponents = [];

        let wordIndex = 0;

        for (let i = 0; i < splitSentence.length; i++) {
            
            let substring: string = splitSentence[i];
            
            // Same as word unless in shortened_word_map
            if (words.includes(substring)) {
                let wordColor = activeWordMask[wordIndex] ? constants.BLACK : constants.GREY
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

    const formatThaiSentence = (sentence: string) => {
        
        /*const sentenceComponents: Element[] = [];
        const sentenceLength = sentence.length;
        
        if (sentenceLength == 0) {
            return <Text></Text>;
        }

        // Loop through words
        currentItem.split_sentence.forEach((particle, index) => {
            
            if (wordsData.hasOwnProperty(particle)) {
                sentenceComponents.push(<Word
                    navigation={navigation}
                    primaryColor={constants.BLACK}
                    word={particle}
                    wordData={wordsData[particle]}
                    textColor={activeWords.includes(particle) ? primaryColor : primaryColor + '55'}
                    onPress={handleWordPress}
                    isFirstWord={index==0}
                    screenWidth={screenWidth}
                    index={index}
                    key={`${currentItem.id}-${index}`}
                />);
            } else {
                sentenceComponents.push(<Text style={{
                    color: primaryColor + '55',
                    fontSize: constants.H1FONTSIZE + 7,
                    fontFamily: constants.FONTFAMILYBOLD,
                    textAlign: "center" 
                }} key={index}>{index==0 ? capitalizeFirstLetter(particle) : particle}</Text>);
            }
        });

        return sentenceComponents;
        */
       return [];
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
        
        const percChange = knownWordsPercentage - newKnownWordsPerc;
        const absWordChange = Math.abs(Math.round(percChange * totalWords / 100));
        
        if (percChange > 0) {
            // Percentage has increased. Need to make new words active
            return replaceValues(activeWordMask, absWordChange, 0);

        } else if (percChange < 0) {
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
        <Text style={styles.knownWordsPercText}>{knownWordsPercentage}%</Text>
        <View style={styles.sliderContainer}>
            <Slider
                style={{height: 65, padding: 0, margin: 0, transform: [{ scaleX: 1.6 }, { scaleY: 1.6 }]}}
                minimumValue={20}
                maximumValue={80}
                value={knownWordsPercentage}
                onValueChange={setKnownWordsPercentage}
                step={10}
                minimumTrackTintColor={constants.PURPLEREGULAR}
                maximumTrackTintColor={constants.GREY}
                thumbTintColor={constants.PURPLEREGULAR}
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
        //backgroundColor: constants.PURPLEREGULAR + '22',
        borderWidth: 3,
        borderColor: constants.GREY,
        padding: 10,
        borderRadius: 20,
        marginBottom: 20
    },
    sliderHeaderContainer: {
        marginVertical: 10,
    },
    sliderHeaderText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.BLACK,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    sliderContainer: {
        width: '100%',
        paddingHorizontal: '20%',
        marginTop: -20,
        marginBottom: -10,
        flexDirection: 'column',
    },
    knownWordsPercText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H1FONTSIZE,
        color: constants.PURPLEREGULAR,
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