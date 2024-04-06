import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, SectionList } from "react-native";
import { useContext } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import * as constants from "../../constants";
import UserContext from '../../contexts/UserContext';
import NavBar from "../../components/NavBar";
import { FontAwesome } from "@expo/vector-icons";

export default function AccountSettingsScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser, submitLogout } = useContext(UserContext);

    const DATA = [
        {
            title: "Account",
            data: [
            {
              text: 'Change username',
              arrow: true,
              subtext: currentUser.username,
              action: () => {navigation.navigate('ChangeUserDetails')}
            },
            {
              text: 'Change email',
              arrow: true,
              subtext: currentUser.email,
              action: () => {navigation.navigate('ChangeUserDetails')}
            },
            {
              text: "Upgrade to premium",
              arrow: false,
              color: constants.SUCCESSCOLOR,
              action: () => {}
            },
            { text: "Log out", arrow: false, color: constants.ERRORCOLOR, action: () => {
              console.log("Logging out")
              submitLogout()
            }},
          ],
        },
        {
            title: "General",
            data: [
            {
              text: 'Narration speed', 
              subtext: 'Fast',
              arrow: true,
              action: () => {}
            }
            ],
        },
        {
            title: "Social",
            data: [
            { text: "FAQs", arrow: true, action: () => {navigation.navigate('Faqs')} },
            { text: "Rate and comment", arrow: false, action: () => {} },
            { text: "Give feedback", arrow: false, color: constants.SUCCESSCOLOR, action: () => {navigation.navigate('Feedback')} },
            { text: "Privacy Policy", arrow: true, action: () => {} }, // Can create one here: https://termly.io/resources/templates/privacy-policy-template/
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
                  <Text style={{color: item.color || constants.BLACK , ...styles.itemText}}>{item.text}</Text>
                  <View style={styles.itemRightContainer}>
                  {item.subtext &&
                    <Text style={styles.itemSubtext}>{
                      item.subtext.length >= 10 ? item.subtext.substring(0, 7) + '...' : item.subtext
                      }</Text>
                    }
                    {item.arrow &&
                    <View style={styles.itemArrow}>
                      <FontAwesome name="chevron-right" size={20} color={constants.PRIMARYCOLOR} />
                    </View>
                    }
                  </View>
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
    },
    header: {
        fontSize: constants.H2FONTSIZE + 2,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.TERTIARYCOLOR,
        padding: 10,
        backgroundColor: constants.PRIMARYCOLOR
    },
    itemText: {
      fontSize: constants.H2FONTSIZE,
      fontFamily: constants.FONTFAMILY,
    },
    itemRightContainer: {
      marginLeft: 'auto',
      flexDirection: 'row'
    },
    itemSubtext: {
      fontSize: constants.H2FONTSIZE,
      fontFamily: constants.FONTFAMILY,
      color: constants.GREY,
    },
    itemArrow: {
      marginLeft: 10,
      marginTop: 'auto',
      marginBottom: 'auto'
    }
});