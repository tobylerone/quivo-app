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
      0: 'Slow',
      1: 'Normal',
      2: 'Fast'
    }

    const narrationSpeedIcons: Record<number, string> = {
      0: faPersonCane,
      1: faPersonWalking,
      2: faPersonBiking
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
              text: "Upgrade to premium",
              arrow: true,
              color: constants.SUCCESSCOLOR,
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
                    {/*<Text style={{color: constants.BLACK}}>{narrationSpeedTitle[narrationSpeed]}</Text>*/}
                    <FontAwesomeIcon icon={narrationSpeedIcons[narrationSpeed]} size={20} color={constants.BLACK} />
                  </>,
                action: () => setNarrationSpeed(narrationSpeed == 2 ? 0 : narrationSpeed + 1)
              },
              { text: soundActive ? "Sound on" : "Sound off",
                subtext: soundActive ? <FontAwesomeIcon icon={faVolumeHigh} size={20} color={constants.SUCCESSCOLOR} /> : <FontAwesomeIcon icon={faVolumeMute} size={20} color={constants.ERRORCOLOR} />,
                action: () => setSoundActive(!soundActive)
              },
            ],
        },
        {
            title: "Social",
            data: [
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