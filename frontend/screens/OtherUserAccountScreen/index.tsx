import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, SafeAreaView, Text, Image, FlatList } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
// Constants
import * as constants from "../../constants";
// Contexts
import UserContext from "../../contexts/UserContext";
// Utils
import { calcLevel } from "../../utils/functions";
// Assets
import { avatarImageMap } from "../../assets/avatars/avatarMaps";
import { flagImageSources } from "../../assets/img/imageSources";
// Components
import NavBar from "../../components/NavBar";
import FollowButton from "../../components/FollowButton";

export default function OtherUserAccountScreen({route, navigation}: NativeStackHeaderProps) {

    const { currentUser, knownWords } = useContext(UserContext);

    // TODO: In future, just pass the userId and make a fresh API request for user data
    const { user } = route.params;

    // Get the language that the user knows the most words in to calculate the level
    let maxWordNum: number = Object.values(user.known_words_count).reduce((a, b) => Math.max(a, b));
    const { level } = calcLevel(maxWordNum, 30000);
    
    return (
        <SafeAreaView style={styles.container}>
            <NavBar navigation={navigation}/>
            <View style={styles.userContainer}>
                <View style={styles.topContainer}>
                    <Text style={styles.usernameText}>{user.username}</Text>
                    <View style={styles.streakContainer}>
                        <Image 
                            source={require('../../assets/streak-flame.png')}
                            style={styles.streakImage}
                        />
                        <Text style={styles.streakText}>{user.streak}</Text>
                    </View>
                    <Text style={styles.levelText}>lv. {level}</Text>
                    {/* TODO: This doesn't update user.user_is_following which can lead to errors. Need
                    to get fresh user data every time this page is loaded rather than passing the object
                    */}
                    {user.user_id !== currentUser.user_id &&
                        <View style={styles.followButtonContainer}>
                            <FollowButton 
                                initUserIsFollowing={user.user_is_following}
                                followee_id={user.user_id}
                            />
                        </View>
                    }
                </View>
                <View style={styles.imageAndFollowContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={avatarImageMap[user.avatar_id]}
                            style={styles.profileImage}
                        />
                    </View>
                    <View style={styles.followOuterContainer}>
                        <View style={[styles.followSubContainer, styles.followSubContainerTop]}>
                            <View style={styles.followTextContainer}>
                                <Text style={styles.followText}>Followers</Text>
                                <Text style={styles.followCountText}>{user.followers_count}</Text>
                            </View>
                        </View>
                        <View style={styles.followSubContainer}>
                            <View style={styles.followTextContainer}>
                                <Text style={styles.followText}>Following</Text>
                                <Text style={styles.followCountText}>{user.following_count}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <FlatList
                    data={Object.keys(user.known_words_count)}
                    style={styles.knownWordsList}
                    bounces={false}
                    horizontal={true}
                    renderItem={({item}) => (
                        <>
                        {user.known_words_count[item] !== 0 &&
                        <View style={styles.knownWordsPill}>
                            <View style={styles.flagImageContainer}>
                                <Image
                                    source={flagImageSources[item]}
                                    style={styles.flagImage}
                                />
                            </View>
                            <Text style={styles.knownWordsText}>
                                {user.known_words_count[item].toLocaleString("en-US")}
                            </Text>
                        </View>
                        }
                        </>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 20
    },
    userContainer: {
        marginTop: 10,
        borderWidth: 3,
        borderColor: constants.GREY,
        borderRadius: 10,
        overflow: 'hidden'
    },
    topContainer: {
        flexDirection: 'row',
        backgroundColor: constants.SECONDARYCOLOR,
        borderBottomWidth: 3,
        borderBottomColor: constants.GREY,
        padding: 5
    },
    usernameText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK,
        padding: 10
    },
    levelText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.SUCCESSCOLOR,
        marginLeft: 5,
        padding: 10
    },
    streakContainer: {
        flexDirection: 'row',
        height: 40,
        marginLeft: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    streakImage: {
        width: 30,
        height: 30,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    streakText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.ORANGE,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    followButtonContainer: {
        //marginLeft: 'auto',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    imageAndFollowContainer: {
        flexDirection: 'row',
        height: 100,
        borderBottomWidth: 3,
        borderBottomColor: constants.GREY
    },
    imageContainer: {
        borderRightWidth: 3,
        borderRightColor: constants.GREY
    },
    followOuterContainer: {
        flexDirection: 'column',
        width: '100%',
        marginLeft: -100
    },
    followSubContainer: {
        height: 50,
        marginLeft: 100,
        paddingLeft: 10,
        paddingRight: 15
    },
    followSubContainerTop: {
        borderBottomWidth: 3,
        borderBottomColor: constants.GREY
    },
    followTextContainer: {
        flexDirection: 'row',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    followText: {
        fontFamily: constants.FONTFAMILY,
        fontSize: constants.H3FONTSIZE,
        color: constants.BLACK,
    },
    followCountText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.PRIMARYCOLOR,
        marginLeft: 'auto'
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    // Known Words
    knownWordsList: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 5,
        marginBottom: 5
    },
    knownWordsPill: {
        flexDirection: 'column',
        marginTop: 'auto',
        marginBottom: 'auto',
        marginHorizontal: 5,
        borderRadius: 10,

    },
    flagImageContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        borderWidth: 3,
        borderColor: constants.GREY,
        borderRadius: 10,
        overflow: 'hidden'
    },
    knownWordsText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H3FONTSIZE,
        color: constants.BLACK,
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    flagImage: {
        width: 40,
        height: 30,
        borderRadius: 5,
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    knownWords: {
        fontSize: constants.CONTENTFONTSIZE
    }
});