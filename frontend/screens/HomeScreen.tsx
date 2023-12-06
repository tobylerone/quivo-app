import { View, SafeAreaView, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import UserContext from '../contexts/UserContext';
import { useWorkouts } from "../hooks/useWorkouts";

export default function HomeScreen({navigation}: NativeStackHeaderProps) {

    const workouts = useWorkouts()

    //Not sure if you can import hook setters like this but it didn't seem to work
    const { currentUser, setCurrentUser } = useContext(UserContext);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>{currentUser.username} Progress Stats</Text>
        </SafeAreaView>
    )
 }

        const styles = StyleSheet.create({
            container: {
                padding: 20,
                margin:20,
                flex: 1
            },
            header: {
                textTransform: 'capitalize',
                fontSize: 20,
                marginTop: 20,
                marginBottom: 20,
                fontWeight: "bold",
            }
})