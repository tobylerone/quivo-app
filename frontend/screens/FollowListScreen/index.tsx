import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import FollowTab from "./components/FollowTab";
import * as constants from "../../constants";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { RouteProp } from '@react-navigation/native';
import NavBar from "../../components/NavBar";
import { capitalizeFirstLetter } from '../../utils/text';

interface RouteParams {
    initialTab: 'followers' | 'following';
}

interface IFollowListScreenProps {
    route: RouteProp<{ params: RouteParams }>,
    navigation: NativeStackHeaderProps
}

export default function FollowListScreen({route, navigation}: IFollowListScreenProps) {

    const { initialTab } =  route.params;
    const [activeTab, setActiveTab] = useState<string>(initialTab);

    const TABS = ['followers', 'following'];

    const renderTabButton = (tab: string) => (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => setActiveTab(tab)}
            style={{backgroundColor: activeTab === tab ? constants.PRIMARYCOLOR : constants.TERTIARYCOLOR, ...styles.titleTab}}
        >
            <Text style={{color: activeTab === tab ? constants.TERTIARYCOLOR : constants.PRIMARYCOLOR, ...styles.titleText}}>
                {capitalizeFirstLetter(tab)}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <NavBar title={''} navigation={navigation}/>
            <View style={styles.subContainer}>
                <View style={styles.titleBar}>
                    {TABS.map(tabHeader => renderTabButton(tabHeader))}
                </View>
                <View style={styles.contentTabContainer}>
                    {activeTab === 'followers' && <FollowTab type={'followers'} navigation={navigation} />}
                    {activeTab === 'following' && <FollowTab type={'following'} navigation={navigation} />}
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
