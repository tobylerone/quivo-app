import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, SectionList, StatusBar } from "react-native"
import { useEffect, useContext } from "react"
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { FontAwesome } from "@expo/vector-icons"
import * as constants from "../constants";
import UserContext from '../contexts/UserContext';

export default function AccountSettingsScreen({navigation}: NativeStackHeaderProps) {

    const { submitLogout } = useContext(UserContext);

    const DATA = [
        {
            title: "Account Settings",
            data: [
            { text: "Change password", action: () => {} },
            { text: "Change language", action: () => {} },
            { text: "Log out", action: () => {
                console.log("Logging out")
                submitLogout()
            }},
            ],
        },
        {
            title: "General",
            data: [
            { text: "Choose language", action: () => {} },
            { text: "Voice narration", action: () => {} },
            { text: "-----", action: () => {} },
            ],
        },
        {
            title: "Social",
            data: [
            { text: "FAQs", action: () => {} },
            { text: "Rate and comment", action: () => {} },
            { text: "Share", action: () => {} },
            { text: "Contact us", action: () => {} },
            { text: "Confidentiality", action: () => {} },
            ],
        },
        ];
    
    return (
        <SafeAreaView style={styles.container}>
          <SectionList
            sections={DATA}
            keyExtractor={(item, index) => item.text + index}
            bounces={false}
            renderItem={({item}) => (
              <TouchableOpacity onPress={item.action}>
                <View style={styles.item}>
                  <Text style={styles.title}>{item.text}</Text>
                </View>
              </TouchableOpacity>
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
        //backgroundColor: constants.PRIMARYCOLOR,
        fontSize: constants.CONTENTFONTSIZE,
        fontFamily: constants.FONTFAMILY,
        backgroundColor: constants.SECONDARYCOLOR,
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
        marginVertical: 0
    },
    header: {
        fontSize: constants.H2FONTSIZE + 2,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK,
        padding: 10,
        backgroundColor: constants.TERTIARYCOLOR,
        paddingTop: 20,
        paddingBottom: 10
    },
    title: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILY,
        color: constants.BLACK
    },
});
