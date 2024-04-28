import { View, StyleSheet } from "react-native";
import { useContext } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import UserContext from '../../contexts/UserContext';
import * as constants from '../../constants';
import NavBar from "../../components/NavBar";

export default function ShowAdScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser, knownLanguages, currentLanguage } = useContext(UserContext);

    return (
    <View style={styles.container}>
        <NavBar title='Streak' navigation={navigation} />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 16
    }
});