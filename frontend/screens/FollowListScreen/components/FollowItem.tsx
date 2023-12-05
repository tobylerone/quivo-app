    import { View, Text, StyleSheet } from "react-native"
    import * as constants from "../../../constants"
    
    interface IFollowItemProps {
        user: {
            email: string,
            followers_count: number,
            following_count: number,
            user_id: number,
            username: string
            //wordsKnown: {
            //    language: string;
            //    words: number
            //}[]
        }
    }
    
    export default function FollowItem ({user}: IFollowItemProps) {
        
        return (
            <View style={styles.followItemContainer}>
                <Text style={styles.userName}>{user.username}</Text>
            </View>
        );
    };
    
    const styles= StyleSheet.create({
        followItemContainer: {
            flexDirection: "column",
            backgroundColor: constants.SECONDARYCOLOR,
            borderRadius: 10,
            margin: 5,
            padding: 10
        },
        userName: {
            fontSize: constants.H2FONTSIZE,
            color: constants.BLACK,
            marginTop: 10,
            marginBottom: 10
        },
        wordsKnownContainer: {
            flexDirection: "row"
        },
        languageContainer: {
            marginRight: 10,
            flexDirection: "row"
        },
        flagImage: {
            width: 15,
            height: 15,
            borderRadius: 7,
            marginRight: 3,
            marginTop: "auto",
            marginBottom: "auto"
        },
        knownWords: {
            fontSize: constants.CONTENTFONTSIZE
        },
        shadow: {
            shadowColor: constants.PRIMARYCOLOR,
            shadowOffset: {
                width: 0,
                height: 0
            },
            shadowOpacity: 0.15,
            shadowRadius: 0,
            elevation: 1,
            borderWidth: 0
        }
    })