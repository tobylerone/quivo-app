import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useState, useEffect, useContext } from "react";
import UserContext from "../../../contexts/UserContext";
import FollowItem from "./FollowItem";
import client from "../../../utils/axios";
import * as constants from "../../../constants";

interface IFollowScreen {
    type: 'followers' | 'following'
}

export default function FollowScreen({ type }: IFollowScreen) {

    const { currentUser } = useContext(UserContext);
    const [data, setData] = useState(null);

    useEffect(() =>{
        // Get accounts the user is followed by / is following
        client.get(
            'api/users/' + currentUser.user_id + '/' + type + '/'
        ).then(function(res) {
            setData(res.data);
        }).catch(function(e) {
            console.log(e.response.data)
        });

    }, []);

    return (
        <View style={styles.followListContainer}>
            {data ?
                data.length > 0 ?
                    <FlatList
                    style={styles.followList}
                    data={data}
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