import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, SectionList, StatusBar } from "react-native"
import { useEffect } from "react"
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { FontAwesome } from "@expo/vector-icons"
import * as constants from "../constants";

export default function WordListScreen({navigation}: NativeStackHeaderProps) {

    return (
        <SafeAreaView style={styles.container}>
            <Text>Word List</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16,
    },
});