import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useContext } from "react";
import UserContext from '../../../contexts/UserContext';
import * as constants from '../../../constants';
import { LineChart } from "react-native-chart-kit";

export default function LeaderboardPanel() {

    const { currentUser } = useContext(UserContext);

    interface IUser {
        position: number,
        username: string,
        streak: number
    }

    const users: IUser[] = [
        {position: 1, username: 'user3', streak: 22},
        {position: 2, username: 'user1', streak: 14},
        {position: 3, username: 'user2', streak: 3},
    ]

    const renderItem = (user: IUser) => (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.userItem}
            >
            <Text style={[styles.itemText, styles.positionText]}>{user.position}</Text>
            <Text style={[styles.itemText, styles.usernameText]}>{user.username}</Text>
            <Text style={[styles.itemText, styles.streakText]}>{user.streak}</Text>
        </TouchableOpacity>
    );

    return (
    <View style={styles.container}>
        <View style={styles.titleBar}>
            <Text style={styles.titleText}>Leaderboard</Text>
        </View>
        <View style={styles.panelBody}>
            {users.map(user => renderItem(user))}
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        height: 'auto',
        marginBottom: 0,
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
        fontFamily: constants.FONTFAMILY,
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