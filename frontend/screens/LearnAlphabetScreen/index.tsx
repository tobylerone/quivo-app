import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useContext } from "react";
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

export default function LearnAlphabetScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser, knownLanguages, currentLanguage, monthlyWordCounts } = useContext(UserContext);

    const [activeTab, setActiveTab] = useState<string>('Vowels');

    const TABS = ['Vowels', 'Consonants'];

    const vowelButtonDims = [90, 55];
    const consonantButtonDims = [50, 55];

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

    const highClassConsonants = [
        {"letter": "ข", "transliteration": "kɔ̌ɔ kài"},
        {"letter": "ฃ", "transliteration": "kɔ̌ɔ kùat"},
        {"letter": "ฉ", "transliteration": "chɔ̌ɔ chìng"},
        {"letter": "ฐ", "transliteration": "tɔ̌ɔ tǎan"},
        {"letter": "ถ", "transliteration": "tɔ̌ɔ tǔng"},
        {"letter": "ผ", "transliteration": "pɔ̌ɔ pʉ̂ng"},
        {"letter": "ฝ", "transliteration": "fɔ̌ɔ fǎa"},
        {"letter": "ศ", "transliteration": "sɔ̌ɔ sǎa-laa"},
        {"letter": "ษ", "transliteration": "sɔ̌ɔ rʉʉ-sǐi"},
        {"letter": "ส", "transliteration": "sɔ̌ɔ sʉ̌a"},
        {"letter": "ห", "transliteration": "hɔ̌ɔ hip"},
    ];
    
    const middleClassConsonants = [
        {"letter": "ก", "transliteration": "gɔ̌ɔ gài"},
        {"letter": "จ", "transliteration": "jɔ̌ɔ jaan"},
        {"letter": "ฎ", "transliteration": "dɔ̌ɔ chá-daa"},
        {"letter": "ฏ", "transliteration": "dtɔ̌ɔ bpà-dtàk"},
        {"letter": "ด", "transliteration": "dɔ̌ɔ dèk"},
        {"letter": "ต", "transliteration": "dtɔ̌ɔ dtào"},
        {"letter": "บ", "transliteration": "bɔ̌ɔ bai-máai"},
        {"letter": "ป", "transliteration": "bpɔ̌ɔ bplaa"},
        {"letter": "อ", "transliteration": "ɔ̌ɔ àang"},
    ];

    const pairedLowClassConsonants = [
        {"letter": "ค", "transliteration": "kɔɔ kài"},
        {"letter": "ฅ", "transliteration": "kɔɔ khon"},
        {"letter": "ฆ", "transliteration": "kɔɔ rá-kang"},
        {"letter": "ช", "transliteration": "chɔɔ cháang"},
        {"letter": "ซ", "transliteration": "sɔɔ sôo"},
        {"letter": "ฌ", "transliteration": "chɔɔ chǐng"},
        {"letter": "ฑ", "transliteration": "thɔɔ môn-tho"},
        {"letter": "ฒ", "transliteration": "thɔɔ phûu-thâo"},
        {"letter": "ท", "transliteration": "thɔɔ tá-hǎan"},
        {"letter": "ธ", "transliteration": "thɔɔ thǔng"},
        {"letter": "พ", "transliteration": "phɔɔ phaan"},
        {"letter": "ฟ", "transliteration": "fɔɔ fan"},
        {"letter": "ภ", "transliteration": "phɔɔ sǎm-phao"},
        {"letter": "ฮ", "transliteration": "hɔɔ nók-hûuk"}
    ];

    const unpairedLowClassConsonants = [
        {"letter": "ง", "transliteration": "ngɔɔ nguu"},
        {"letter": "ญ", "transliteration": "yɔɔ yǐng"},
        {"letter": "ณ", "transliteration": "nɔɔ nehn"},
        {"letter": "น", "transliteration": "nɔɔ nǔu"},
        {"letter": "ม", "transliteration": "mɔɔ máa"},
        {"letter": "ย", "transliteration": "yɔɔ yák"},
        {"letter": "ร", "transliteration": "rɔɔ rʉa"},
        {"letter": "ล", "transliteration": "lɔɔ ling"},
        {"letter": "ฬ", "transliteration": "lɔɔ jù-laa"},
        {"letter": "ว", "transliteration": "wɔɔ wǎaen"}
    ];


    const renderItem = (item: Record<string, string>, width: number, height: number) => (
        <View style={styles.itemContainer} key={item.letter}>
            <RaisedButton
                onPress={() => speak(item.letter.charAt(0), 'th')}
                options={{
                    ...RaisedButton.defaultProps.options,
                    width: width,
                    height: height,
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

    const renderTabButton = (tabTitle: string) => (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                setActiveTab(tabTitle);
            }}
            style={{backgroundColor: activeTab === tabTitle ? constants.PURPLE : constants.TERTIARYCOLOR, ...styles.titleTab}}
            key={tabTitle}
        >
            <Text style={{color: activeTab === tabTitle ? constants.TERTIARYCOLOR : constants.PURPLE, ...styles.tabText}}>{tabTitle}</Text>
        </TouchableOpacity>
        );

    return (
    <>
    <View style={styles.container}>
        <View style={styles.titleBar}>
            {TABS.map(tabTitle => renderTabButton(tabTitle))}
        </View>
        {activeTab == 'Vowels' && <View>
            <View style={styles.subTitleContainer}>
                <Text style={styles.subTitleText}>Short</Text>
            </View>
            <View style={styles.itemsContainer}>{shortVowels.map((item) => renderItem(item, vowelButtonDims[0], vowelButtonDims[1]))}</View>
        </View>}
        {activeTab == 'Consonants' && <View>
            <View style={styles.subTitleContainer}>
                <Text style={styles.subTitleText}>High Class</Text>
            </View>
            <View style={styles.itemsContainer}>{highClassConsonants.map((item) => renderItem(item, consonantButtonDims[0], consonantButtonDims[1]))}</View>
            <View style={styles.subTitleContainer}>
                <Text style={styles.subTitleText}>Middle Class</Text>
            </View>
            <View style={styles.itemsContainer}>{middleClassConsonants.map((item) => renderItem(item, consonantButtonDims[0], consonantButtonDims[1]))}</View>
            <View style={styles.subTitleContainer}>
                <Text style={styles.subTitleText}>Paired Low Class</Text>
            </View>
            <View style={styles.itemsContainer}>{pairedLowClassConsonants.map((item) => renderItem(item, consonantButtonDims[0], consonantButtonDims[1]))}</View>
            <View style={styles.subTitleContainer}>
                <Text style={styles.subTitleText}>Unpaired Low Class</Text>
            </View>
            <View style={styles.itemsContainer}>{unpairedLowClassConsonants.map((item) => renderItem(item, consonantButtonDims[0], consonantButtonDims[1]))}</View>
        </View>}
    </View>
    <BottomNavBar hilighted='LearnVowels' navigation={navigation} />
    </>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        marginTop: 50,
        marginHorizontal: 5,
        overflow: 'hidden',
        height: 'auto',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: constants.PURPLE
    },
    titleBar: {
        flexDirection: 'row',
        backgroundColor: constants.PURPLE,
        marginBottom: 10,
        marginBottomColor: constants.PURPLE,
    },
    titleTab: {
        padding: 10,
        borderColor: constants.PURPLE,
        borderBottomWidth: 3,
        //borderRightWidth: 3,
        width: '50%',
    },
    tabText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        textAlign: 'center'
    },
    contentTabContainer: {
        padding: 10
    },
    subTitleContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 0
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
        marginTop: -6,//'auto',
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