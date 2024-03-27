import React, { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, Text, Image, FlatList } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
// Constants
import * as constants from "../../constants";
// Assets
import { avatarImageMap } from "../../assets/avatars/avatarMaps";
import { flagImageSources } from "../../assets/img/imageSources";
// Components
import NavBar from "../../components/NavBar";
import FollowButton from "../../components/FollowButton";

export default function OtherUserAccountScreen({route, navigation}: NativeStackHeaderProps) {

    // TODO: In future, just pass the userId and make a fresh API request for user data
    const { user } = route.params;
    
    return (
        <SafeAreaView style={styles.container}>
            <NavBar navigation={navigation}/>
            <View style={styles.userContainer}>
                <View style={styles.topContainer}>
                    <Text style={styles.usernameText}>{user.username}</Text>
                    {/* TODO: This doesn't update user.user_is_following which can lead to errors. Need
                    to get fresh user data every time this page is loaded rather than passing the object
                    */}
                    <View style={styles.followButtonContainer}>
                        <FollowButton 
                            initUserIsFollowing={user.user_is_following}
                            followee_id={user.user_id}
                        />
                    </View>
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
                                {user.known_words_count[item]}
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
        //width: '100%',
        //textAlign: 'center',
        padding: 10
    },
    followButtonContainer: {
        marginLeft: 'auto',
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
        color: constants.BLACK,
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
        marginTop: 10,
        marginBottom: 10
    },
    knownWordsPill: {
        flexDirection: 'row',
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: 5,
        paddingVertical: 5,
        paddingHorizontal: 7,
        borderRadius: 10,

    },
    flagImageContainer: {

    },
    knownWordsText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H3FONTSIZE,
        color: constants.BLACK,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    flagImage: {
        width: 40,
        height: 30,
        borderRadius: 5,
        marginRight: 5,
        marginTop: "auto",
        marginBottom: "auto"
    },
    knownWords: {
        fontSize: constants.CONTENTFONTSIZE
    }
});