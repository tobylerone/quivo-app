import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { useState, useContext } from "react";
// Constants
import * as constants from "../constants"
// Contexts
import UserContext from '../contexts/UserContext';
// Components
import RaisedButton from "./RaisedButton";
// Utils
import client from "../utils/axios";

interface IFollowButton {
    followee_id: number,
    initUserIsFollowing: boolean
}

export default function FollowButton({ followee_id, initUserIsFollowing }: IFollowButton) {
    
    const [userIsFollowing, setUserIsFollowing] = useState(initUserIsFollowing);
    
    //Not sure if you can import hook setters like this but it didn't seem to work
    const { currentUser, setCurrentUser } = useContext(UserContext);
    
    const handlePress = () => {
        
        let action = 'follow';
        let request; // Error if I set client.post here but not sure why
        
        if (userIsFollowing) {
            action = 'unfollow';
            request = client.delete;
        } else {
            request = client.post
        };
        
        request(
            '/api/' + action + '/' + currentUser.user_id + '/' + followee_id,
            { withCredentials: true }
        ).then(function(res) {
            setUserIsFollowing(!userIsFollowing);
            console.log(res.data)
        }).catch(function(e) {
            console.log(e.response.data)
        });
    };
    
    return (
        <>
            <TouchableOpacity
                activeOpacity={1}
                style={[
                    userIsFollowing ? styles.unfollowButton : styles.followButton,
                    styles.button
                ]}
                onPress={handlePress}
                >
                <Text style={[
                    userIsFollowing ? styles.unfollowButtonText : styles.followButtonText,
                    styles.buttonText
                ]}
                >
                    {userIsFollowing ? 'Unfollow' : 'Follow'}
                </Text>
            </TouchableOpacity>
            {/*<RaisedButton
                onPress={handlePress}
                options={{
                    ...RaisedButton.defaultProps.options,
                    backgroundColor: userIsFollowing ? constants.PRIMARYCOLOR : constants.TERTIARYCOLOR,
                    shadowColor: userIsFollowing ? constants.PRIMARYCOLORSHADOW : constants.GREY,
                    borderColor: userIsFollowing ? constants.PRIMARYCOLOR : constants.GREY
                }}
            >
                <Text style={[
                    userIsFollowing ? styles.unfollowButtonText : styles.followButtonText,
                    styles.buttonText
                ]}
                >
                    {userIsFollowing ? 'Unfollow' : 'Follow'}
                </Text>
            </RaisedButton>*/}
        </>
    );
}
const styles = StyleSheet.create({
    button: {
        borderRadius: 5,
        borderWidth: 3,
        padding: 7,
        width: 90
    },
    followButton: {
        backgroundColor: constants.SECONDARYCOLOR,
        borderColor: constants.PURPLEREGULAR
    },
    unfollowButton: {
        backgroundColor: constants.PURPLEREGULAR,
        borderColor: constants.PURPLEREGULAR,
        color: constants.TERTIARYCOLOR
    },
    buttonText: {
        fontSize: constants.H3FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    followButtonText: {
        color: constants.BLACK
    },
    unfollowButtonText: {
        color: constants.TERTIARYCOLOR
    }
});