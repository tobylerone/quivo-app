import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import PNG from 'pngjs';
// Utils
import avatarMap from '../../assets/avatars/avatarMap';
// Constants
import * as constants from '../../constants';
// Contexts
import UserContext from '../../contexts/UserContext';
// Components
import NavBar from "../../components/NavBar";

export default function AvatarScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser } = useContext(UserContext);

    const renderAvatar = (id: string, source) => (
        <>
        <TouchableOpacity
            style={styles.avatarContainer}
            activeOpacity={1}
            >
            <View style={{
                backgroundColor: id == currentUser.avatar_id // Comparing int to string here
                    ? constants.ORANGE
                    : constants.PRIMARYCOLOR,
                ...styles.avatarContainerShadow
                }}></View>
            <View style={{
                borderColor: id == currentUser.avatar_id
                    ? constants.ORANGE
                    : constants.PRIMARYCOLOR,
                ...styles.avatarImageContainer
                }}>
            <Image
                style={styles.avatarImage}
                source={source}
            />
            </View>
        </TouchableOpacity>
        </>
    );

    return (
    <SafeAreaView style={styles.container}>
        <NavBar title='Choose an Avatar' navigation={navigation} />
        <View style={styles.avatarsContainer}>
            {Object.entries(avatarMap).map(([key, value]) => renderAvatar(key, value))}
        </View>
    </SafeAreaView>
    );
 }

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginHorizontal: 0,
        marginTop: 50,
        flex: 1
    },
    avatarsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignContent: 'center'
    },
    avatarContainer: {
        marginHorizontal: 5,
        marginBottom: 20
    },
    avatarContainerShadow: {
        width: 100,
        height: 30,
        marginTop: 75,
        borderRadius: 10
    },
    avatarImageContainer: {
        width: 100,
        height: 100,
        borderWidth: 3,
        borderRadius: 10,
        marginTop: -105,
        backgroundColor: constants.TERTIARYCOLOR,
    },
    avatarImage: {
        width: 80,
        height: 80,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    }
});