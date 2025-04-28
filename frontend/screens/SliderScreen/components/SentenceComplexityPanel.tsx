import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState, useContext } from "react";
import UserContext from '../../../contexts/UserContext';
import Slider from '@react-native-community/slider';
import * as constants from "../../../constants";
// Components
import ToggleButton from "../../../components/ToggleButton";

export default function SentenceComplexityPanel() {

    const { currentUser, currentLanguageCode, wordSeparationOn, setWordSeparationOn } = useContext(UserContext);

    const [sentenceComplexity, setSentenceComplexity] = useState<-2|-1|0|1|2>(0);

    const complexityLabels = {
        '-2': [
            'Much Easier',
            'Simple language that should be easy for someone of your level to understand.'
        ],
        '-1': [
            'Easier',
            'Relatively simple for someone of your level.'
        ],
        '0': [
            'Normal',
            'Some challenging vocabulary, mixed with many more common words.'
        ],
        '1': [
            'Harder',
            'More challenging vocabulary that may be difficult to understand at your current level.'
        ],
        '2': [
            'Much Harder',
            'A large variety of challenging vocabulary to really test your limits!'
        ]
    }

    return (
    <View style={styles.mainContainer}>
        <View style={styles.sliderHeaderContainer}>
            <Text style={styles.sliderHeaderText}>Sentence Complexity</Text>
        </View>
        <Text style={styles.complexityLabelText}>{complexityLabels[sentenceComplexity][0]}</Text>
        <View style={styles.sliderContainer}>
            <Slider
                style={{height: 65, padding: 0, margin: 0, transform: [{ scaleX: 1.6 }, { scaleY: 1.6 }]}}
                minimumValue={-2}
                maximumValue={2}
                value={sentenceComplexity}
                onValueChange={setSentenceComplexity}
                step={1}
                minimumTrackTintColor={constants.GREENREGULAR}
                maximumTrackTintColor={constants.GREY}
                thumbTintColor={constants.GREENREGULAR}
            />
        </View>
        <View style={styles.complexityExplanationContainer}>
            <Text style={styles.complexityExplanationText}>
                {complexityLabels[sentenceComplexity][1]}
            </Text>
        </View>
        <View style={styles.wordSeparationContainer}>
            <Text style={styles.wordSeparationText}>Separate words</Text>
            <View style={styles.toggleButtonContainer}>
                <ToggleButton
                    initiallySelected={wordSeparationOn}
                    size={20}
                    primaryColor={constants.BLACK}
                    secondaryColor={constants.BLACK + '55'}
                    onValueChange={() => setWordSeparationOn(!wordSeparationOn)}
                />
            </View>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        //backgroundColor: constants.GREENREGULAR + '55',
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
    complexityLabelText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H1FONTSIZE,
        color: constants.GREENREGULAR,
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    complexityExplanationContainer: {
        marginBottom: 10,
        height: 80
    },
    complexityExplanationText: {
        fontFamily: constants.FONTFAMILY,
        fontSize: constants.H2FONTSIZE,
        color: constants.BLACK,
        textAlign: 'center',
        marginHorizontal: 20
    },
    wordSeparationContainer: {
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10,
        height: 50,
        marginBottom: 25,
        marginLeft: 'auto',
        marginRight: 10,
        borderRadius: 10
    },
    wordSeparationText: {
        fontFamily: constants.FONTFAMILY,
        fontSize: constants.H3FONTSIZE,
        color: constants.BLACK,
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: 5
    },
    toggleButtonContainer: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },
});