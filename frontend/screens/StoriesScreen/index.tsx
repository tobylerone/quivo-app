import { StyleSheet, SafeAreaView, ScrollView, View, Text, Image } from "react-native";
import { useContext, useState } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
// Constants
import * as constants from "../../constants";
// Contexts
import UserContext from "../../contexts/UserContext";
// Interfaces
import ISentence from "../../interfaces";
// Components
import NavBar from "../../components/NavBar";
import BottomNavBar from "../../components/BottomNavBar";
import RaisedButton from "../../components/RaisedButton";
// Assets
import { avatarImageMap } from "../../assets/avatars/avatarMaps";
import stories from "../../assets/stories.json";

/*
sentence = models.TextField(null=True)
translated_sentence = models.TextField(null=True)
cluster = models.IntegerField(null=True)
words = models.JSONField(null=True)
average_count = models.DecimalField(decimal_places=4, max_digits=20, null=True)
min_count = models.DecimalField(decimal_places=4, max_digits=20, null=True)
average_count_rank = models.DecimalField(decimal_places=1, max_digits=20, null=True)
min_count_rank = models.DecimalField(decimal_places=1, max_digits=20, null=True)
*/

export default function StoriesScreen({navigation}: NativeStackHeaderProps) {
    
    const { currentUser, currentLanguageCompletedStories } = useContext(UserContext);
    const [scrolledIndex, setScrolledIndex] = useState(currentLanguageCompletedStories);

    const itemHeight = 160;
    const visibleStories = currentUser.is_premium ? stories : stories.slice(0, 5);
    const numStories = stories.length;

    const storyIndexColors: Record<number, string[]> = {
        0: [constants.GREENREGULAR, constants.GREENLIGHT],
        10: [constants.ORANGEREGULAR, constants.ORANGELIGHT],
        20: [constants.PRIMARYCOLOR, constants.PRIMARYCOLORLIGHT],
        30: [constants.PURPLEREGULAR, constants.PURPLELIGHT],
        40: [constants.LIGHTBLUE, constants.LIGHTBLUELIGHT],
        50: [constants.LIGHTBLUE, constants.LIGHTBLUELIGHT],
        60: [constants.LIGHTBLUE, constants.LIGHTBLUELIGHT],
        70: [constants.LIGHTBLUE, constants.LIGHTBLUELIGHT],
        80: [constants.LIGHTBLUE, constants.LIGHTBLUELIGHT],
        90: [constants.LIGHTBLUE, constants.LIGHTBLUELIGHT],
        100: [constants.LIGHTBLUE, constants.LIGHTBLUELIGHT],
        110: [constants.LIGHTBLUE, constants.LIGHTBLUELIGHT]
    }

    const renderDot = (index: number, color: string, completedStories: number) => (
        <View style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: index < completedStories ? color : constants.GREY,
            //marginBottom: 5,
            marginLeft: 'auto',
            marginRight: 'auto',
        }}></View>
    );

    const renderItem = (index: number) => {
        const colorRecord = storyIndexColors[Math.floor(0.1 * (index)) * 10];
        const primaryColor = colorRecord[0];
        const secondaryColor = colorRecord[1];
        return (
        <View
            style={{
                backgroundColor: secondaryColor,
                height: itemHeight,
                ...styles.itemContainer
            }}
            key={index}
            >
            <View style={{
                width: '60%',
                marginBottom: 10,
                marginLeft: Math.abs(((index + 4) % 8) - 4) * 10 + '%'
            }}>
                <View
                    style={{
                        //borderColor: index < completedStories + 1 ? constants.PRIMARYCOLORSHADOW : constants.GREY,
                        transform: [{
                            rotate: ((index - 1) % 8) < 4 ? '-15deg' : '15deg'
                        }],
                        marginLeft: ((index - 1) % 8) < 4 ? '30%' : '50%',
                        ...styles.line
                    }}>
                    {/*[0, 1, 2, 3].map(() => renderDot(index, primaryColor, completedStories))*/}
                    {renderDot(index, primaryColor, currentLanguageCompletedStories)}
                    <Text style={{
                        fontFamily: constants.FONTFAMILYBOLD,
                        fontSize: constants.H2FONTSIZE,
                        color: constants.BLACK,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: 5,
                        marginBottom: 5,
                        transform: [{
                            rotate: ((index - 1) % 8) < 4 ? '15deg' : '-15deg'
                        }]
                        }}>{index + 1}</Text>
                    {renderDot(index, primaryColor, currentLanguageCompletedStories)}
                </View>
                {(index % 4 == 0 && index % 8 != 0) &&
                    <View style={{
                        width: 80,
                        height: 80,
                        position: 'absolute',
                        marginBottom: 'auto',
                        marginTop: 'auto',
                        left: '-55%',
                        top: 30
                    }}>
                        <Image
                            source={avatarImageMap[(index / 4) + 1]}
                            style={{
                                width: '100%',
                                height: '100%'
                            }}
                            />
                    </View>
                }
                <RaisedButton
                    onPress={() => navigation.navigate('ReadStory',
                        {
                            storyIndex: index,
                            primaryColor: primaryColor
                        }
                    )}
                    options={{
                        ...RaisedButton.defaultProps.options,
                        disabled: index <= currentLanguageCompletedStories ? false : true,
                        width: '100%',
                        height: 80,
                        borderWidth: 3,
                        borderRadius: 40,
                        borderColor: index <= currentLanguageCompletedStories ? primaryColor : constants.GREY,
                        backgroundColor: constants.TERTIARYCOLOR,
                        shadowColor: index <= currentLanguageCompletedStories ? primaryColor : constants.GREY,
                    }}
                >
                    <Text style={{
                    fontFamily: constants.FONTFAMILYBOLD,
                    fontSize: constants.H2FONTSIZE,
                    color: index <= currentLanguageCompletedStories ? constants.PRIMARYCOLORSHADOW : constants.GREY,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 'auto',
                    marginBottom: 'auto'
                }}>{visibleStories[index][0]}</Text>
                </RaisedButton>
                {(index % 8 == 0) &&
                    <View style={{
                        width: 80,
                        height: 80,
                        position: 'absolute',
                        marginBottom: 'auto',
                        marginTop: 'auto',
                        left: '120%',
                        top: 40
                    }}>
                        <Image
                            source={avatarImageMap[(index / 4) + 1]}
                            style={{
                                width: '100%',
                                height: '100%'
                            }}
                            />
                    </View>
                }
            </View>
        </View>
        );
    }

    const handleScroll = (event) => {
        const scrollTop = event.nativeEvent.contentOffset.y; // get current scroll position
        const currentIndex = Math.floor(scrollTop / itemHeight); // calculate index
        setScrolledIndex(currentIndex);
      };
    
    return (
        <>
        <SafeAreaView style={{
            backgroundColor: storyIndexColors[Math.floor(0.1 * (scrolledIndex)) * 10][1],
            ...styles.container
            }}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Stories ({currentLanguageCompletedStories}/{numStories})</Text>
            </View>
            <ScrollView
                onScroll={handleScroll}
                bounces={false}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
                removeClippedSubviews={true}
            >
                {visibleStories.map((_, index) => renderItem(index))}
                {!currentUser.is_premium &&
                    <View style={styles.reservedPremiumContainer}>
                        <Text style={styles.reservedPremiumText}>Upgrade to premium for more stories...</Text>
                        <View style={styles.reservedPremiumButtonContainer}>
                            <RaisedButton
                            onPress={() => navigation.navigate('GetPremium')}
                            options={{
                                ...RaisedButton.defaultProps.options,
                                width: 200,
                                height: 80,
                                borderWidth: 3,
                                borderRadius: 40,
                                borderColor: constants.PURPLEREGULAR,
                                backgroundColor: constants.TERTIARYCOLOR,
                                shadowColor: constants.PURPLEREGULAR,
                            }}
                        >
                            <Text style={{
                            fontFamily: constants.FONTFAMILYBOLD,
                            fontSize: constants.H2FONTSIZE,
                            color: constants.PRIMARYCOLORSHADOW,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: 'auto',
                            marginBottom: 'auto'
                        }}>Get Premium</Text>
                        </RaisedButton>
                    </View>
                </View> 
                }
            </ScrollView>
        </SafeAreaView>
        <BottomNavBar hilighted='Stories' navigation={navigation} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        marginBottom: 115
    },
    titleContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10,
    },
    titleText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H1FONTSIZE,
        color: constants.BLACK,
        marginBottom: 10
    },
    itemContainer: {
        paddingHorizontal: 16,
        paddingBottom: 18,
        paddingTop: 15,
        marginBottom: -1
    },
    line: {
        height: 70,
        width: 50,
        flexDirection: 'column',
        marginTop: -32,
        marginBottom: 0
    },
    reservedPremiumContainer: {
        height: 250,
        backgroundColor: constants.GREENLIGHT
    },
    reservedPremiumText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H1FONTSIZE,
        color: constants.BLACK,
        //backgroundColor: constants.PURPLELIGHT,
        borderRadius: 20,
        padding: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10,
        textAlign: 'center',
    },
    reservedPremiumButtonContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 'auto',
    }
});