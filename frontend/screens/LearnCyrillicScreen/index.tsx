import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
// Contexts
import UserContext from '../../contexts/UserContext';
// Utils
import { speak } from "../../utils/text";
// Constants
import * as constants from '../../constants';
// Components
import BottomNavBar from '../../components/BottomNavBar';
import RaisedButton from "../../components/RaisedButton";


export default function LearnCyrillicScreen({navigation}: NativeStackHeaderProps) {

    const { currentLanguageCode } = useContext(UserContext);

    const cyrillicChars = [
        {"letter": "Аа", "transliteration": "a"},
        {"letter": "Бб", "transliteration": "b"},
        {"letter": "Вв", "transliteration": "v"},
        {"letter": "Гг", "transliteration": "g"},
        {"letter": "Дд", "transliteration": "d"},
        {"letter": "Ее", "transliteration": "e"},
        {"letter": "Ёё", "transliteration": "yo"},
        {"letter": "Жж", "transliteration": "zh"},
        {"letter": "Зз", "transliteration": "z"},
        {"letter": "Ии", "transliteration": "i"},
        {"letter": "Йй", "transliteration": "y"},
        {"letter": "Кк", "transliteration": "k"},
        {"letter": "Лл", "transliteration": "l"},
        {"letter": "Мм", "transliteration": "m"},
        {"letter": "Нн", "transliteration": "n"},
        {"letter": "Оо", "transliteration": "o"},
        {"letter": "Пп", "transliteration": "p"},
        {"letter": "Рр", "transliteration": "r"},
        {"letter": "Сс", "transliteration": "s"},
        {"letter": "Тт", "transliteration": "t"},
        {"letter": "Уу", "transliteration": "u"},
        {"letter": "Фф", "transliteration": "f"},
        {"letter": "Хх", "transliteration": "kh"},
        {"letter": "Цц", "transliteration": "ts"},
        {"letter": "Чч", "transliteration": "ch"},
        {"letter": "Шш", "transliteration": "sh"},
        {"letter": "Щщ", "transliteration": "sh"},
        {"letter": "Ъъ", "transliteration": "Hard sn"},
        {"letter": "Ыы", "transliteration": "y"},
        {"letter": "Ьь", "transliteration": "Soft sn"},
        {"letter": "Ээ", "transliteration": "e"},
        {"letter": "Юю", "transliteration": "yu"},
        {"letter": "Яя", "transliteration": "ya"}
    ]

    const renderItem = (item: Record<string, string>) => (
        <View style={styles.itemContainer}>
            <RaisedButton
                onPress={() => speak(item.letter.charAt(0), 'ru')}
                options={{
                    ...RaisedButton.defaultProps.options,
                    width: 70,
                    height: 80,
                    borderWidth: 3,
                    borderColor: constants.GREY,
                    backgroundColor: constants.TERTIARYCOLOR,
                    shadowColor: constants.GREY,
                }}
            >
                <Text style={styles.itemLetterText}>{item.letter}</Text>
                <Text style={styles.itemTranslitText}>{
                    ['Ъъ', 'Ьь'].includes(item.letter)
                    ? item.transliteration
                    : '"' + item.transliteration + '"'
                }</Text>
            </RaisedButton>
        </View>
    );
    
    return (
    <>
    <View style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Cyrillic Alphabet</Text>
        </View>
        <View style={styles.itemsContainer}>{cyrillicChars.map((item) => renderItem(item))}</View>
    
    </View>
    <BottomNavBar hilighted='LearnCyrillic' navigation={navigation} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 60,
        marginHorizontal: 16
    },
    titleContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10
    },
    titleText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H1FONTSIZE,
        color: constants.PRIMARYCOLORSHADOW,
        marginBottom: 10
    },
    itemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center'

    },
    itemContainer: {
        marginHorizontal: 2,
        marginVertical: 5
    },
    itemLetterText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H1FONTSIZE,
        color: constants.PRIMARYCOLORSHADOW,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto'
    },
    itemTranslitText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H3FONTSIZE,
        color: constants.ORANGE,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 'auto'
    }
});