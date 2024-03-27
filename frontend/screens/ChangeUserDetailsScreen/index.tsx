import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faX, faStar } from '@fortawesome/free-solid-svg-icons';
// Contexts
import UserContext from '../../contexts/UserContext';
// Constants
import * as constants from '../../constants';
import { text } from '@fortawesome/fontawesome-svg-core';
import { renderNode } from 'react-native-elements/dist/helpers';
// Components
import NavBar from '../../components/NavBar';
import RaisedButton from '../../components/RaisedButton';

interface IStarProps {
    id: number,
    isActive: boolean,
    onPress: Function
}

export default function ChangeUserDetailsScreen({navigation}: NativeStackHeaderProps){
    
    const { currentUser } = useContext(UserContext);
    
    return (
    <View style={styles.container}>
        <NavBar title="Update User Details" navigation={navigation} />
        <View style={styles.textInputContainer}>
            <TextInput
                style={styles.textInput}
                defaultValue={currentUser.username}
            />
        </View>
        <View style={styles.textInputContainer}>
            <TextInput
                style={styles.textInput}
                defaultValue={currentUser.email}
            />
        </View>
        <View style={styles.submitButtonContainer}>
            <RaisedButton
                    onPress={() => {}}
                    options={{
                        ...RaisedButton.defaultProps.options,
                        width: 120,
                        borderColor: constants.ORANGE,
                        backgroundColor: constants.ORANGE,
                        shadowColor: constants.ORANGESHADOW,
                    }}
                >
                    <Text style={styles.submitButtonText}>Update</Text>
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
    textInputContainer: {
        backgroundColor: constants.TERTIARYCOLOR,
        marginBottom: 10,
        borderRadius: 10,
        padding: 20,
    },
    textInput: {
        fontFamily: constants.FONTFAMILY,
        fontSize: constants.H2FONTSIZE,
        textAlignVertical: 'top',
        color: constants.BLACK
    },
    submitButtonContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
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