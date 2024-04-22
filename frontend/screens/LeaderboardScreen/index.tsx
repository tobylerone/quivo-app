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

    const { currentUser } = useContext(UserContext);

    const renderDot = (index: number, completedStories: number) => (
        <View style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: index < completedStories ? constants.PRIMARYCOLORSHADOW : constants.GREY,
            marginBottom: 5
        }}></View>
    );

    const renderItem = (index: number) => {
        
        const completedStories = 3;
        
        return (
        <View style={{
            width: '60%',
            marginTop: 7,
            marginBottom: 10,
            marginLeft: Math.abs(((index + 4) % 8) - 4) * 10 + '%'
        }}>
            {index > 0 && <View
                style={{
                    //borderColor: index < completedStories + 1 ? constants.PRIMARYCOLORSHADOW : constants.GREY,
                    transform: [{
                        rotate: ((index - 1) % 8) < 4 ? '-15deg' : '15deg'
                    }],
                    marginLeft: ((index - 1) % 8) < 4 ? '40%' : '55%',
                    ...styles.line
                }}>
                {[0, 1, 2, 3].map(() => renderDot(index, completedStories))}
            </View>
            }
            {(index % 4 == 0 && index % 8 != 0) &&
                <View style={{
                    width: 80,
                    height: 80,
                    position: 'absolute',
                    marginBottom: 'auto',
                    marginTop: 'auto',
                    left: '-55%',
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
            <RaisedButton
                onPress={() => navigation.navigate('ReadStory', {storyIndex: index})}
                options={{
                    ...RaisedButton.defaultProps.options,
                    width: '100%',
                    height: 80,
                    borderWidth: 3,
                    borderRadius: 40,
                    borderColor: index < completedStories ? constants.PRIMARYCOLORSHADOW : constants.GREY,
                    backgroundColor: constants.TERTIARYCOLOR,
                    shadowColor: index < completedStories ? constants.PRIMARYCOLORSHADOW : constants.GREY,
                }}
            >
                <Text style={{
                fontFamily: constants.FONTFAMILYBOLD,
                fontSize: constants.H2FONTSIZE,
                color: index < completedStories ? constants.PRIMARYCOLORSHADOW : constants.GREY,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 'auto',
                marginBottom: 'auto'
            }}>{stories[index][0]}</Text>
            </RaisedButton>
            {(index % 8 == 0) &&
                <View style={{
                    width: 80,
                    height: 80,
                    position: 'absolute',
                    marginBottom: 'auto',
                    marginTop: 'auto',
                    left: '120%',
                    top: index == 0 ? 0 : 40
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
        );
    }
    
    return (
        <>
        <SafeAreaView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Stories</Text>
            </View>
            <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
                removeClippedSubviews={true}
            >
                {stories.map((_, index) => renderItem(index))}
            </ScrollView>
        </SafeAreaView>
        <BottomNavBar hilighted='Stories' navigation={navigation} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingHorizontal: 16,
        marginBottom: 115,
        backgroundColor: constants.TERTIARYCOLOR
    },
    titleContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10
    },
    titleText: {
        fontFamily: constants.FONTFAMILYBOLD,
        fontSize: constants.H1FONTSIZE,
        color: constants.BLACK,
        marginBottom: 10
    },
    line: {
        height: 70,
        width: 7,
        flexDirection: 'column',
        //borderLeftWidth: 7,
        //borderStyle: 'dotted',
        marginTop: -15,
        marginBottom: -13
    }
});