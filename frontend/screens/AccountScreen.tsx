import { StyleSheet, View, Image, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useEffect, useContext } from "react";
import UserContext from '../contexts/UserContext';
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesome } from '@expo/vector-icons';
import * as constants from "../constants";

export default function AccountScreen({navigation}: NativeStackHeaderProps) {
    // Drapeaux trouvés ici: https://www.flaticon.com/packs/international-flags-6

    const { currentUser } = useContext(UserContext);
    
    useEffect(() =>{
        console.log("Rendering Accountscreen")
        console.log(currentUser)

    }, [])
    return (
        <SafeAreaView>
            <View style={styles.topContainer}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigation.navigate("SearchUser")}
                    style={styles.addUserButtonContainer}
                    >
                    <View style={styles.addUserButton}>
                        <FontAwesome name="user-plus" size={constants.H1FONTSIZE} color={constants.PRIMARYCOLOR} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigation.navigate("AccountSettings")}
                    style={styles.settingsButtonContainer}
                    >
                    <View style={styles.settingsButton}>
                        <FontAwesome name="gear" size={constants.H1FONTSIZE} color={constants.PRIMARYCOLOR} />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.profileContainer}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={require("../assets/profile.jpg")}
                        style={styles.profileImage}
                    />
                </View>
                <View style={styles.profileNameBubble}>
                    <View style={styles.profileNameContainer}>
                        <Text style={styles.profileName}>{currentUser.username}</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigation.navigate("AccountLanguages")}
                        >
                        <View style={styles.flagImageContainer}>
                            <Image
                                source={require("../assets/ru.png")}
                                style={styles.flagImage}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigation.navigate("AccountLanguages")}
                        >
                        <View style={styles.flagImageContainer}>
                            <Image
                                source={require("../assets/es.png")}
                                style={styles.flagImage}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.middleContainer}>
                <View style={styles.middleContainerColumn}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigation.navigate("WordList")}
                        >
                        <View style={styles.knownWordsContainer}>
                            <Text style={styles.knownWords}>496</Text>
                            <Text style={styles.knownWordsSubheader}>Words</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.middleContainerColumn}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigation.navigate("FollowList", {initialTab: "Followers"})}
                        >
                        <View style={styles.followCountContainer}>
                            <Text style={styles.followCount}>{ currentUser.followers_count }</Text>
                            <Text style={styles.followCountSubheader}>Followers</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.middleContainerColumn}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigation.navigate("FollowList", {initialTab: "Following"})}
                        >
                        <View style={styles.followCountContainer}>
                            <Text style={styles.followCount}>{ currentUser.following_count }</Text>
                            <Text style={styles.followCountSubheader}>Following</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.mainContainer}>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    topContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: 50  
    },
    profileContainer: {
        width: "100%",
        marginTop: 10,
    },
    middleContainer: {
        //width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: 10
    },
    middleContainerColumn: {
        height: 60,
        flex: 1
    },
    mainContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: 10
    },
    addUserButtonContainer: {
        alignSelf: 'flex-start'
    },
    settingsButtonContainer: {
        alignSelf: 'flex-end'
    },
    profileImageContainer: {
        borderRadius: 50,
        borderWidth: 4,
        borderColor: constants.PRIMARYCOLOR,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20,
        overflow: "hidden",
        width: 100,
        height: 100
    },
    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 50
    },
    profileNameBubble: {
        height: 40,
        backgroundColor: constants.PRIMARYCOLOR,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        marginLeft: "auto",
        marginRight: "auto"
    },
    profileNameContainer: {
        height: "100%",
        marginRight: 10,
        textAlignVertical: "bottom",
        flexDirectio: "column",
        justifyContent: "center",
    },
    profileName: {
        fontSize: constants.H2FONTSIZE,
        color: constants.SECONDARYCOLOR,
        fontWeight: "bold",
        textAlignVertical: "bottom"
    },
    flagImageContainer: {
        borderRadius: 10,
        borderWidth: 4,
        borderColor: constants.PRIMARYCOLOR,
        overflow: "hidden",
        height: "100%",
        width: 40,
    },
    flagImage: {
        width: "100%",
        height: "100%",
    },
    knownWordsContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "auto",
        marginBottom: "auto"
    },
    knownWords: {
        fontSize: constants.H1FONTSIZE,
        color: constants.PRIMARYCOLOR,
        fontWeight: "bold",
        marginLeft: "auto",
        marginRight: "auto"
    },
    knownWordsSubheader: {
        fontSize: constants.H3FONTSIZE,
        color: constants.PRIMARYCOLOR,
        fontWeight: "bold",
        marginLeft: "auto",
        marginRight: "auto"
    },
    followCountContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "auto",
        marginBottom: "auto"
    },
    followCount: {
        fontSize: constants.H1FONTSIZE,
        color: constants.PRIMARYCOLOR,
        fontWeight: "bold",
        marginLeft: "auto",
        marginRight: "auto"
    },
    followCountSubheader: {
        fontSize: constants.H3FONTSIZE,
        color: constants.PRIMARYCOLOR,
        fontWeight: "bold",
        marginLeft: "auto",
        marginRight: "auto"
    },
});