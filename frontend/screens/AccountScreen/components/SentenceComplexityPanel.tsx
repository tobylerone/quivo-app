import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState, useContext } from "react";
import UserContext from '../../../contexts/UserContext';
import Slider from '@react-native-community/slider';
import * as constants from "../../../constants";

export default function SentenceComplexityPanel() {

    const { currentUser, currentLanguageCode } = useContext(UserContext);

    const exampleSentences: Record<string, string> = {
        'fr': 'Malgré la pluie, Marie a décidé de sortir pour acheter des légumes frais au marché local ce matin.',
        'de': 'Obwohl es regnet, gehen wir spazieren, weil wir die frische Luft und die Schönheit der Natur sehr genießen.',
        'ru': 'Мама всегда говорила, что жизнь похожа на коробку шоколадных конфет: никогда не знаешь, какую конфету ты достанешь.'
    }

    const [sentenceComponents, setSentenceComponents] = useState<React.JSX.Element[]>([]);
    const [activeWordMask, setActiveWordMask] = useState<(0 | 1)[]>([1,0,0,1,0,1,1,1,0,0,0,1,0,1,0,1,1,0,1,0]);
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
                minimumTrackTintColor={constants.PRIMARYCOLOR}
                maximumTrackTintColor={constants.GREY}
                thumbTintColor={constants.PRIMARYCOLOR}
            />
        </View>
        <View style={styles.complexityExplanationContainer}>
            <Text style={styles.complexityExplanationText}>
                {complexityLabels[sentenceComplexity][1]}
            </Text>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: constants.SECONDARYCOLOR,
        //borderWidth: 3,
        //borderColor: constants.GREY,
        padding: 10,
        borderRadius: 20,
        marginBottom: 20
    },
    sliderHeaderContainer: {
        marginVertical: 10,
    },
    sliderHeaderText: {
        fontFamily: constants.FONTFAMILY,
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
        color: constants.BLACK,
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    complexityExplanationContainer: {
        marginBottom: 10,
        height: 90
    },
    complexityExplanationText: {
        fontFamily: constants.FONTFAMILY,
        fontSize: constants.H2FONTSIZE,
        color: constants.GREY,
        textAlign: 'center',
        marginHorizontal: 20
    }
});