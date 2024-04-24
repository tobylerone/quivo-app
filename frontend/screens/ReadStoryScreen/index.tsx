import { StyleSheet, SafeAreaView, TouchableOpacity, View, Text, Image, ScrollView } from "react-native";
import { useContext, useState } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
// Constants
import * as constants from "../../constants";
// Contexts
import UserContext from "../../contexts/UserContext";
// Components
import SentenceReaderPanel from "../../components/SentenceReaderPanel";
// Interfaces
import { ISentence } from "../../interfaces";
// Assets
import { avatarImageMap } from "../../assets/avatars/avatarMaps";
import stories from "../../assets/stories.json";

export default function ReadStoryScreen({route, navigation}: NativeStackHeaderProps) {

    const { currentUser, currentLanguageCode } = useContext(UserContext);
    const { storyIndex, primaryColor } = route.params;

    const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
    const numSentences = 10;

    const sentencesData: ISentence[] = [
        {
        sentence: "Il était une fois une jeune femme qui s'appelait Mia.",
        translated_sentence: "Once upon a time, there was a young woman named Mia.",
        words: ["il", "était", "une", "fois", "une", "jeune", "femme", "qui", "s", "appelait", "mia"]
        },
        {
        sentence: "Elle était passionnée par les langues et les cultures.",
        translated_sentence: "She had a deep passion for languages and cultures.",
        words: ["elle", "était", "passionnée", "par", "les", "langues", "et", "les", "cultures"]
        }
    ];
    
    const renderProgressCircle = (i: number) => (
        <View style={{
            backgroundColor: currentSentenceIndex >= i
                ? primaryColor
                : constants.LIGHTGREY,
            ...styles.progressCircle
        }}></View>
    );

    return (
        <>
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.crossContainer}
                onPress={() => navigation.goBack()}
                >
                <FontAwesomeIcon style={styles.cross} icon={faX} size={25} color={constants.GREY} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{stories[storyIndex][0]}</Text>
            </View>
            <View style={styles.progressCirclesContainer}>
                {Array.from(
                    {length: numSentences},
                    (_, i) => i).map((i) => renderProgressCircle(i)
                )}
            </View>
            <View style={styles.sentenceReaderContainer}>
                <SentenceReaderPanel
                    navigation={navigation}
                    primaryColor={primaryColor}
                    sentencesData={sentencesData}
                    onSentenceReaderLeftSwipe={() => setCurrentSentenceIndex((idx) => (idx + 1))}
                    onSentenceReaderRightSwipe={() => setCurrentSentenceIndex((idx) => (idx - 1))}
                />
            </View>
        </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 16,
        backgroundColor: constants.TERTIARYCOLOR,
    },
    crossContainer: {
        height: 50,
        marginBottom: -50,
        paddingHorizontal: 20,
        flexDirection: 'row'
    },
    cross: {
        marginLeft: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    titleContainer: {
        height: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10
    },
    titleText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H1FONTSIZE,
        color: constants.BLACK,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    progressCirclesContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginBottom: 10
    },
    progressCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    sentenceReaderContainer: {
        flex: 1,
        marginBottom: 20
    }
});