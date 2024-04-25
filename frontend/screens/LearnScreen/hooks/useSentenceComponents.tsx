import { useEffect, useState, useContext } from "react";
import { Text, useWindowDimensions } from "react-native";
// Contexts
import UserContext from "../../../contexts/UserContext";
// Utils
import { speak } from '../../../utils/text';
import { capitalizeFirstLetter } from "../../../utils/text";
// Constants
import * as constants from '../../../constants'
// Components
import Word from "../components/Word";

export default function useSentenceComponents(navigation, currentItem, wordsData, autoDictEnabled, primaryColor){
    // NOTE: This hook should not contain tsx

    const { currentLanguageCode, narrationSpeed } = useContext(UserContext);
    const [sentenceComponents, setSentenceComponents] = useState<React.JSX.Element[]>([]);
    const [activeWords, setActiveWords] = useState([]);
    const screenWidth = useWindowDimensions().width;
    
    useEffect(() => {
        // update activeWords to include all words in wordsData
        
        // This useEffect relies on wordsData consistently updating slower than
        // currentItem, but it probably needs a rethink
        if (currentItem && wordsData) {

            // Initialises activeWords with the wordsData keys where
            // the user already knows the word.
            setActiveWords(Object.keys(Object.fromEntries(
                Object.entries(wordsData).filter(
                    ([key, value]) => value.user_knows
                )
            )));

            // This starts speaking before sentence components have been created
            // which might seem odd if sentence takes a while to render
            if (autoDictEnabled) speak(currentItem.sentence, currentLanguageCode, narrationSpeed);
        }
    }, [wordsData]);

    useEffect(() => {
        console.log('Sentence re-render triggered');
        createSentenceComponents(currentItem, wordsData).then(components => {
            setSentenceComponents(components);
        });
    }, [activeWords])

    const getFullWord = (word: string) => {
        
        // TODO: This map gets repeated three times. Need to sort this out
        let shortened_word_map: Record<string, string> = {
            'j': 'je',
            'l': 'le', // Always replace with le for now. Figure out a better solution here
            't': 'tu', // This will assign the t in a-t-on to tu for example, which will give tu a higher frequency than it should have, but it's only one very common word so I'm not going to address it
            'd': 'de', // Need to check whether this is ever du
            'c': 'ce',
            's': 'se',
            'qu': 'que',
            'm': 'me',
            'n': 'ne',
        }

        return word in shortened_word_map ? shortened_word_map[word] : word;
    }

    const handleWordPress = (word: string) => {
        let fullWord = getFullWord(word.toLowerCase());
        if (activeWords.includes(fullWord)) {
            setActiveWords((prevArr) => prevArr.filter((item) => item !== fullWord));
        } else {
            setActiveWords((prevArr) => [...prevArr, fullWord]);
        }
    };

    const createSentenceComponents = async() => {
        //setActiveWords([]);
        
        if (currentItem.sentence.length == 0) {
            return <Text></Text>;
        }

        // Want to match into one of two categories: valid french words (using same regex as one shown above) and everything else
        const regex: Record<string, RegExp> = {
            'fr': /(?:[Aa]ujourd\'hui|[Pp]resqu\'île|[Qq]uelqu\'un|[Dd]\'accord|-t-|[a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüùÛÜÙçÇîÎïÏ]+|[^a-zA-Z0-9éèêëÉÈÊËàâäÀÂÄôöÔÖûüùÛÜÙçÇîÎïÏ]+)/g,
            'de': /(?:[a-zA-ZäöüÄÖÜß]+|[^a-zA-ZäöüÄÖÜß])/g,
            'ru': /(?:[А-Яа-яЁё]+|[^А-Яа-яЁё])/g,
        }
        
        const splitSentence = currentItem.sentence.match(regex[currentLanguageCode]) || [];
        const sentenceComponents = [];

        for (let i = 0; i < splitSentence.length; i++) {
            
            let word = splitSentence[i]
            // Same as word unless in shortened_word_map
            let fullWord = getFullWord(word.toLowerCase());
    
            if (wordsData.hasOwnProperty(fullWord)) {

                sentenceComponents.push(<Word
                    navigation={navigation}
                    primaryColor={primaryColor}
                    word={word}
                    wordData={wordsData[fullWord]}
                    textColor={activeWords.includes(fullWord) ? primaryColor : primaryColor + '55'}
                    onPress={handleWordPress}
                    isFirstWord={i==0}
                    screenWidth={screenWidth}
                    index={i}
                    key={`${currentItem.id}-${i}`}
                />);
                //Add words already known to activeWords arrays
                //setActiveWords((prevArr) => [...prevArr, fullWord])
            } else {
                sentenceComponents.push(<Text style={{
                    color: primaryColor + '55',
                    fontSize: constants.H1FONTSIZE + 7,
                    fontFamily: constants.FONTFAMILYBOLD,
                    textAlign: "center" 
                }} key={i}>{i==0 ? capitalizeFirstLetter(word) : word}</Text>);
            }
        };
        return sentenceComponents;
    };

    return { sentenceComponents, setActiveWords };
}