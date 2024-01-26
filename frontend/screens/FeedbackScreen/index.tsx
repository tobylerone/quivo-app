import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faX, faStar } from '@fortawesome/free-solid-svg-icons';
// Constants
import * as constants from '../../constants';
import { text } from '@fortawesome/fontawesome-svg-core';
import { renderNode } from 'react-native-elements/dist/helpers';
// Components
import RaisedButton from '../../components/RaisedButton';

interface IStarProps {
    id: number,
    isActive: boolean,
    onPress: Function
}

const Star = ({id, isActive, onPress}: IStarProps) => {

    const handlePress = () => {
        // Trigger the function in the LanguageItem component's onPress
        onPress(id);
    }
    
    return (
    <TouchableOpacity
        style={styles.starContainer}
        onPress={() => handlePress()}
        activeOpacity={1}
        >
        <View style={{
            backgroundColor: isActive ? constants.ORANGESHADOW : constants.GREY,
            ...styles.starContainerShadow
            }}></View>
        <View style={{
            backgroundColor: isActive ? constants.ORANGE : constants.TERTIARYCOLOR,
            ...styles.starIconContainer
            }}>
            <FontAwesomeIcon
                style={styles.star}
                icon={faStar} size={30}
                color={isActive ? constants.TERTIARYCOLOR : constants.GREY}
            />
        </View>
    </TouchableOpacity>
    );
}

export default function FeedbackScreen({navigation}: NativeStackHeaderProps){
    
    type StarScore = [0, 1, 2, 3, 4, 5][number];
    
    const [starScore, setStarScore] = useState<StarScore>(0);

    function handleStarPress(starId: StarScore) {
        setStarScore(starId);
    }
    
    return (
    <View style={styles.container}>
        <TouchableOpacity
            style={styles.crossContainer}
            onPress={() => navigation.goBack()}
            >
            <FontAwesomeIcon style={styles.cross} icon={faX} size={30} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Have some suggestions?</Text>
        </View>
        <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((id) => <Star id={id} isActive={starScore >= id ? true : false} onPress={handleStarPress} />)}
        </View>
        <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>Spot a bug, or just have an idea for a new feature? Let us know! It may just make it into our next update.</Text>
        </View>
        <View style={styles.textInputContainer}>
            <TextInput
            multiline={true}
            numberOfLines={10}
            style={styles.textInput}
            placeholder="Tell us your thoughts..."
            //selection={{start: 0, end: 0}}
            />
        </View>
        <View style={styles.submitButtonContainer}>
            <RaisedButton
                    onPress={() => {}}
                    options={{
                        ...RaisedButton.defaultProps.options,
                        width: 200,
                        height: 70,
                        borderWidth: 3,
                        borderColor: constants.PRIMARYCOLOR,
                        backgroundColor: constants.PRIMARYCOLOR,
                        shadowColor: constants.PRIMARYCOLORSHADOW,
                    }}
                >
                    <Text style={styles.submitButtonText}>Submit</Text>
                </RaisedButton>
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        height: '100%',
        paddingHorizontal: 20,
        backgroundColor: constants.LIGHTBLUE
    },
    crossContainer: {
        height: 50,
        paddingHorizontal: 20,
        flexDirection: 'row'
    },
    cross: {
        marginLeft: 'auto',
        color: constants.BLACK
    },
    titleContainer: {
        marginHorizontal: 10
    },
    titleText: {
        fontSize: constants.H1FONTSIZE,
        marginBottom: 30,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK,
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center'
    },
    starsContainer: {
        flexDirection: 'row',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    starContainer: {
        flexDirection: 'column',
        marginHorizontal: 5
    },
    starIconContainer: {
        borderRadius: 25,
        width: 50,
        height: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 30
    },
    starContainerShadow: {
        borderRadius: 25,
        width: 50,
        height: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: -57,
    },
    star: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 7
    },
    textInputContainer: {
        backgroundColor: constants.TERTIARYCOLOR,
        marginBottom: 33,
        borderRadius: 20,
        padding: 20,
        //height: 300
    },
    textInput: {
        fontFamily: constants.FONTFAMILY,
        fontSize: constants.H2FONTSIZE,
        textAlignVertical: 'top',
        color: constants.BLACK
    },
    submitButtonContainer: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    submitButtonText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.TERTIARYCOLOR,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'

    },
    submitButtonShadow: {
        backgroundColor: constants.PRIMARYCOLORSHADOW,
        width: 200,
        height: 70,
        marginBottom: -77,
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    subtitleContainer: {
        //marginTop: 'auto',
        marginBottom: 0,
        marginHorizontal: 20
    },
    subtitleText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.BLACK,
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
        marginBottom: 20
    }
});