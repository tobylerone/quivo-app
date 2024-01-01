import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useEffect, useState, useContext } from "react";
import PNG from 'pngjs';
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import UserContext from "../contexts/UserContext";
import NavBar from "../components/NavBar";
import * as constants from "../constants";
import client from "../utils/axios";

// TODO: Naming not great here. Move this to central location
interface ILanguage {
    id: number,
    language_code: string,
    language_name: string
}

interface ILanguageItem {
    item: ILanguage,
    navigation,
    addButton: boolean
}

const LanguageItem = ({ item, navigation, addButton }: ILanguageItem) => {

    const { currentUser, currentLanguage, updateCurrentLanguage, updateUserData } = useContext(UserContext);

    // Can't render image paths dynamically at runtime so I have
    // to map the language codes to their locally stored flag
    // image. Need to look into a better solution
    const flagImageMap: Record<string, PNG> = {
        'ru': require('../assets/ru.png'),
        'de': require('../assets/de.png'),
        'es': require('../assets/es.png'),
        'fr': require('../assets/fr.png'),
    };

    const handlePress = async(
        language_code: string
        ) => {

        console.log(language_code);
        console.log(currentUser.user_id);
        
        const res = await client.post('./api/users/addlanguage/', {
            language_code: language_code,
            user_id: currentUser.user_id,
            withCredentials: true
        }).then(() => {
            // Change currentLanguage
            updateCurrentLanguage(language_code);

            // Update the user data
            updateUserData()

            navigation.navigate('Learn');

        }).catch((error) => {
            console.error(error);
        });

    }

    return (
        <View style={styles.languageItemContainer}>
            <Image
                style={styles.languageItemImage}
                source={flagImageMap[item.language_code]}
            />
            <View style={styles.languageItemLabel}>
                <Text style={styles.languageItemLabelText}>
                    {item.language_name}
                </Text>
            </View>
            {addButton &&
            <TouchableOpacity
                activeOpacity={1}
                style={styles.languageItemAddButton}
                onPress={() => {handlePress(item.language_code)}}
            >
                <FontAwesome name='plus' size={20} color={constants.PRIMARYCOLOR} />
            </TouchableOpacity>
            }
        </View>
    );
}

export default function AccountLanguagesScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser } = useContext(UserContext);
    
    // No user languages currently so this is a placeholder
    const [knownLanguages, setKnownLanguages] = useState(null);
    const [unknownLanguages, setUnknownLanguages] = useState(null);
    
    useEffect(() => {
        fetchKnownLanguages();
    }, []);

    useEffect(() => {
        fetchAllLanguages();
    }, [knownLanguages]);

    // NOTE: This already exists in UserContext.txx
    const fetchKnownLanguages = async () => {
        return client.get("/api/users/" + currentUser.user_id + "/knownlanguages", { withCredentials: true })
        .then(function(res) {
            setKnownLanguages(res.data);
        })
        .catch(function(error) {
        });
    };
    
    // Can definitely cache this rather than fetch it every time
    const fetchAllLanguages = () => {
        client.get("/api/languages", { withCredentials: true })
        .then(function(res) {
            console.log(knownLanguages);
            const allLanguages = res.data;
            
            // Remove languages user already knows
            const unknownLanguages = allLanguages.filter(
                (item2: ILanguage) => !knownLanguages.some(
                    (item1: ILanguage) => item1.language_code === item2.language_code
                )
            );

            setUnknownLanguages(unknownLanguages);
        })
        .catch(function(error) {
        });
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <NavBar title={''} navigation={navigation}/>
            {knownLanguages && unknownLanguages && <>
            <View style={styles.subContainer}>
                <View>
                    <Text style={styles.title}>Your Languages</Text>
                    <FlatList
                        data={knownLanguages}
                        bounces={false}
                        renderItem={({item}) => <LanguageItem item={item} navigation={navigation} addButton={false}/>}
                    />
                </View>
                {unknownLanguages.length > 0 &&
                <View>
                    <Text style={styles.title}>More Languages</Text>
                    <FlatList
                        data={unknownLanguages}
                        bounces={false}
                        renderItem={({item}) => <LanguageItem item={item} navigation={navigation} addButton={true} />}
                    />
                </View>
                }
            </View>
            </>}
            {!knownLanguages || !unknownLanguages &&
            <View style={styles.activityIndicatorContainer}>
                <ActivityIndicator style={styles.activityIndicator} size="large" color={constants.BLACK} />
            </View>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 16,
    },
    subContainer: {
        marginTop: 10,
        borderColor: constants.SECONDARYCOLOR,
        borderWidth: 3,
        borderRadius: 20,
        overflow: 'hidden',
    },
    title: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        backgroundColor: constants.SECONDARYCOLOR,
        width: '100%',
        textAlign: 'center',
        padding: 10
    },

    // LanguageItem
    languageItemContainer: {
        borderTopColor: constants.SECONDARYCOLOR,
        flexDirection: 'row',
        borderTopWidth: 3,
        padding: 10
    },
    languageItemImage: {
        width: 80,
        height: 55,
        borderRadius: 8,
    },
    languageItemLabel: {
        paddingHorizontal: 15
    },
    languageItemLabelText: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILY,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    languageItemAddButton: {
        borderWidth: 3,
        borderColor: constants.PRIMARYCOLOR,
        padding: 5,
        width: 35,
        height: 35,
        borderRadius: 10,
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
        justifyContent: 'center',
        alignItems: 'center'
    },
    activityIndicatorContainer: {
        width: '100%',
        height: '90%',
    },
    activityIndicator: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    }
});