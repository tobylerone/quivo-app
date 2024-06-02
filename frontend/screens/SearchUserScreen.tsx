import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image, ActivityIndicator, TouchableNativeFeedback } from "react-native";
import { SearchBar } from "react-native-elements";
import PNG from 'pngjs';
import { useState, useEffect, useContext } from "react";
import UserContext from '../contexts/UserContext';
import NavBar from "../components/NavBar";
import FollowButton from "../components/FollowButton";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
// Assets
import { flagImageSources } from "../assets/img/imageSources";
// Constants
import * as constants from "../constants";
// Components
import RaisedButton from "../components/RaisedButton";
// Utils
import client from "../utils/axios";

interface IUser {
    email: string,
    followers_count: number,
    following_count: number,
    known_languages: number[], 
    known_words_count: object,
    user_id: number,
    user_is_following: boolean,
    username: string
}

interface IUserListItem {
    index: number,
    user: IUser,
    navigation: any
}

const UserListItem = ({index, user, navigation}: IUserListItem) => {

    const { currentUser, setCurrentUser } = useContext(UserContext);
    
    // Get an ordered list of the codes of theuser's top three languages 
    const topLanguageCodes = Object.entries(user.known_words_count).sort((a, b) => b[1] - a[1]).map(([key]) => key).slice(0, 3);

    // Current user check not super robust
    // This is pretty much the same as FollowListScreen's FollowItem so should
    // reuse this
    return (
        <>
        {user.user_id !== currentUser.user_id &&
        <View
            style={{
                borderTopWidth: index > 0 ? 3 : 0,
                ...styles.userListItem}}
            >
            <TouchableOpacity
                activeOpacity={1}
                style={styles.leftBoxContainer}
                onPress={() => navigation.navigate('OtherUserAccount',
                {user: user}
                )}
                >
                <View style={styles.username}>
                    <Text style={styles.usernameText}>
                        {user.username}
                    </Text>
                </View>
                <FlatList
                    data={topLanguageCodes}
                    //style={styles.languagePopupList}
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
            </TouchableOpacity>
            <View style={styles.followButtonContainer}>
                <FollowButton 
                    initUserIsFollowing={user.user_is_following}
                    followee_id={user.user_id}
                />
            </View>
        </View>
        }
        </>
    );
}

export default function SearchUserScreen({navigation}: NativeStackHeaderProps) {
    
    // pour l'instant j'aimerais simplement montrer une liste de tous les utilisateurs
    const [users, setUsers] = useState<(IUser[] | null)>(null);
    const [searchFieldText, setSearchFieldText] = useState<string>('');
      
    useEffect(() => {
        //getUsers();
    }, []);

    const getUsers = async (search_term?: string | null) => {
        let res;
        try {
            if (search_term){
                res = await client.get('api/users?search=' + search_term);
            } else {
                res = await client.get('api/users');
            }
            setUsers(res.data);
        } catch (e) {
            console.error(e);
        }
        };

    return (
        <SafeAreaView style={styles.container}>
            <NavBar title={'Search For Users'} navigation={navigation}/>
            <View style={[styles.searchFieldContainer, styles.shadow]}>
                <View style={styles.searchBarContainer}>
                <TextInput
                style={styles.searchInput}
                placeholder="Search by username"
                placeholderTextColor={constants.GREY}
                onChangeText={(text) => setSearchFieldText(text)}
                />
                </View>
                <View style={styles.searchButtonContainer}>
                    <RaisedButton
                        onPress={() => getUsers(searchFieldText)}
                        options={{
                            ...RaisedButton.defaultProps.options,
                            width: 50,
                            height: 50,
                            backgroundColor: constants.TERTIARYCOLOR,
                            borderColor: constants.PURPLEREGULAR,
                            shadowColor: constants.PURPLEREGULAR
                        }}
                    >
                        <View style={styles.searchButtonIconContainer}>
                            <FontAwesomeIcon icon={faSearch} size={25} color={constants.PURPLEREGULAR} />
                        </View>
                    </RaisedButton>
                </View>
            </View>
            {users ?
                users.length === 0 ?
                    <View>
                        <Image style={styles.parrotImage} source={require('../assets/parrot-confused-med.png')}/>
                        <Text style={styles.noUsersMessageText}>No users found :(</Text>
                    </View>
                : <FlatList
                    style={styles.userList}
                    data={users}
                    bounces={false}
                    showsVerticalScrollIndicator={false} 
                    showsHorizontalScrollIndicator={false}
                    overScrollMode="never"
                    removeClippedSubviews={true}
                    renderItem={({item, index}: {item: IUser, index: number}) => <UserListItem index={index} user={item} navigation={navigation} />}
                />
            : <>{/*<ActivityIndicator style={styles.activityIndicator} size="large" color={constants.PRIMARYCOLOR} />*/}</>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
        backgroundColor: constants.TERTIARYCOLOR
    },
    searchFieldContainer: {
        flexDirection: 'row',
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: constants.TERTIARYCOLOR
    },
    searchBarContainer: {
        width: '100%'
    },
    leftBoxContainer: {
    },
    searchInput: {
        height: 50,
        fontSize: constants.H2FONTSIZE,
        flex: 1,
        marginLeft: 10,
    },
    searchButtonContainer: {
        marginLeft: 'auto',
        marginTop: 17,
        marginRight: 7,
        height: 60
    },
    searchButtonIconContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    noUsersMessageText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.BLACK,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },
    parrotImage: {
        width: 60,
        height: 60,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    userList: {
        height: "100%",
    },
    userListItem: {
        flexDirection: "row",
        justifyContent: 'space-between',
        backgroundColor: constants.TERTIARYCOLOR,
        borderTopColor: constants.PURPLELIGHT,
        //borderRadius: 10,
        //marginBottom: 5,
        padding: 10
    },
    username: {
        alignSelf: "flex-start",
        marginBottom: 5
    },
    usernameText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK
    },
    knownWordsPill: {
        flexDirection: "row",
        backgroundColor: constants.PURPLELIGHT,
        height: 30,
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
        fontSize: constants.CONTENTFONTSIZE,
        color: constants.BLACK,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    flagImage: {
        width: 20,
        height: 15,
        borderRadius: 5,
        marginRight: 3,
        marginTop: "auto",
        marginBottom: "auto"
    },
    knownWords: {
        fontSize: constants.CONTENTFONTSIZE
    },
    followButtonContainer: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    followButton: {
        alignSelf: "flex-end",
        padding: 10,
        borderRadius: 10
    },
    followButtonText: {
        fontSize: constants.CONTENTFONTSIZE,
        color: constants.TERTIARYCOLOR
    },
    activityIndicator: {
        marginTop: 20
    },
    shadow: {
        shadowColor: constants.BLACK,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.15,
        shadowRadius: 1,
        elevation: 5
    }
});