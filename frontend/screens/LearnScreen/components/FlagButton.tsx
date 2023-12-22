import {View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useContext } from "react";
import PNG from 'pngjs';
import * as constants from "../../../constants";
import UserContext from "../../../contexts/UserContext";

interface ILanguageItem {
    item: {
        id: number,
        language_code: string,
        language_name: string
    }
}

export default function FlagButton({ item }: ILanguageItem){

    const { currentLanguage } = useContext(UserContext);

    const flagImageMap: Record<string, PNG> = {
        'ru': require('../../../assets/ru.png'),
        'de': require('../../../assets/de.png'),
        'es': require('../../../assets/es.png'),
        'fr': require('../../../assets/fr.png')
    };

    return(<>
        <TouchableOpacity activeOpacity={1}>
            <View style={{
                ...styles.flagImageContainer,
                ...styles.flagImageContainerPopup,
                borderColor: (
                    currentLanguage == item.language_code
                    ? constants.TERTIARYCOLOR
                    : constants.PRIMARYCOLOR
                    )
                }}>
                <Image
                    source={flagImageMap[item.language_code]}
                    style={styles.flagImage}
                />
            </View>
        </TouchableOpacity>
    </>);
}

const styles = StyleSheet.create({
    flagImageContainer: {
        borderRadius: 10,
        marginRight: 10,
        overflow: "hidden",
        height: 50,
        width: 70,
    },
    flagImageContainerPopup: {
        borderWidth: 3
    },
    flagImage: {
        width: "100%",
        height: "100%",
    }
});