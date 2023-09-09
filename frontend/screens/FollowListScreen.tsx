import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native"
import { useEffect } from "react"
import FollowItem from "../components/FollowItem"
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { FontAwesome } from "@expo/vector-icons"
import * as constants from "../constants";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

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
    return (
        <View style={styles.followListContainer}>
            <FlatList 
                data={followers}
                renderItem={({item}) => <FollowItem user={item} />}
            />
        </View>
    );
}

function FollowingScreen() {
    return (
        <View style={styles.followListContainer}>
            <FlatList style={styles.followList}
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
                tabBarIndicatorStyle: {
                    backgroundColor: constants.PRIMARYCOLOR,
                    height: 4
                },
                tabBarScrollEnabled: true,
                tabBarLabelStyle: {
                    fontSize: constants.H2FONTSIZE,
                    fontWeight: "bold",
                    textTransform: "none",
                },
                tabBarItemStyle: {
                    width: "auto",
                    flex: 1
                },
                tabBarStyle: {
                    //height: 60,
                    backgroundColor: constants.SECONDARYCOLOR,
                    marginLeft: "auto",
                    marginRight: "auto",
                    shadowOpacity: 0
                },
            }}
        >
            <Tab.Screen name="Followers" component={FollowersScreen} />
            <Tab.Screen name="Following" component={FollowingScreen} />
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
