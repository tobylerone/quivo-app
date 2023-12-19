import { StyleSheet, View, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons'

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import LearnScreen from "../screens/LearnScreen";
import AccountScreen from "../screens/AccountScreen";
import AccountSettingsScreen from "../screens/AccountSettingsScreen";
import SearchUserScreen from "../screens/SearchUserScreen";
import AccountLanguagesScreen from "../screens/AccountLanguagesScreen";
import WordListScreen from "../screens/WordListScreen";
import FollowListScreen from "../screens/FollowListScreen";
import * as constants from "../constants";


const whiteBackground = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: constants.TERTIARYCOLOR
    },
  };

export function AuthNavigation () {
    return(
        <NavigationContainer theme={whiteBackground}>
            <AuthNavigator/>
        </NavigationContainer>
    )
}

export function Navigation () {
return(
    <NavigationContainer theme={whiteBackground}>
        <MainNavigator/>
    </NavigationContainer>
    )
}

const AuthStack = createNativeStackNavigator()
const MainStack= createNativeStackNavigator()

function AuthNavigator() {
    return (
        <AuthStack.Navigator>
            <MainStack.Screen
                name="LoginScreen"
                component={LoginScreen as any}
                options={{headerShown: false}}
            />
            <MainStack.Screen
                name="RegisterScreen"
                component={RegisterScreen as any}
                options={{headerShown: false}}
            />
        </AuthStack.Navigator>
    );
}

function MainNavigator() {
    return (
        <MainStack.Navigator>
            <MainStack.Screen
                name="Root"
                component={BottomTabNavigator}
                options={{headerShown: false}}
            />
            <MainStack.Screen
                name="AccountSettings"
                component={AccountSettingsScreen as any}
                options={{
                    title: "Settings",
                    headerStyle: {
                        backgroundColor: constants.TERTIARYCOLOR
                    },
                    headerTintColor: constants.BLACK,
                    headerShadowVisible: false
                }}
            />
            <MainStack.Screen
                name="SearchUser"
                component={SearchUserScreen as any}
                options={{
                    title: "Search for users",
                    headerStyle: {
                        backgroundColor: constants.TERTIARYCOLOR
                    },
                    headerTintColor: constants.BLACK,
                    headerShadowVisible: false
                }}
            />
            <MainStack.Screen
                name="AccountLanguages"
                component={AccountLanguagesScreen as any}
                options={{
                    title: "Your Languages",
                    headerStyle: {
                        backgroundColor: constants.TERTIARYCOLOR
                    },
                    headerTintColor: constants.BLACK,
                    headerShadowVisible: false
                }}
            />
            <MainStack.Screen
                name="FollowList"
                component={FollowListScreen as any}
                options={{
                    title: "Relations",
                    headerStyle: {
                        backgroundColor: constants.TERTIARYCOLOR
                    },
                    headerTintColor: constants.BLACK,
                    headerShadowVisible: false
                }}
            />
            <MainStack.Screen
                name="WordList"
                component={WordListScreen as any}
                options={{
                    title: "Known Words",
                    headerStyle: {
                        backgroundColor: constants.TERTIARYCOLOR
                    },
                    headerTintColor: constants.BLACK,
                    headerShadowVisible: false
                }}
            />
        </MainStack.Navigator>
        )
}

const StandardTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
        activeOpacity={1}
        style={{
            top: -2,
            flexDirection: "row",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            shadowOpacity: 0,
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
                //borderColor: constants.BLACK,
                //borderWidth: 3,
                backgroundColor: constants.SECONDARYCOLOR,
                ...styles.shadow
            }}
        >
            {children}
        </View>
    </TouchableOpacity>
);

const BottomTab = createBottomTabNavigator();

function BottomTabNavigator() {
    return(
        <BottomTab.Navigator
            initialRouteName="Learn"
            screenOptions={{
                tabBarShowLabel: false,
                tabBarInactiveTintColor: constants.BLACK,
                tabBarActiveTintColor: constants.PRIMARYCOLOR,
                tabBarStyle: {
                    position: "absolute",
                    zIndex: 0,
                    //bottom: 25,
                    //left: 20,
                    //right: 20,
                    backgroundColor: constants.SECONDARYCOLOR,
                    marginTop: 20,
                    height: 60,
                    shadowColor: constants.TERTIARYCOLOR,
                    shadowRadius: 0,
                    border: constants.TERTIARYCOLOR
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
        shadowColor: constants.BLACK,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 3
    }
});