import { View, Image, Text, StyleSheet, ScrollView } from "react-native";
import { useContext } from "react";
import PNG from 'pngjs';
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
// Constants
import * as constants from '../../constants';
// Contexts
import UserContext from '../../contexts/UserContext';
// Assets
import { avatarImageMap, avatarLevelUnlock } from '../../assets/avatars/avatarMaps';
// Utils
import { generateBuckets } from '../../utils/functions';
import { calcLevel } from "../../utils/functions";
// Components
import NavBar from "../../components/NavBar";

export default function LevelScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser, knownLanguages, knownWords, currentLanguage } = useContext(UserContext);
    const {buckets, cumBuckets} = generateBuckets(30000, 100, 50);
    const { level, knownWordsInLevel} = calcLevel(knownWords, 30000);

    const renderImage = (imageCode: number, image: PNG) => (
        <Image key={imageCode} source={image} style={styles.avatarImage} />
    );

    const renderLevelItem = (bucketSize: number, itemLevel: number) => (
        <View 
            style={{
                backgroundColor: itemLevel < level ? constants.PURPLEREGULAR : constants.PURPLEREGULAR + '55',
                ...styles.itemContainer
            }}
            key={itemLevel}
        >
            {itemLevel == level && 
            <View style={{
                width: 80 * (knownWordsInLevel / bucketSize),
                ...styles.itemProgressBackground
            }}></View>
            }
            <Text style={styles.levelText}>Lv. {itemLevel}</Text>
            <Text style={styles.wordsText}>
                {itemLevel <= level ? itemLevel == level ? knownWordsInLevel : bucketSize : 0} / {bucketSize}
            </Text>
            {avatarLevelUnlock.hasOwnProperty(itemLevel) &&
            <View style={styles.avatarImagesContainer}>
                {avatarLevelUnlock[itemLevel].map(imageCode => renderImage(imageCode, avatarImageMap[imageCode]))}
            </View>
            }
        </View>
    );

    return (
    <ScrollView
        style={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false} 
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        removeClippedSubviews={true}
        >
        <NavBar title={'Level ' + level} navigation={navigation} />
        <View style={styles.itemsContainer}>
            {buckets.map((item, idx) => renderLevelItem(item, idx + 1))}
        </View>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 20,
    },
    itemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: -10
    },
    itemContainer: {
        flexDirection: 'column',
        overflow: 'hidden',
        margin: '1%',
        borderRadius: 10,
        width: '22%',
        height: 100,
    },
    itemProgressBackground: {
        backgroundColor: constants.PURPLEREGULAR,
        height: 100,
        marginBottom: -100,
    },
    levelText: {
        backgroundColor: constants.TERTIARYCOLOR,
        color: constants.PURPLEREGULAR,
        fontFamily: constants.FONTFAMILYBOLD,
        borderRadius: 5,
        margin: 5,
        textAlign: 'center',
        padding: 5
    },
    wordsText: {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: constants.FONTFAMILY,
        color: constants.BLACK
    },
    avatarImagesContainer: {
        flexDirection: 'row',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 5
    },
    avatarImage: {
        width: 25,
        height: 25
    }
});