import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useEffect, useState, useContext, useRef } from 'react';
// Contexts
import UserContext from '../../../contexts/UserContext';
// Constants
import * as constants from '../../../constants';
// Utils
import client from '../../../utils/axios';
import { speak } from '../../../utils/text';
import { capitalizeFirstLetter } from '../../../utils/text';

// TODO: Move this to interface folder and import
interface IWord {
    id: number,
    rank: number,
    word: string,
    frequency: number,
    user_knows: boolean
}

interface IWordItemProps {
    navigation: any,
    item: IWord,
    primaryColor: string,
    showKnownWords: boolean
}

export default function WordItem({navigation, item, primaryColor, showKnownWords}: IWordItemProps){

    const { currentUser, currentLanguageCode, setKnownWords, dailyWordCount, setDailyWordCount, narrationSpeed } = useContext(UserContext);

    const selectedStyling = {
        'backgroundColor': primaryColor,
        'color': constants.TERTIARYCOLOR,
        'numberBox': {
            'backgroundColor': constants.TERTIARYCOLOR,
            'color': primaryColor
        }
    }

    const unselectedStyling = {
        'backgroundColor': primaryColor + '44',
        'color': constants.BLACK,
        'numberBox': {
            'backgroundColor': primaryColor,
            'color': constants.TERTIARYCOLOR
        }
    }
    
    const [userKnows, setUserKnows] = useState(item.user_knows);
    const [styling, setStyling] = useState(item.user_knows ? selectedStyling : unselectedStyling);
    const [lastPress, setLastPress] = useState(0);
    const [pressedOnce, _setPressedOnce] = useState(false);

    // This is super messy but it's the only way I could find to achieve this behaviour
    const pressedOnceRef = useRef(pressedOnce);

    useEffect(() => {
        // Update styling
        setStyling(userKnows ? selectedStyling : unselectedStyling);
    }, [userKnows]);
    
    const setPressedOnce = (value: boolean) => {
        pressedOnceRef.current = value;
        _setPressedOnce(value);
    };
    
    // setTimeout rend un identifiant numérique unique
    let tapDelayTimeout: TimeOut;
    let definitionDisplayTimeout: TimeOut;

    const handlePress = () => {

        const currentTime = new Date().getTime();

        // L'utilisateur a tapé deux fois
        if (currentTime - lastPress < constants.DOUBLETAPDELAY) {
            if (dailyWordCount < constants.MAXDAILYWORDS) {
                setUserKnows(!userKnows);
                client.post(
                    'api/users/' + currentUser.user_id + '/toggleknownword/' + item.word
                ).then(function(res) {
                    if (res.data.word_added) {
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

            // Supprimer les timeOut q'on a initialisés lors de la première tape pour ne
            // plus afficher la traduction
            clearTimeout(tapDelayTimeout);
            clearTimeout(definitionDisplayTimeout);

        } else {
            setPressedOnce(true);
            speak(item.word, currentLanguageCode, narrationSpeed);
        }

        setLastPress(currentTime);

    };
    // TODO: It would be a better user experience if I did this include known words filter
    // on the backend and reloaded the words list. It also takes logic out of WordItem which would
    // speed it up
    return (<>
        {(!userKnows || (userKnows && showKnownWords)) &&
        <TouchableOpacity
            style={{
                backgroundColor: styling.backgroundColor,
                ...styles.wordItem
            }}
            activeOpacity={1}
            onPress={() => {handlePress()}}
            >
            <View style={{
                backgroundColor: styling.numberBox.backgroundColor,
                ...styles.numberContainer
                }}>
                <Text style={{color: styling.numberBox.color, ...styles.numberText}}>{Math.round(item.rank)}</Text>
            </View>
            <View style={styles.word}>
                <Text style={{
                    color: styling.color,
                    ...styles.wordText
                    }}>
                    {capitalizeFirstLetter(item.word)}
                </Text>
            </View>
        </TouchableOpacity>
    }</>);
};

const styles = StyleSheet.create({
    wordItem: {
        flexDirection: "row",
        borderRadius: 10,
        marginBottom: 5,
        padding: 10
    },
    numberContainer: {
        borderRadius: 5,
        padding: 5,
        marginRight: 10
    },
    numberText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H3FONTSIZE
    },
    word: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    wordText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE
    }
});