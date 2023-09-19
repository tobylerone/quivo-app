    import { View, Text, Image, StyleSheet, StyleProp, ViewStyle } from "react-native"
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
            <View style={styles.followItemContainer}>
                <Text style={styles.userName}>{user.name}</Text>
                <View style={styles.wordsKnownContainer}>
                    {user.wordsKnown.map(({language, words}) => (
                        <View style={styles.languageContainer}>
                            <Image
                                source={require("../assets/es.png")}
                                style={styles.flagImage}
                            />
                            <Text style={styles.knownWords}>{words}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };
    
    const styles= StyleSheet.create({
        followItemContainer: {
            flexDirection: "column",
            borderWidth: 2,
            borderColor: constants.PRIMARYCOLOR,
            borderRadius: 5,
            margin: 5,
            padding: 10
        },
        userName: {
            fontSize: constants.H2FONTSIZE,
            fontWeight: "bold",
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