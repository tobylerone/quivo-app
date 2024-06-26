import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, SectionList } from "react-native";
import { useState, useContext } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import * as constants from "../../constants";
import UserContext from '../../contexts/UserContext';
import NavBar from "../../components/NavBar";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPersonCane, faPersonWalking, faPersonBiking, faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";

export default function AccountSettingsScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser, submitLogout, soundActive, setSoundActive, narrationSpeed, setNarrationSpeed } = useContext(UserContext);
    
    const narrationSpeedTitle: Record<number, string> = {
      0.8: 'Slow',
      1: 'Normal',
      1.2: 'Fast'
    }

    const narrationSpeedIcons: Record<number, IconDefinition> = {
      0.8: faPersonCane,
      1: faPersonWalking,
      1.2: faPersonBiking
    }
    
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
              text: currentUser.is_premium ? "Cancel Subscription" : "Upgrade to premium",
              arrow: true,
              color: currentUser.is_premium ? constants.ERRORCOLOR : constants.GREENREGULAR,
              action: () => {navigation.navigate('GetPremium')}
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
              { text: "FAQs", arrow: true, action: () => {navigation.navigate('Faqs')} },
              {
                text: 'Narration speed',
                subtext: 
                  <>
                    <Text style={{color: constants.PRIMARYCOLORSHADOW, fontFamily: constants.FONTFAMILYBOLD}}>{narrationSpeedTitle[narrationSpeed]}</Text>
                    {/*<FontAwesomeIcon icon={narrationSpeedIcons[narrationSpeed]} size={20} color={constants.BLACK} />*/}
                  </>,
                action: () => setNarrationSpeed(narrationSpeed == 1.2 ? 0.8 : narrationSpeed + 0.2)
              },
              { text: soundActive ? "Sound on" : "Sound off",
                subtext: soundActive ? <FontAwesomeIcon icon={faVolumeHigh} size={20} color={constants.GREENREGULAR} /> : <FontAwesomeIcon icon={faVolumeMute} size={20} color={constants.ERRORCOLOR} />,
                action: () => setSoundActive(!soundActive)
              },
            ],
        },
        {
            title: "Social",
            data: [
            { text: "Rate and comment", arrow: false, action: () => {} },
            { text: "Give feedback", arrow: false, color: constants.GREENREGULAR, action: () => {navigation.navigate('Feedback')} },
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
                  <Text style={{color: item.color || constants.PRIMARYCOLORSHADOW , ...styles.itemText}}>{item.text}</Text>
                  <View style={styles.itemRightContainer}>
                  {item.subtext &&
                    <Text style={styles.itemSubtext}>{
                      item.subtext.length >= 10 ? item.subtext.substring(0, 7) + '...' : item.subtext
                      }</Text>
                    }
                    {item.arrow &&
                    <View style={styles.itemArrow}>
                      <FontAwesome name="chevron-right" size={20} color={constants.PURPLEREGULAR} />
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
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 300,
        //backgroundColor: constants.PURPLELIGHT
    },
    list: {
      borderWidth: 3,
      borderColor: constants.PURPLELIGHT,
      borderRadius: 10,
      overflow: 'hidden'
    },
    item: {
        padding: 10,
        marginVertical: 0,
        flexDirection: 'row',
        //backgroundColor: constants.PURPLELIGHT
    },
    header: {
        fontSize: constants.H2FONTSIZE + 2,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.BLACK,
        padding: 10,
        backgroundColor: constants.PURPLELIGHT
    },
    itemText: {
      fontSize: constants.H2FONTSIZE,
      fontFamily: constants.FONTFAMILYBOLD,
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