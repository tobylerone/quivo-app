import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import client from '../../../utils/axios';
import * as constants from '../../../constants';
// Contexts
import UserContext from '../../../contexts/UserContext';
// Components
import FollowItem from './FollowItem';
// Hooks
import { useFetchUserData } from '../../../hooks/useFetchUserData';

interface IFollowTabProps {
    type: 'followers' | 'following'
}

export default function FollowTab({ type }: IFollowTabProps) {

    const { currentUser } = useContext(UserContext);
    const userData = useFetchUserData('api/users/' + currentUser.user_id + '/' + type + '/');

    return (
        <View style={styles.followListContainer}>
            {userData ?
                userData.length > 0 ?
                    <FlatList
                    style={styles.followList}
                    data={userData}
                    bounces={false}
                    renderItem={({item}) => <FollowItem user={item} />}
                    />
                : <Text style={styles.noFollowText}>{
                        type === 'followers'
                        ? 'No followers'
                        : 'You haven\'t followed anyone yet!'
                        }
                    </Text>
            : <ActivityIndicator size="large" color={constants.PRIMARYCOLOR} />
            }
        </View>
    );    
}

const styles = StyleSheet.create({
    followListContainer: {
    },
    followList: {},
    noFollowText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILY,
        color: constants.BLACK,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginVertical: 10
    }
});