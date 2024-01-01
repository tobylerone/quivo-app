import { ReactNode } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faAlignJustify, faUser } from '@fortawesome/free-solid-svg-icons';
//import { faComment } from '@fortawesome/free-regular-svg-icons';
import * as constants from "../constants";

// Auth stack
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

// First login stack
import ChooseFirstLanguageScreen from "../screens/ChooseFirstLanguageScreen";

// Main stack
import HomeScreen from "../screens/HomeScreen";
import LearnScreen from "../screens/LearnScreen";
import AccountScreen from "../screens/AccountScreen";
import AccountSettingsScreen from "../screens/AccountSettingsScreen";
import SearchUserScreen from "../screens/SearchUserScreen";
import AccountLanguagesScreen from "../screens/AccountLanguagesScreen";
import WordListScreen from "../screens/WordListScreen";
import FollowListScreen from "../screens/FollowListScreen";
import FaqScreen from "../screens/FaqScreen";
import ProgressScreen from "../screens/ProgressScreen";

const whiteBackground = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: constants.TERTIARYCOLOR
    },
  };

export function AuthNavigation() {
    return (
        <NavigationContainer theme={whiteBackground}>
            <AuthNavigator/>
        </NavigationContainer>
    )
}

export function FirstLoginNavigation() {
    return (
        <NavigationContainer theme={whiteBackground}>
            <FirstLoginNavigator/>
        </NavigationContainer>
    );
}

export function Navigation() {
    return (
        <NavigationContainer theme={whiteBackground}>
            <MainNavigator/>
        </NavigationContainer>
        )
}

const AuthStack = createNativeStackNavigator()
const FirstLoginStack = createNativeStackNavigator()
const MainStack= createNativeStackNavigator()

function AuthNavigator() {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen
                name="LoginScreen"
                component={LoginScreen as any}
                options={{headerShown: false}}
            />
            <AuthStack.Screen
                name="RegisterScreen"
                component={RegisterScreen as any}
                options={{headerShown: false}}
            />
        </AuthStack.Navigator>
    );
}

function FirstLoginNavigator() {
    return (
        <FirstLoginStack.Navigator>
            <FirstLoginStack.Screen
                name="ChooseFirstLanguageScreen"
                component={ChooseFirstLanguageScreen as any}
                options={{headerShown: false}}
            />
        </FirstLoginStack.Navigator>
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
                options={{ headerShown: false }}
            />
            <MainStack.Screen
                name="SearchUser"
                component={SearchUserScreen as any}
                options={{headerShown: false}}
            />
            <MainStack.Screen
                name="AccountLanguages"
                component={AccountLanguagesScreen as any}
                options={{headerShown: false}}
            />
            <MainStack.Screen
                name="FollowList"
                component={FollowListScreen as any}
                options={{ headerShown: false }}
            />
            <MainStack.Screen
                name="WordList"
                component={WordListScreen as any}
                options={{ headerShown: false }}
            />
            <MainStack.Screen
                name="Faqs"
                component={FaqScreen as any}
                options={{ headerShown: false }}
            />
            <MainStack.Screen
                name="Progress"
                component={ProgressScreen as any}
                options={{ headerShown: false }}
            />
        </MainStack.Navigator>
        )
}

const StandardTabBarButton = ({children, onPress}: {
    children: ReactNode,
    onPress: Function
    }) => (
    <TouchableOpacity
        activeOpacity={1}
        style={styles.standardTabBarButton}
        onPress={onPress}
    >
        <View>{children}</View>
    </TouchableOpacity>
);

const CentralTabBarButton = ({children, onPress}: {
    children: ReactNode,
    onPress: Function
    }) => (
    <TouchableOpacity
        activeOpacity={1}
        style={[styles.centralTabBarButton, styles.shadow]}
        onPress={onPress}
    >
        <View
            style={{
                width: 70,
                height: 70,
                borderRadius: 35,
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
                    backgroundColor: constants.SECONDARYCOLOR,
                    marginTop: 20,
                    height: 60,
                    ...styles.shadow
                },
            }}
        >
            <BottomTab.Screen 
             name="Home"
             component={HomeScreen as any}
             options={{
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                    <FontAwesomeIcon icon={faHome} size={size} color={color} />
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
                    <FontAwesomeIcon icon={faAlignJustify} size={size} color={color} />
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
                    <FontAwesomeIcon icon={faUser} size={size} color={color} />
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
    standardTabBarButton: {
        top: -2,
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        shadowOpacity: 0,
    },
    centralTabBarButton: {
        top: -20,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        flex: 1,
    },
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