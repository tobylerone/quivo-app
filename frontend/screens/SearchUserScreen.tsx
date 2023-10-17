import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { SearchBar } from "react-native-elements";
import { useState, useEffect, useContext } from "react";
import UserContext from '../contexts/UserContext';
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import * as constants from "../constants";
import client from "../utils/axios";

export default function SearchUserScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser } = useContext(UserContext);
    
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
            <SearchBar
                inputStyle={{backgroundColor: constants.SECONDARYCOLOR}}
                containerStyle={{backgroundColor: constants.SECONDARYCOLOR, borderWidth: 1, padding: 0}}
                inputContainerStyle={{backgroundColor: constants.SECONDARYCOLOR}}
                placeholderTextColor={constants.PRIMARYCOLOR}
                placeholder={'Enter username'}
            />
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
                                    user: currentUser.username,
                                    following: item.username,
                                    withCredentials: true
                                    }
                                ).then(function(res) {   
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
    userList: {
        height: "100%",
        marginTop: 10,
    },
    userListItem: {
        flexDirection: "row",
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: constants.PRIMARYCOLOR,
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
        backgroundColor: constants.TERTIARYCOLOR,
        padding: 5,
        borderRadius: 5
    },
    followButtonText: {
        fontSize: constants.CONTENTFONTSIZE
    }
});