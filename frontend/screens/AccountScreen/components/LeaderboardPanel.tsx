import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useContext } from "react";
import UserContext from '../../../contexts/UserContext';
import * as constants from '../../../constants';
import { LineChart } from "react-native-chart-kit";
// Utils
import { sumWordCounts } from "../../../utils/functions";
// Hooks
import useLeaderboardData from "../hooks/useLeaderboardData";

interface ILeaderboardPanelProps {
    navigation: any
}

export default function LeaderboardPanel({navigation}: ILeaderboardPanelProps) {

    const { currentUser } = useContext(UserContext);
    const leaderboardData = useLeaderboardData();

    const renderItem = (user: any, idx: number) => (
        <TouchableOpacity
            activeOpacity={1}
            style={{
                backgroundColor: user.user_id === currentUser.user_id
                    ? constants.ORANGE + '33'
                    : constants.TERTIARYCOLOR,
                ...styles.userItem
            }}
            onPress={() => navigation.navigate('OtherUserAccount',
                {userName: user.username}
                )}
            >
            <Text style={[styles.itemText, styles.positionText]}>{idx + 1}</Text>
            <Text style={[
                {fontFamily: user.user_id === currentUser.user_id
                    ? constants.FONTFAMILYBOLD
                    : constants.FONTFAMILY
                },
                styles.itemText,
                styles.usernameText
                ]}>
                {user.username}
            </Text>
            <Text style={[styles.itemText, styles.streakText]}>{sumWordCounts(user.known_words_count)}</Text>
        </TouchableOpacity>
    );

    return (
    <View style={styles.container}>
        <View style={styles.titleBar}>
            <Text style={styles.titleText}>Leaderboard</Text>
        </View>
        <View style={styles.panelBody}>
            {leaderboardData ?
                leaderboardData.map((user, idx) => renderItem(user, idx))
            : <ActivityIndicator size="large" color={constants.ORANGE} />
            }
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        height: 'auto',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: constants.ORANGE
    },
    titleBar: {
        flexDirection: 'row',
        backgroundColor: constants.ORANGE,
        marginBottomColor: constants.ORANGE
    },
    titleText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H2FONTSIZE,
        color: constants.TERTIARYCOLOR,
        padding: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    panelBody: {},
    userItem: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 2,
        borderTopColor: constants.ORANGE
    },
    itemText: {
        fontSize: constants.H2FONTSIZE,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    positionText: {
        color: constants.TERTIARYCOLOR,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: constants.ORANGE,
        marginRight: 10
    },
    usernameText: {

    },
    streakText: {
        fontFamily: constants.FONTFAMILYBOLD,
        marginLeft: 'auto'
    }
});