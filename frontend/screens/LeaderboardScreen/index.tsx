import { StyleSheet, SafeAreaView } from "react-native";
import { useContext } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
// Contexts
import UserContext from "../../contexts/UserContext";
// Components
import NavBar from "../../components/NavBar";
import ToggleButton from "../../components/ToggleButton";

export default function AccountLanguagesScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser } = useContext(UserContext);
    
    return (
        <SafeAreaView style={styles.container}>
            <NavBar title={'Leaderboard'} navigation={navigation}/>
            <ToggleButton initiallySelected={false} size={20} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 16,
    }
});