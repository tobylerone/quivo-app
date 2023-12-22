import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, FlatList, Text, Image, TouchableOpacity } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import UserContext from "../../contexts/UserContext";
import * as constants from "../../constants";
import client from "../../utils/axios";
import LanguageItem from "./components/LanguageItem";

export default function ChooseFirstLanguageScreen({navigation}: NativeStackHeaderProps) {

    interface ILanguageItem {
        item: {
            id: number,
            language_code: string,
            language_name: string
        }
    }
    
    const { currentUser } = useContext(UserContext);

    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitButtonVisible, setSubmitButtonVisible] = useState(false);
    const [activeLanguage, setActiveLanguage] = useState('');

    useEffect(() => {
        fetchLanguages();
    }, [])
    
    // Can definitely cache this rather than fetch it every time
    const fetchLanguages = () => {
        client.get("/api/languages", { withCredentials: true })
            .then(function(res) {
                setLanguages(res.data);
                setLoading(false);
            })
            .catch(function(error) {
                console.log(error);
                setLoading(false);
            });
    }

    const addLanguage = async() => {
        try {
            const res = await client.post('./api/users/addlanguage/', {
                language_code: activeLanguage,
                user_id: currentUser.user_id,
                withCredentials: true
            });
            return res.data;
        } catch (error) {
            console.error(error);
        }
    }

    const updateCurrentLanguage = async() => {
        try {
            const res = await client.post('./api/users/changecurrentlanguage/', {
                language_code: activeLanguage,
                withCredentials: true
            });
            return res.data;
        } catch (error) {
            console.error(error);
        }
    }

    const handleLanguageItemPress = (languageCode: string) => {
        setSubmitButtonVisible(true);
        setActiveLanguage(languageCode);
    }

    const handleSubmitButtonPress = () => {
        // Add language to user's known languages
        addLanguage();

        // Update current language in session data
        updateCurrentLanguage();
    }
    
    if (loading) {
        return (<Text>Loading...</Text>);
    } else {
        return (
        <SafeAreaView style={styles.container}>
            <View style={styles.subContainer}>
                <Text style={styles.title}>Choose a language to get started!</Text>
                <FlatList
                    data={languages}
                    bounces={false}
                    renderItem={({item}: ILanguageItem) => (
                        <LanguageItem
                            item={item}
                            isActive={activeLanguage === item.language_code}
                            onPress={handleLanguageItemPress}
                        />
                    )}
                />
            </View>
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    opacity: submitButtonVisible ? 1 : 0,
                    ...styles.submitButton
                }}
                onPress={() => {handleSubmitButtonPress()}}
                >
                <Text style={styles.submitButtonText}>Start Learning</Text>
                <FontAwesome name="arrow-right" size={25} color={constants.TERTIARYCOLOR} />
            </TouchableOpacity>
        </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    },
    subContainer: {
        borderColor: constants.SECONDARYCOLOR,
        borderWidth: 3,
        borderRadius: 20,
        overflow: 'hidden',
        //marginTop: StatusBar.currentHeight,
        marginHorizontal: 16,
        marginTop: 60,
        marginBottom: 20
    },
    title: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        backgroundColor: constants.SECONDARYCOLOR,
        width: '100%',
        textAlign: 'center',
        padding: 10
    },
    submitButton: {
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'row',
        backgroundColor: constants.PRIMARYCOLOR,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10
    },
    submitButtonText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        color: constants.TERTIARYCOLOR,
        marginRight: 10
    }
});