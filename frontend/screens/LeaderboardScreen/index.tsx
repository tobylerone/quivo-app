import { StyleSheet, SafeAreaView } from "react-native";
import { useContext } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import UserContext from "../../contexts/UserContext";
import NavBar from "../../components/NavBar";

export default function AccountLanguagesScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser } = useContext(UserContext);
    
    return (
        <SafeAreaView style={styles.container}>
            <NavBar title={'Leaderboard'} navigation={navigation}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 16,
    }
});