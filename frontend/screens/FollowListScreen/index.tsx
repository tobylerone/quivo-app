import { StyleSheet } from "react-native";
import FollowScreen from "./components/FollowScreen";
import * as constants from "../../constants";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

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
                    borderRadius: 10
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
                    marginTop: 10,
                    shadowOpacity: 0,
                    shadowRadius: 0,
                    shadowOffset: 0,
                    shadowColor: constants.SECONDARYCOLOR
                }
            }}
        >
            <Tab.Screen name="Followers">
                {() => <FollowScreen type={'followers'} />}
            </Tab.Screen>
            <Tab.Screen name="Following">
                {() => <FollowScreen type={'following'} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({});
