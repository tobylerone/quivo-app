import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import * as constants from '../../../constants';

interface ILanguageItem {
    item: {
        id: number,
        language_code: string,
        language_name: string
    },
    isActive: boolean,
    onPress: Function
}

// NOTE: This is similar to a component used in AccountLanguagesScreen. Could generalise
export default function LanguageItem({ item, isActive, onPress }: ILanguageItem){

    const inactiveStyling = {
        backgroundColor: constants.TERTIARYCOLOR,
        borderTopColor: constants.SECONDARYCOLOR,
        color: constants.BLACK
    }

    const activeStyling = {
        backgroundColor: constants.PRIMARYCOLOR,
        borderTopColor: constants.PRIMARYCOLOR,
        color: constants.TERTIARYCOLOR
    }
    
    //const [isActive, setIsActive] = useState(0)
    const [styling, setStyling] = useState(inactiveStyling);

    useEffect(() => {
        setStyling(isActive ? activeStyling : inactiveStyling);
    }, [isActive]);
    
    // Can't render image paths dynamically at runtime so I have
    // to map the language codes to their locally stored flag
    // image. Need to look into a better solution
    const flagImageMap = {
        'ru': require('../../../assets/ru.png'),
        'de': require('../../../assets/de.png'),
        'es': require('../../../assets/es.png'),
        'fr': require('../../../assets/fr.png'),
        // add more languages here
    };

    const handlePress = () => {
        //setIsActive(!isActive);
        // Trigger the function in the LanguageItem component's onPress
        onPress(item.language_code);
    }

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{
                backgroundColor: styling.backgroundColor,
                borderTopColor: styling.borderTopColor,
                ...styles.languageItemContainer
            }}
            onPress={() => {handlePress()}}
            >
            <Image
                style={styles.languageItemImage}
                source={flagImageMap[item.language_code]}
            />
            <View style={styles.languageItemLabel}>
                <Text style={{
                    color: styling.color,
                    ...styles.languageItemLabelText
                    }}>
                    {item.language_name}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    languageItemContainer: {
        flexDirection: 'row',
        borderTopWidth: 3,
        padding: 10
    },
    languageItemImage: {
        width: 80,
        height: 55,
        borderRadius: 8,
    },
    languageItemLabel: {
        paddingHorizontal: 15
    },
    languageItemLabelText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    languageItemAddButton: {
        borderWidth: 3,
        borderColor: constants.PRIMARYCOLOR,
        padding: 5,
        width: 35,
        height: 35,
        borderRadius: 10,
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
