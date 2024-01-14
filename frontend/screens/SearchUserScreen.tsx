import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image, ActivityIndicator } from "react-native";
import { SearchBar } from "react-native-elements";
import PNG from 'pngjs';
import { useState, useEffect, useContext } from "react";
import UserContext from '../contexts/UserContext';
import NavBar from "../components/NavBar";
import FollowButton from "../components/FollowButton";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import * as constants from "../constants";
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
    user: IUser
}

const UserListItem = ({user}: IUserListItem) => {

    const { currentUser, setCurrentUser } = useContext(UserContext);

    const flagImageSources: Record<string, PNG> = {
        'fr': require('../assets/fr.png'),
        'de': require('../assets/de.png'),
        'ru': require('../assets/ru.png')
    }

    // Current user check not super robust
    // This is pretty much the same as FollowListScreen's FollowItem so should
    // reuse this
    return (
        <>
        {user.user_id !== currentUser.user_id &&
        <View style={styles.userListItem}>
            <View style={styles.leftBoxContainer}>
                <View style={styles.username}>
                    <Text style={styles.usernameText}>
                        {user.username}
                    </Text>
                </View>
                <FlatList
                    data={Object.keys(user.known_words_count)}
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
            </View>
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
            <View style={styles.searchFieldContainer}>
                <View style={styles.searchBarContainer}>
                <TextInput
                style={styles.searchInput}
                placeholder="Search by username"
                placeholderTextColor={constants.GREY}
                onChangeText={(text) => setSearchFieldText(text)}
                />
                </View>
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => getUsers(searchFieldText)}
                >
                    <View style={styles.searchButtonIconContainer}>
                        <FontAwesomeIcon icon={faSearch} size={25} color={constants.TERTIARYCOLOR} />
                        </View>
                </TouchableOpacity>
            </View>
            {users ?
                users.length === 0 ?
                    <View>
                        <Image style={styles.parrotImage} source={require('../assets/parrot-confused.png')}/>
                        <Text style={styles.noUsersMessageText}>No users Found!</Text>
                    </View>
                : <FlatList
                    style={styles.userList}
                    data={users}
                    bounces={false}
                    renderItem={({item}: {item: IUser}) => <UserListItem user={item} />}
                />
            : <>{/*<ActivityIndicator style={styles.activityIndicator} size="large" color={constants.PRIMARYCOLOR} />*/}</>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: 50
    },
    searchFieldContainer: {
        flexDirection: 'row',
        backgroundColor: constants.SECONDARYCOLOR,
        borderRadius: 10,
        marginBottom: 10
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
    searchButton: {
        backgroundColor: constants.PRIMARYCOLOR,
        marginLeft: 'auto',
        width: 60,
        borderRadius: 10,
        height: 60,
        justifyContent: 'center',
        
    },
    searchButtonIconContainer: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    noUsersMessageText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.PRIMARYCOLOR,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },
    parrotImage: {
        width: 60,
        height: 84,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    userList: {
        height: "100%",
        marginTop: 10,
    },
    userListItem: {
        flexDirection: "row",
        justifyContent: 'space-between',
        backgroundColor: constants.SECONDARYCOLOR,
        borderRadius: 10,
        marginBottom: 5,
        padding: 10
    },
    username: {
        alignSelf: "flex-start"
    },
    usernameText: {
        fontSize: constants.H3FONTSIZE,
        color: constants.BLACK
    },
    knownWordsPill: {
        flexDirection: "row",
        backgroundColor: constants.PRIMARYCOLOR,
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
        fontFamily: constants.FONTFAMILY,
        fontSize: constants.CONTENTFONTSIZE,
        color: constants.TERTIARYCOLOR,
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
    followButtonContainer: {},
    followButton: {
        alignSelf: "flex-end",
        backgroundColor: constants.PRIMARYCOLOR,
        padding: 10,
        borderRadius: 10
    },
    followButtonText: {
        fontSize: constants.CONTENTFONTSIZE,
        color: constants.TERTIARYCOLOR
    },
    activityIndicator: {
        marginTop: 20
    }
});