import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from "react-native"
import { useEffect, useState, useContext } from "react"
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { FontAwesome } from "@expo/vector-icons"
import UserContext from '../contexts/UserContext';
import * as constants from "../constants";
import client from "../utils/axios";

interface ILanguageItem {
    item: {
        id: number,
        language_code: string,
        language_name: string
    },
    addButton: boolean
}

const LanguageItem = ({ item, addButton }: ILanguageItem) => {

    // Can't render image paths dynamically at runtime so I have
    // to map the language codes to their locally stored flag
    // image. Need to look into a better solution
    const flagImageMap = {
        'ru': require('../assets/ru.png'),
        'de': require('../assets/de.png'),
        'es': require('../assets/es.png'),
        'fr': require('../assets/fr.png'),
        // add more languages here
    };

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
                onPress={() => {}}
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
    const [knownLanguages, setKnownLanguages] = useState([]);
    const [unknownLanguages, setUnknownLanguages] = useState([]);
    
    useEffect(() => {
        fetchKnownLanguages();
    }, []);

    useEffect(() => {
        fetchAllLanguages();
    }, [knownLanguages]);

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
                item2 => !knownLanguages.some(
                    item1 => item1.language_code === item2.language_code
                )
            );

            setUnknownLanguages(unknownLanguages);
        })
        .catch(function(error) {
        });
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.subContainer}>
                <Text style={styles.title}>Your Languages</Text>
                <FlatList
                    data={knownLanguages}
                    bounces={false}
                    renderItem={({item}) => <LanguageItem item={item} addButton={false}/>}
                />
            </View>
            <View style={styles.subContainer}>
                <Text style={styles.title}>More Languages</Text>
                <FlatList
                    data={unknownLanguages}
                    bounces={false}
                    renderItem={({item}) => <LanguageItem item={item} addButton={true} />}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        borderColor: constants.SECONDARYCOLOR,
        borderWidth: 3,
        borderRadius: 20,
        overflow: 'hidden',
        //marginTop: StatusBar.currentHeight,
        marginHorizontal: 16,
    },
    subContainer: {
    },
    title: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        backgroundColor: constants.SECONDARYCOLOR,
        width: '100%',
        textAlign: 'center',
        //marginBottom: 10,
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

});