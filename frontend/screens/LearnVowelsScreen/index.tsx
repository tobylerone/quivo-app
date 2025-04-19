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


export default function LearnVowelsScreen({navigation}: NativeStackHeaderProps) {

    const { currentLanguageCode } = useContext(UserContext);
    
    /*
Monophthongs (Single Vowel Sounds)
Short Vowels:
อะ (a)
อิ (i)
อึ (ue)
อุ (u)
เอะ (e)
แอะ (ae)
โอะ (o)
เอาะ (aw)
เออะ (oe)
Long Vowels:
อา (aa)
อี (ii)
อือ (uue)
อู (uu)
เอ (ee)
แอ (aae)
โอ (oo)
ออ (aaw)
เออ (eer)
Diphthongs (Gliding Vowel Sounds)
Short Diphthongs:
เอียะ (ia)
เอือะ (uea)
อัวะ (ua)
Long Diphthongs:
เอีย (iia)
เอือ (uuea)
อัว (uua)
Special Vowel Symbols
Thai also has unique vowel combinations and symbols, such as:
ใอ (ai mai muan)
ไอ (ai mai malai)
เอา (ao)
ฤ (rue)
ฤๅ (ruue)
ฦ (lue)
ฦๅ (luue)
    */
    
    const shortVowels = [
        {"letter": "อะ", "transliteration": "a"},
        {"letter": "อิ", "transliteration": "i"},
        {"letter": "อึ", "transliteration": "ue"},
        {"letter": "อุ", "transliteration": "u"},       
        {"letter": "เอะ", "transliteration": "e"},
        {"letter": "แอะ", "transliteration": "ae"},
        {"letter": "โอะ", "transliteration": "o"},
        {"letter": "เอาะ", "transliteration": "aw"},
        {"letter": "เออะ", "transliteration": "oe"}
    ];

    const renderItem = (item: Record<string, string>) => (
        <View style={styles.itemContainer} key={item.letter}>
            <RaisedButton
                onPress={() => speak(item.letter.charAt(0), 'th')}
                options={{
                    ...RaisedButton.defaultProps.options,
                    width: 90,
                    height: 60,
                    borderWidth: 3,
                    borderColor: constants.PURPLE,
                    backgroundColor: constants.TERTIARYCOLOR,
                    shadowColor: constants.PURPLE,
                }}
            >
                <Text style={styles.itemLetterText}>{item.letter}</Text>
                {/*<Text style={styles.itemTranslitText}>{item.transliteration}</Text>*/}
            </RaisedButton>
        </View>
    );
    
    return (
    <>
    <View style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Vowels</Text>
        </View>
        <View style={styles.titleContainer}>
            <Text style={styles.subTitleText}>Short</Text>
        </View>
        <View style={styles.itemsContainer}>{shortVowels.map((item) => renderItem(item))}</View>
    </View>
    <BottomNavBar hilighted='LearnVowels' navigation={navigation} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 16
    },
    titleContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 0
    },
    titleText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H1FONTSIZE,
        color: constants.PRIMARYCOLORSHADOW,
        marginBottom: 5
    },
    subTitleText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.PRIMARYCOLORSHADOW,
        marginBottom: 8,
    },
    itemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',

    },
    itemContainer: {
        marginHorizontal: 2,
        marginVertical: 5
    },
    itemLetterText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H1FONTSIZE + 10,
        color: constants.PRIMARYCOLORSHADOW,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: -4,//'auto',
        marginBottom: 'auto'
    },
    itemTranslitText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H4FONTSIZE,
        color: constants.ORANGE,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 'auto'
    }
});