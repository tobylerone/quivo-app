import { ReactNode } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faAlignJustify, faUser } from '@fortawesome/free-solid-svg-icons';
import { TransitionSpecs, HeaderStyleInterpolators } from '@react-navigation/stack';
// Constants
import * as constants from "../constants";
// Auth stack
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
// First login stack
import ChooseFirstLanguageScreen from "../screens/ChooseFirstLanguageScreen";
// Main stack
import BottomNavBar from '../components/BottomNavBar';
import HomeScreen from "../screens/HomeScreen";
import LearnScreen from "../screens/LearnScreen";
import AccountScreen from "../screens/AccountScreen";
import OtherUserAccountScreen from "../screens/OtherUserAccountScreen";
import AccountSettingsScreen from "../screens/AccountSettingsScreen";
import ChangeUserDetailsScreen from "../screens/ChangeUserDetailsScreen";
import SearchUserScreen from "../screens/SearchUserScreen";
import AccountLanguagesScreen from "../screens/AccountLanguagesScreen";
import WordListScreen from "../screens/WordListScreen";
import FollowListScreen from "../screens/FollowListScreen";
import FaqScreen from "../screens/FaqScreen";
import ProgressScreen from "../screens/ProgressScreen";
import LevelScreen from "../screens/LevelScreen";
import StreakScreen from "../screens/StreakScreen";
import IncreaseStreakScreen from "../screens/IncreaseStreakScreen";
import MaxWordsReachedScreen from "../screens/MaxWordsReachedScreen";
import AvatarScreen from "../screens/AvatarScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import LearnCyrillicScreen from "../screens/LearnCyrillicScreen";
import GetPremiumScreen from "../screens/GetPremiumScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";

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
                name="Learn"
                component={LearnScreen as any}
                options={{ headerShown: false }}
            />
            <MainStack.Screen 
                name="Home"
                component={HomeScreen as any}
                options={{
                    headerShown: false,
                    animation: 'none'
                }}
            />
            <MainStack.Screen 
                name="Account"
                component={AccountScreen as any}
                options={{
                    headerShown: false,
                    animation: 'none'
                }}
            />
            <MainStack.Screen 
                name="OtherUserAccount"
                component={OtherUserAccountScreen as any}
                options={{headerShown: false}}
            />
            <MainStack.Screen
                name="LearnCyrillic"
                component={LearnCyrillicScreen as any}
                options={{
                    headerShown: false,
                    animation: 'none'
                }}
            />        
            <MainStack.Screen
                name="AccountSettings"
                component={AccountSettingsScreen as any}
                options={{
                    headerShown: false,
                    animation: 'none'
                }}
            />
            <MainStack.Screen
                name="ChangeUserDetails"
                component={ChangeUserDetailsScreen as any}
                options={{headerShown: false}}
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
                options={{
                    headerShown: false,
                    animation: 'none'
                }}
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
            <MainStack.Screen
                name="Level"
                component={LevelScreen as any}
                options={{ headerShown: false }}
            />
            <MainStack.Screen
                name="Streak"
                component={StreakScreen as any}
                options={{ headerShown: false }}
            />
            <MainStack.Screen
                name="GetPremium"
                component={GetPremiumScreen as any}
                options={{ headerShown: false }}
            />
            <MainStack.Screen
                name="IncreaseStreak"
                component={IncreaseStreakScreen as any}
                options={{
                    headerShown: false,
                    animation: 'slide_from_bottom'
                }}
            />
            <MainStack.Screen
                name="MaxWordsReached"
                component={MaxWordsReachedScreen as any}
                options={{
                    headerShown: false,
                    animation: 'slide_from_bottom'
                }}
            />
            <MainStack.Screen
                name="Avatar"
                component={AvatarScreen as any}
                options={{ headerShown: false }}
            />
            <MainStack.Screen
                name="Feedback"
                component={FeedbackScreen as any}
                options={{
                    headerShown: false,
                    animation: 'slide_from_bottom'
                }}
            />
            <MainStack.Screen
                name="Leaderboard"
                component={LeaderboardScreen as any}
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

//const BottomTab = createBottomTabNavigator();
/*
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
*/

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