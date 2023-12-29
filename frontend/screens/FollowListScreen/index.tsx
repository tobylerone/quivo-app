import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import FollowScreen from "./components/FollowScreen";
import * as constants from "../../constants";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NavBar from "../../components/NavBar";

const Tab = createMaterialTopTabNavigator();

export default function FollowListScreen({route, navigation}: {route: any, navigation: NativeStackHeaderProps}) {

    const { initialTab } =  route.params;
    const [activeTab, setActiveTab] = useState<string>(initialTab);


    useEffect(() => {
        
    }, [activeTab])

    console.log(activeTab);
    return (
        <SafeAreaView style={styles.container}>
            <NavBar title={''} navigation={navigation}/>
            <View style={styles.subContainer}>
                <View style={styles.titleBar}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {setActiveTab('followers')}}
                        style={{backgroundColor: activeTab === 'followers' ? constants.PRIMARYCOLOR : constants.TERTIARYCOLOR, ...styles.titleTab}}
                    >
                        <Text style={{color: activeTab === 'followers' ? constants.TERTIARYCOLOR : constants.PRIMARYCOLOR, ...styles.titleText}}>Followers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {setActiveTab('following')}}
                        style={{backgroundColor: activeTab === 'following' ? constants.PRIMARYCOLOR : constants.TERTIARYCOLOR, ...styles.titleTab}}
                    >
                        <Text style={{color: activeTab === 'following' ? constants.TERTIARYCOLOR : constants.PRIMARYCOLOR, ...styles.titleText}}>Following</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.contentTabContainer}>
                    {activeTab === 'followers' && <FollowScreen type={'followers'} />}
                    {activeTab === 'following' && <FollowScreen type={'following'} />}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 20
    },
    subContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        height: 'auto',
        marginTop: 10,
        borderWidth: 3,
        borderColor: constants.PRIMARYCOLOR,
        //marginBottom: 300
    },
    titleBar: {
        flexDirection: 'row',
        backgroundColor: constants.PRIMARYCOLOR,
        marginBottomColor: constants.PRIMARYCOLOR
    },
    titleTab: {
        padding: 10,
        borderColor: constants.PRIMARYCOLOR,
        borderBottomWidth: 3,
        width: '50%',
    },
    titleText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        textAlign: 'center'
    },
    contentTabContainer: {
        padding: 10
    }
});
