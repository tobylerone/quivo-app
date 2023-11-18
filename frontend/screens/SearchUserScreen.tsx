import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { SearchBar } from "react-native-elements";
import { useState, useEffect, useContext } from "react";
import UserContext from '../contexts/UserContext';
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import * as constants from "../constants";
import client from "../utils/axios";

export default function SearchUserScreen({navigation}: NativeStackHeaderProps) {

    //Not sure if you can import hook setters like this but it didn't seem to work
    const { currentUser, setCurrentUser } = useContext(UserContext);
    
    // pour l'instant je veux simplement montrer une liste de tous les utilisateurs
    const [users, setUsers] = useState([]);
      
    useEffect(() => {
        const getUsers = async () => {
        try {
            const res = await client.get('api/users');
            setUsers(res.data);
        } catch (e) {
            console.error(e);
        }
        };

        getUsers();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchFieldContainer}>
                <View style={styles.searchBarContainer}>
                    <SearchBar
                        inputStyle={{backgroundColor: constants.SECONDARYCOLOR}}
                        containerStyle={{backgroundColor: constants.SECONDARYCOLOR, borderWidth: 0, padding: 0}}
                        inputContainerStyle={{backgroundColor: constants.SECONDARYCOLOR}}
                        placeholderTextColor={constants.GREY}
                        placeholder={'Search by username'}
                    />
                </View>
                <TouchableOpacity style={styles.searchButton}>
                    <View style={styles.searchButtonIconContainer}>
                        <FontAwesome name="search" size={25} color={constants.TERTIARYCOLOR} />
                        </View>
                </TouchableOpacity>
            </View>
            <FlatList
                style={styles.userList}
                data={users}
                //keyExtractor={(item) => item.username}
                renderItem={({ item }) => (
                    <View style={styles.userListItem}>
                        <View style={styles.username}>
                            <Text style={styles.usernameText}>
                                {item.username}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.followButton}
                            onPress={() => {
                                client.post(
                                    "/api/follow",
                                    {
                                    follower: currentUser.user_id,
                                    followee: item.user_id,
                                    withCredentials: true
                                    }
                                ).then(function(res) {  
                                    console.log(res.data)
                                    //Increase the user's following count on the frontend if post request successful
                                    //setCurrentUser(prevState => ({
                                    //    ...prevState,
                                    //    following_count: currentUser.following_count + 1
                                    //}));
                                }).catch(function(e) {
                                    console.log(e.response.data)
                                });
                            }}
                            >
                            <Text style={styles.followButtonText}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                )}
                />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //paddingTop: StatusBar.currentHeight,
        marginHorizontal: 20,
    },
    searchFieldContainer: {
        flexDirection: 'row',
        borderWidth: 2
    },
    searchBarContainer: {
        width: 100
    },
    searchButton: {
        backgroundColor: constants.PRIMARYCOLOR,
        alignSelf: "flex-end",
        width: 60,
        borderRadius: 10,
        height: 60,
        justifyContent: 'center',
        
    },
    searchButtonIconContainer: {
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
        //borderRadius: 5,
        marginBottom: 5,
        padding: 10
    },
    username: {
        alignSelf: "flex-start"
    },
    usernameText: {
        fontSize: constants.H3FONTSIZE
    },
    followButton: {
        alignSelf: "flex-end",
        backgroundColor: constants.PRIMARYCOLOR,
        padding: 10,
        borderRadius: 10
    },
    followButtonText: {
        fontSize: constants.CONTENTFONTSIZE,
        color: constants.TERTIARYCOLOR
    }
});