import { View, StyleSheet, FlatList } from "react-native";
import { useState, useEffect, useContext } from "react";
import UserContext from '../../../contexts/UserContext';
import FollowItem from "./FollowItem";
import client from "../../../utils/axios";

interface IFollowScreen {
    type: 'followers' | 'following'
}

export default function FollowScreen({ type }: IFollowScreen) {

    const { currentUser } = useContext(UserContext);
    const [data, setData] = useState(null);

    useEffect(() =>{
        // Get accounts the user is followed by
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
            <FlatList
                style={styles.followList}
                data={data}
                bounces={false}
                renderItem={({item}) => <FollowItem user={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    followListContainer: {
        height: "100%",
        margin: 15
    },
    followList: {

    }
});