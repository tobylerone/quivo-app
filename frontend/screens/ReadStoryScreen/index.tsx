import { StyleSheet, SafeAreaView, TouchableOpacity, View, Text, Image, ScrollView } from "react-native";
import { useContext, useEffect, useState } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faX, faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// Constants
import * as constants from "../../constants";
// Contexts
import UserContext from "../../contexts/UserContext";
// Components
import RaisedButton from "../../components/RaisedButton";
import SentenceReaderPanel from "../../components/SentenceReaderPanel";
// Interfaces
import { ISentence } from "../../interfaces";
// Assets
import { avatarImageMap } from "../../assets/avatars/avatarMaps";
import useSentencesData from "./hooks/useSentencesData";
import stories from '../../assets/stories.json';


export default function ReadStoryScreen({route, navigation}: NativeStackHeaderProps) {

    const { currentUser, currentLanguageCode, currentLanguageCompletedStories, setCurrentLanguageCompletedStories } = useContext(UserContext);
    const { storyIndex, primaryColor } = route.params;

    const { sentencesData, numSentences } = useSentencesData({storyIndex, currentLanguageCode});
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
    const [completedStoryButtonVisible, setCompletedStoryButtonVisible] = useState<boolean>(false);
    
    useEffect(() => {
        // TODO: store sentencesDAta
        if (currentSentenceIndex + 1 == numSentences) {
            setCompletedStoryButtonVisible(true);
        }
    }, [currentSentenceIndex]);
    
    const renderProgressCircle = (i: number) => (
        <View style={{
            backgroundColor: currentSentenceIndex >= i
                ? primaryColor
                : constants.LIGHTGREY,
            ...styles.progressCircle
        }}></View>
    );

    const handleCompletedStoryButtonPress = () => {
        console.log('pressed');
        if (storyIndex == currentLanguageCompletedStories) {
            setCurrentLanguageCompletedStories(storyIndex + 1);
        }
        navigation.navigate('Stories');
    }

    return (<>
        {sentencesData &&
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
                    {length: sentencesData.length},
                    (_, i) => i).map((i) => renderProgressCircle(i)
                )}
            </View>
            <View style={{
                marginBottom: completedStoryButtonVisible ? -173 : 20,
                ...styles.sentenceReaderContainer
                }}>
                <SentenceReaderPanel
                    navigation={navigation}
                    primaryColor={primaryColor}
                    sentencesData={sentencesData}
                    onSentenceReaderLeftSwipe={() => setCurrentSentenceIndex((idx) => (idx + 1))}
                    onSentenceReaderRightSwipe={() => setCurrentSentenceIndex((idx) => (idx - 1))}
                    marginBottom={25}
                />
            </View>
            {completedStoryButtonVisible && 
            <View style={styles.completedStoryButtonContainer}>
                <RaisedButton
                    onPress={() => handleCompletedStoryButtonPress()}
                    options={{
                        ...RaisedButton.defaultProps.options,
                        width: '100%',
                        height: 70,
                        borderWidth: 3,
                        borderRadius: 20,
                        borderColor: primaryColor,
                        backgroundColor: constants.TERTIARYCOLOR,
                        shadowColor: primaryColor,
                    }}
                >
                    <View style={styles.completedStoryButtonChildrenContainer}>
                            <FontAwesomeIcon
                                icon={storyIndex == currentLanguageCompletedStories ? faCheck : faArrowLeft}
                                size={35}
                                color={primaryColor}
                            />
                            <Text style={styles.completedStoryButtonText}>
                            {storyIndex == currentLanguageCompletedStories
                            ? 'Mark as complete' : 'Back to stories'}
                            </Text>
                    </View>
                </RaisedButton>
            </View>
            }
        </SafeAreaView>
        }
    </>);
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
        flex: 1
    },
    completedStoryButtonContainer: {
        width: 260,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 120
    },
    completedStoryButtonChildrenContainer: {
        flexDirection: 'row',
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    completedStoryButtonText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.BLACK,
        marginLeft: 10,
        marginTop: 'auto',
        marginBottom: 'auto'
    }
});