    import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native"
    import {secToMin, formatSec} from "../utils/time"
    import { ReactNode } from "react"
    import * as constants from "../constants"
    
    interface IFollowItemProps {
        user: {
            name: string;
            wordsKnown: {
                language: string;
                words: number
            }[]
        }
    }
    
    export default function FollowItem ({user}: IFollowItemProps) {
        return (
            <View style= {styles.followItemContainer}>
                <Text>{user.name}</Text>
                {user.wordsKnown.map(({language, words}) => (
                    <Text>{language}: {words}</Text>
                ))}
            </View>
        );
    };
    
    const styles= StyleSheet.create({
        followItemContainer: {
            flexDirection: "row",
            borderWidth: 4,
            borderColor: constants.PRIMARYCOLOR,
            borderRadius: 15,
            margin: 5,
            padding: 10
        }
    })