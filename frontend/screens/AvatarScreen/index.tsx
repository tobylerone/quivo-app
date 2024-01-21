import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import PNG from 'pngjs';
// Utils
import { avatarImageMap, avatarLevelUnlock, avatarLevelColors } from '../../assets/avatars/avatarMaps';
import { calcLevel } from "../../utils/functions";
// Constants
import * as constants from '../../constants';
// Contexts
import UserContext from '../../contexts/UserContext';
// Components
import NavBar from "../../components/NavBar";

export default function AvatarScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser, knownWords } = useContext(UserContext);
    
    const renderAvatar = (
        id: string,
        source: any,
        color: string,
        isUnlocked: boolean,
        isActive: boolean
        ) => (
        <>
        <TouchableOpacity
            style={styles.avatarContainer}
            activeOpacity={1}
            disabled={!isUnlocked}
            >
            <View style={{
                backgroundColor: isActive // Comparing int to string here
                    ? constants.ORANGE
                    : color,
                ...styles.avatarContainerShadow
                }}></View>
            <View style={{
                borderColor: isActive
                    ? constants.ORANGE
                    : color,
                ...styles.avatarImageContainer
                }}>
            <Image
                style={{
                    opacity: isUnlocked ? 1 : 0.3,
                    ...styles.avatarImage
                }}
                source={source}
            />
            </View>
        </TouchableOpacity>
        </>
    );

    const renderSubsection = (
        level: (0|10|20|30|40|50|60|70|80|90|100),
        avatarIds: number[],
        userLevel: number
        ) => {

        const isUnlocked = userLevel > level;
        const color = isUnlocked ? avatarLevelColors[level] : constants.GREY;

        return (
            <View
                style={{
                    borderColor: color,
                    ...styles.subsectionContainer
                }}
                >
                <View style={{
                    backgroundColor: color,
                    ...styles.subsectionTitleContainer
                    }}>
                    <Text style={styles.subsectionTitleText}>Level {level}+</Text>
                    </View>
                <View style={styles.subsectionAvatarsContainer}>
                    {avatarIds.map((avatar_id: number) => renderAvatar(
                        avatar_id,
                        avatarImageMap[avatar_id],
                        color,
                        isUnlocked,
                        avatar_id === currentUser.avatar_id
                    ))}
                </View>
            </View>
        );
    }

    return (
    <SafeAreaView style={styles.container}>
        <NavBar title='Choose an Avatar' navigation={navigation} />
        <View style={styles.subsectionsContainer}>
            {/*Object.entries(avatarImageMap).map(([key, value]) => renderAvatar(key, value))*/}
            {Object.entries(avatarLevelUnlock).map(([key, value]) => renderSubsection(key, value, calcLevel(knownWords, 30000).level))}
        </View>
    </SafeAreaView>
    );
 }

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginHorizontal: 0,
        marginTop: 50,
        flex: 1
    },
    subsectionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    avatarContainer: {
        marginHorizontal: 5,
        marginBottom: 20,
        backgroundColor: constants.TERTIARYCOLOR
    },
    avatarContainerShadow: {
        width: 100,
        height: 30,
        marginTop: 75,
        borderRadius: 10
    },
    avatarImageContainer: {
        width: 100,
        height: 100,
        borderWidth: 3,
        borderRadius: 10,
        marginTop: -105,
        backgroundColor: constants.TERTIARYCOLOR
    },
    avatarImage: {
        width: 80,
        height: 80,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    // renderSubsection
    subsectionContainer: {
        flexDirection: 'column',
        borderWidth: 3,
        width: '100%',
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden'
    },
    subsectionTitleContainer: {
        marginBottom: 10,
        padding: 10
    },
    subsectionTitleText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.TERTIARYCOLOR,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    subsectionAvatarsContainer: {
        flexDirection: 'row',
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});