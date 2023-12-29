import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, SectionList } from "react-native";
import { useContext } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import * as constants from "../constants";
import UserContext from '../contexts/UserContext';
import NavBar from "../components/NavBar";
import { FontAwesome } from "@expo/vector-icons";

export default function AccountSettingsScreen({navigation}: NativeStackHeaderProps) {

    const { submitLogout } = useContext(UserContext);

    const DATA = [
        {
            title: "Account",
            data: [
            { text: "Change username", arrow: true, action: () => {} },
            { text: "Change email", arrow: true, action: () => {} },
            { text: "Log out", arrow: false, action: () => {
                console.log("Logging out")
                submitLogout()
            }},
            ],
        },
        {
            title: "General",
            data: [
            { text: "Choose language", arrow: false, action: () => {} },
            { text: "Narration speed", arrow: true, action: () => {} },
            { text: "-----", arrow: false, action: () => {} },
            ],
        },
        {
            title: "Social",
            data: [
            { text: "FAQs", arrow: true, action: () => {navigation.navigate('Faqs')} },
            { text: "Rate and comment", arrow: false, action: () => {} },
            { text: "Share", arrow: false, action: () => {} },
            { text: "Contact us", arrow: false, action: () => {} },
            { text: "Confidentiality", arrow: true, action: () => {} },
            ],
        },
        ];
    
    return (
        <SafeAreaView style={styles.container}>
          <NavBar title="Settings" navigation={navigation} />
          <SectionList
            sections={DATA}
            style={styles.list}
            keyExtractor={(item, index) => item.text + index}
            bounces={false}
            renderItem={({item}) => (
              <TouchableOpacity onPress={item.action} activeOpacity={1}>
                <View style={styles.item}>
                  <Text style={styles.title}>{item.text}</Text>
                  {item.arrow &&
                  <View style={styles.itemArrow}>
                    <FontAwesome name="chevron-right" size={20} color={constants.PRIMARYCOLOR} />
                  </View>
                  }
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
        marginHorizontal: 16,
        marginTop: 50
    },
    list: {
      borderWidth: 3,
      borderColor: constants.PRIMARYCOLOR,
      borderRadius: 10,
      overflow: 'hidden'
    },
    item: {
        padding: 10,
        marginVertical: 0,
        flexDirection: 'row'
        //borderBottomWidth: 3,
        //borderBottomColor: constants.PRIMARYCOLOR
    },
    header: {
        fontSize: constants.H2FONTSIZE + 2,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.TERTIARYCOLOR,
        padding: 10,
        backgroundColor: constants.PRIMARYCOLOR
    },
    title: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILY,
        color: constants.BLACK
    },
    itemArrow: {
      marginLeft: 'auto',
      marginTop: 'auto',
      marginBottom: 'auto'
    }
});
