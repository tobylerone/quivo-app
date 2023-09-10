import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, SectionList, StatusBar } from "react-native"
import { useEffect } from "react"
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { FontAwesome } from "@expo/vector-icons"
import * as constants from "../constants";

const DATA = [
    {
      title: "Account Settings",
      data: ["Change password", "Change language"],
    },
    {
      title: "General",
      data: ["Choose language", "Voice narration", "-----"],
    },
    {
      title: "Social",
      data: ["FAQs", "Rate and comment", "Share", "Contact us", "Confidentiality"],
    },
  ];

export default function AccountSettingsScreen({navigation}: NativeStackHeaderProps) {

    return (
        <SafeAreaView style={styles.container}>
            <SectionList
                sections={DATA}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => (
                <View style={styles.item}>
                    <Text style={styles.title}>{item}</Text>
                </View>
                )}
                renderSectionHeader={({section: {title}}) => (
                <Text style={styles.header}>{title}</Text>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16,
    },
    item: {
        backgroundColor: constants.PRIMARYCOLOR,
        fontSize: constants.CONTENTFONTSIZE,
        padding: 10,
        borderRadius: 15,
        marginBottom: 5,
        marginVertical: 0
    },
    header: {
        fontSize: constants.H2FONTSIZE + 2,
        color: constants.PRIMARYCOLOR,
        fontWeight: "bold",
        padding: 10,
        backgroundColor: constants.SECONDARYCOLOR,
        paddingTop: 20,
        paddingBottom: 10
    },
    title: {
        fontSize: constants.H2FONTSIZE,
        color: constants.SECONDARYCOLOR
    },
});
