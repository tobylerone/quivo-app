import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { FontAwesome, Entypo } from '@expo/vector-icons'

import HomeScreen from "../screens/HomeScreen";
import LearnScreen from "../screens/LearnScreen";
import WorkoutDetailScreen from "../screens/WorkoutDetailScreen";
import AccountScreen from "../screens/AccountScreen";
import AccountSettingsScreen from "../screens/AccountSettingsScreen";
import AccountLanguagesScreen from "../screens/AccountLanguagesScreen";
import WordListScreen from "../screens/WordListScreen";
import FollowListScreen from "../screens/FollowListScreen";
import { blue } from "react-native-reanimated";
import * as constants from "../constants";


const greenBackground = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: constants.SECONDARYCOLOR
    },
  };

export default function Navigation () {
return(
    <NavigationContainer theme={greenBackground}>
    <RootNavigator/>
    </NavigationContainer>
    )
}

const Stack= createNativeStackNavigator()

const StandardTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
        activeOpacity={1}
        style={{
            top: -2,
            flexDirection: "row",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            shadowOpacity: 0
            //... styles.shadow
        }}
        onPress={onPress}
    >
        <View>{children}</View>
    </TouchableOpacity>
);

const CentralTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
        activeOpacity={1}
        style={{
            top: -20,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            flex: 1

            //... styles.shadow
        }}
        onPress={onPress}
    >
        <View
            style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                borderColor: constants.SECONDARYCOLOR,
                borderWidth: 3,
                backgroundColor: constants.PRIMARYCOLOR,
            }}
        >
            {children}
        </View>
    </TouchableOpacity>
);

function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Root"
                component={BottomTabNavigator}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="WorkoutDetail"
                component={WorkoutDetailScreen as any}
                options={{title: ""}}
            />
            <Stack.Screen
                name="AccountSettings"
                component={AccountSettingsScreen as any}
                options={{
                    title: "Settings",
                    headerStyle: {
                        backgroundColor: constants.SECONDARYCOLOR
                    },
                    headerTintColor: constants.PRIMARYCOLOR,
                    headerShadowVisible: false
                }}
            />
            <Stack.Screen
                name="AccountLanguages"
                component={AccountLanguagesScreen as any}
                options={{
                    title: "Your Languages",
                    headerStyle: {
                        backgroundColor: constants.SECONDARYCOLOR
                    },
                    headerTintColor: constants.PRIMARYCOLOR,
                    headerShadowVisible: false
                }}
            />
            <Stack.Screen
                name="FollowList"
                component={FollowListScreen as any}
                options={{
                    title: "Relations",
                    headerStyle: {
                        backgroundColor: constants.SECONDARYCOLOR
                    },
                    headerTintColor: constants.PRIMARYCOLOR,
                    headerShadowVisible: false
                }}
            />
            <Stack.Screen
                name="WordList"
                component={WordListScreen as any}
                options={{
                    title: "Your Known Words",
                    headerStyle: {
                        backgroundColor: constants.SECONDARYCOLOR
                    },
                    headerTintColor: constants.PRIMARYCOLOR,
                    headerShadowVisible: false
                }}
            />
        </Stack.Navigator>
        )
}

const BottomTab= createBottomTabNavigator()

function BottomTabNavigator() {
    return(
        <BottomTab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarShowLabel: false,
                tabBarInactiveTintColor: constants.OFFWHITE,
                tabBarActiveTintColor: constants.TERTIARYCOLOR,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 25,
                    left: 20,
                    right: 20,
                    backgroundColor: constants.PRIMARYCOLOR,
                    borderRadius: 20,
                    marginTop: 20,
                    height: 60,
                    //... styles.shadow
                },
            }}
        >
            <BottomTab.Screen 
             name="Home"
             component={HomeScreen as any}
             options={{
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                    <FontAwesome name="home" size={size} color={color} />
                ),
                tabBarButton: (props) => (
                    <StandardTabBarButton {... props} />
                )
             }}
            />
            <BottomTab.Screen 
             name="Learn"
             component={LearnScreen as any}
             options={{
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                    <FontAwesome name="align-justify" size={size} color={color} />
                ),
                tabBarButton: (props) => (
                    <CentralTabBarButton {... props} />
                )
             }}
            />
            <BottomTab.Screen 
             name="Account"
             component={AccountScreen as any}
             options={{
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                    <FontAwesome name="user" size={size} color={color} />
                ),
                tabBarButton: (props) => (
                    <StandardTabBarButton {... props} />
                )
             }}
            />
        </BottomTab.Navigator>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#7F5DF0",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
});