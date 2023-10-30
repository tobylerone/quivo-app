import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useState, useEffect, useContext } from "react";
import UserContext from '../contexts/UserContext';
import FollowItem from "../components/FollowItem";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import * as constants from "../constants";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import client from "../utils/axios";

const followers = [
    {
        name: "wattle01",
        wordsKnown: [
            {language: "fr", words: 409},
            {language: "de", words: 132}
        ]
    },
    {
        name: "timly1644243",
        wordsKnown: [
            {language: "es", words: 1432},
            {language: "ru", words: 223},
            {language: "fr", words: 15}
        ]
    },
    {
        name: "quentinbobbles33",
        wordsKnown: [
            {language: "it", words: 1032},
            {language: "fr", words: 223},
            {language: "po", words: 15}
        ]
    },
];

const following = [
    {
        name: "wattle01",
        wordsKnown: [
            {language: "ru", words: 209},
            {language: "de", words: 201},
            {language: "fr", words: 25}
        ]
    },
    {
        name: "leopoldII",
        wordsKnown: [
            {language: "fr", words: 200},
            {language: "ru", words: 138},
            {language: "it", words: 19}
        ]
    },
    {
        name: "franklydinkly",
        wordsKnown: [
            {language: "po", words: 966},
            {language: "de", words: 45}
        ]
    },
    {
        name: "extraboi",
        wordsKnown: [
            {language: "de", words: 2755},
            {language: "ru", words: 12}
        ]
    },
];

function FollowersScreen() {

    const { currentUser } = useContext(UserContext);
    const [followers, setFollowers] = useState(null);

    useEffect(() =>{
        // Get accounts the user is followed by
        client.get(
            'api/users/'+ currentUser.user_id +'/followers/'
        ).then(function(res) {  
            setFollowers(res.data);
        }).catch(function(e) {
            console.log(e.response.data)
        });

    }, []);

    return (
        <View style={styles.followListContainer}>
            <FlatList
                style={styles.followList}
                data={followers}
                renderItem={({item}) => <FollowItem user={item} />}
            />
        </View>
    );
}

function FollowingScreen() {

    const { currentUser } = useContext(UserContext);
    const [following, setFollowing] = useState(null);

    useEffect(() =>{

        // Get accounts the user is following
        client.get(
            'api/users/'+ currentUser.user_id +'/following/'
        ).then(function(res) {
            setFollowing(res.data);
        }).catch(function(e) {
            console.log(e.response.data)
        });

    }, []);

    return (
        <View style={styles.followListContainer}>
            <FlatList
                style={styles.followList}
                data={following}
                renderItem={({item}) => <FollowItem user={item} />}
            />
        </View>
    );
}

const Tab = createMaterialTopTabNavigator();

export default function FollowListScreen({route}: any) {

    const { initialTab } =  route.params;

    return (
        <Tab.Navigator
            initialRouteName={initialTab}
            screenOptions={{
                tabBarActiveTintColor: constants.PRIMARYCOLOR,
                tabBarInactiveTintColor: constants.SECONDARYCOLOR,
                tabBarIndicatorStyle: {
                    backgroundColor: constants.SECONDARYCOLOR,
                    height: 40,
                    width: (constants.SCREEN_WIDTH / 2) - 30,
                    marginLeft: 25,
                    marginBottom: 10,
                    borderRadius: 15
                },
                tabBarScrollEnabled: true,
                tabBarLabelStyle: {
                    fontSize: constants.H2FONTSIZE,
                    fontWeight: "bold",
                    textTransform: "none"
                },
                tabBarItemStyle: {
                    //backgroundColor: constants.SECONDARYCOLOR,
                    height: 60,
                    width: (constants.SCREEN_WIDTH / 2) - 20
                },
                tabBarStyle: {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: constants.PRIMARYCOLOR,
                    //borderRadius: 15,
                    marginTop: 10,
                    //marginLeft: 15,
                    //marginRight: 15,
                    shadowOpacity: 0,
                    shadowRadius: 0,
                    shadowOffset: 0,
                    shadowColor: constants.SECONDARYCOLOR
                }
            }}
        >
            <Tab.Screen name="Followers">
                {() => <FollowersScreen />}
            </Tab.Screen>
            <Tab.Screen name="Following">
                {() => <FollowingScreen />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    followListContainer: {
        height: "100%",
        margin: 15
    },
    followList: {

    }
});
