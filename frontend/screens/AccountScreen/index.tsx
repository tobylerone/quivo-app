import { StyleSheet, View, ScrollView, Image, SafeAreaView, Text, TouchableOpacity, FlatList } from "react-native";
import { useEffect, useContext } from "react";
import UserContext from '../../contexts/UserContext';
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserPlus, faGear, faPlus } from '@fortawesome/free-solid-svg-icons';
import * as constants from "../../constants";
// Assets
import { flagImageSources } from "../../assets/img/imageSources";
import { avatarImageMap } from "../../assets/avatars/avatarMaps";
// Components
import BottomNavBar from '../../components/BottomNavBar';
import ComprehensionPercPanel from "./components/ComprehensionPercPanel";
import WordsLearnedPanel from "./components/WordsLearnedPanel";
// Utils
import { calcLevel } from "../../utils/functions";

export default function AccountScreen({navigation}: NativeStackHeaderProps) {
    // Drapeaux trouvés ici: https://www.flaticon.com/packs/international-flags-6

    const { currentUser, knownWords, knownLanguages, userAvatarId } = useContext(UserContext);

    // Get the language that the user knows the most words in to calculate the level
    // NOTE: These three lines are repeated here and AvatarScreen so they
    // should be moved elsewhere
    let maxWordNum: number = Object.values(currentUser.known_words_count).reduce((a, b) => Math.max(a, b));
    maxWordNum = (maxWordNum <= knownWords) ? knownWords : maxWordNum;
    const { level } = calcLevel(maxWordNum, 30000);

    // Only show some of the language flags if user learning lots of languages
    //let visibleFlags = Object.keys(currentUser.known_words_count);
    let visibleFlags = knownLanguages.map(item => item.language_code);
    let numHiddenFlags = 0;

    if(visibleFlags.length > 3){
        numHiddenFlags = visibleFlags.length - 2;
        visibleFlags = visibleFlags.slice(0, 2);
    }

    return (
        <>
        <ScrollView
            style={styles.scrollContainer}
            bounces={false}
            showsVerticalScrollIndicator={false} 
            showsHorizontalScrollIndicator={false}
            overScrollMode="never"
            removeClippedSubviews={true}
        >
            <View style={styles.topContainer}>
                <View style={styles.profileImageAndLevelContainer}>
                    <View style={styles.profileImageShadow}>
                    </View>
                    <TouchableOpacity
                        style={styles.profileImageContainer}
                        activeOpacity={1}
                        onPress={() => navigation.navigate('Avatar')}
                        >
                        <Image
                            source={avatarImageMap[userAvatarId]}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                    <View style={styles.profileLevelContainer}>
                        <Text style={styles.profileLevelText}>Lv. {level}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigation.navigate("AccountSettings")}
                    style={styles.settingsButtonContainer}
                    >
                    <View style={styles.settingsButton}>
                        <FontAwesomeIcon icon={faGear} size={constants.H1FONTSIZE} color={constants.BLACK} />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.profileContainer}>
                <View style={styles.profileNameBubble}>
                    <View style={styles.profileNameContainer}>
                        <Text style={styles.profileName}>{currentUser.username}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.mainContainer}>
                <ComprehensionPercPanel navigation={navigation} />
                <WordsLearnedPanel navigation={navigation} />
            </View>
        </ScrollView>
        <BottomNavBar hilighted='Account' navigation={navigation} />
        </>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        marginBottom: 60
    },
    topContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: 50  
    },
    profileContainer: {
        width: "100%",
        marginTop: 10,
    },
    middleContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: 10
    },
    middleContainerColumn: {
        height: 60,
        flex: 1
    },
    mainContainer: {
        marginTop: 10,
        marginHorizontal: 20
    },
    addUserButtonContainer: {
        alignSelf: 'flex-start',
        backgroundColor: constants.SECONDARYCOLOR,
        width: 60,
        height: 60,
        borderRadius: 10
    },
    addUserButton: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    settingsButtonContainer: {
        alignSelf: 'flex-end',
        backgroundColor: constants.SECONDARYCOLOR,
        width: 60,
        height: 60,
        borderRadius: 10
    },
    settingsButton: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    profileImageAndLevelContainer: {
        alignSelf: 'flex-start',
        backgroundColor: constants.SECONDARYCOLOR,
        width: 60,
        height: 60,
        borderRadius: 10
    },
    profileImageShadow: {
        width: 100,
        height: 100,
        backgroundColor: constants.GREY,
        borderRadius: 50,
        marginBottom: -105
    },
    profileImageContainer: {
        borderRadius: 50,
        borderWidth: 3,
        borderColor: constants.GREY,
        backgroundColor: constants.TERTIARYCOLOR,
        marginLeft: "auto",
        marginRight: "auto",
        overflow: "hidden",
        width: 100,
        height: 100
    },
    profileLevelContainer: {
        backgroundColor: constants.ORANGEREGULAR,
        width: 50,
        height: 30,
        borderRadius: 10,
        //borderWidth: 2,
        //borderColor: constants.GREEN,
        marginTop: -25,
        marginBottom: 20,
        marginLeft: 60,
    },
    profileLevelText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.CONTENTFONTSIZE,
        color: constants.TERTIARYCOLOR,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 50
    },
    profileNameBubble: {
        height: 56,
        marginTop: -56,
        marginBottom: 40,
        backgroundColor: constants.PRIMARYCOLORLIGHT,
        borderWidth: 3,
        borderColor: constants.PRIMARYCOLOR + '55',
        borderRadius: 10,
        paddingLeft: 15,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        marginLeft: "auto",
        marginRight: "auto"
    },
    profileNameContainer: {
        height: "100%",
        marginRight: 10,
        justifyContent: "center",
    },
    profileName: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.PRIMARYCOLOR
    },
    knownWordsContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "auto",
        marginBottom: "auto"
    },
    knownWords: {
        fontSize: constants.H1FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK,
        marginLeft: "auto",
        marginRight: "auto"
    },
    knownWordsSubheader: {
        fontSize: constants.H3FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.GREY,
        marginLeft: "auto",
        marginRight: "auto"
    },
    followCountContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "auto",
        marginBottom: "auto"
    },
    followCount: {
        fontSize: constants.H1FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK,
        marginLeft: "auto",
        marginRight: "auto"
    },
    followCountSubheader: {
        fontSize: constants.H3FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.GREY,
        marginLeft: "auto",
        marginRight: "auto"
    }
});