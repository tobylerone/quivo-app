import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import * as constants from '../../constants';
import PNG from 'pngjs';
import UserContext from '../../contexts/UserContext';
import NavBar from "../../components/NavBar";

export default function AvatarScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser } = useContext(UserContext);

    interface IAvatar {
        name: string,
        current?: boolean,
        source: PNG
    }

    const avatars = [
        {name: 'none', current: true, source: require('../../assets/avatars/none.png')},
        {name: 'regular', source: require('../../assets/avatars/regular.png')},
        {name: 'cute', source: require('../../assets/avatars/cute.png')},        
        {name: 'dizzy', source: require('../../assets/avatars/dizzy.png')},
        {name: 'clever', source: require('../../assets/avatars/clever.png')},     
        {name: 'cool', source: require('../../assets/avatars/cool.png')},        
        {name: 'strong', source: require('../../assets/avatars/strong.png')},
    ];

    const renderAvatar = (avatar: IAvatar) => (
        <>
        <TouchableOpacity
            style={styles.avatarContainer}
            activeOpacity={1}
            >
            <View style={{
                backgroundColor: avatar.current
                    ? constants.ORANGE
                    : constants.PRIMARYCOLOR,
                ...styles.avatarContainerShadow
                }}></View>
            <View style={{
                borderColor: avatar.current
                    ? constants.ORANGE
                    : constants.PRIMARYCOLOR,
                ...styles.avatarImageContainer
                }}>
            <Image
                style={styles.avatarImage}
                source={avatar.source}
            />
            </View>
        </TouchableOpacity>
        </>
    );

    return (
    <SafeAreaView style={styles.container}>
        <NavBar title='Choose an Avatar' navigation={navigation} />
        <View style={styles.avatarsContainer}>
            {avatars.map((avatar: IAvatar) => renderAvatar(avatar))}
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