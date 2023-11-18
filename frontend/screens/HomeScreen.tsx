import { View, SafeAreaView, Text, StyleSheet, FlatList, Pressable } from "react-native";
import {MontserratText} from "../components/styled/MontserratText";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useState, useEffect, useContext } from "react";
import UserContext from '../contexts/UserContext';
import WorkoutItem from "../components/WorkoutItem";
import { useWorkouts } from "../hooks/useWorkouts";
import * as constants from "../constants";
import client from "../utils/axios";

export default function HomeScreen({navigation}: NativeStackHeaderProps) {

    const workouts = useWorkouts()

    //Not sure if you can import hook setters like this but it didn't seem to work
    const { currentUser, setCurrentUser } = useContext(UserContext);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>{currentUser.username} Progress Stats</Text>
            <FlatList 
            data={workouts}
            renderItem={({item}) => {
                return (
                    <Pressable
                        onPress={() => navigation.navigate("WorkoutDetail", {slug: item.slug})}
                        >
                        <WorkoutItem item={item} />
                    </Pressable>
                )
            }}
            keyExtractor={item => item.slug}

            />
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