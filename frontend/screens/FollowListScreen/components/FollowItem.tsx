    import { View, Text, Image, StyleSheet, FlatList } from "react-native";
    import { useContext } from "react";
    import UserContext from "../../../contexts/UserContext";
    import * as constants from "../../../constants";
    import FollowButton from "../../../components/FollowButton";
    import { flagImageSources } from "../../../assets/img/imageSources";
    
    // TODO: Store this in interface file
    interface IUserProps {
        user_id: number,
        email: string,
        username: string,
        following_count: number,
        followers_count: number,
        known_words_count: object,
        user_is_following: boolean // Always true for following items
    }

    interface IFollowItemProps {
        user: IUserProps
    }
    
    export default function FollowItem ({ user }: IFollowItemProps) {

        const { currentLanguage } = useContext(UserContext);

        return (
            <View style={styles.followItemContainer}>
                <View style={styles.leftBoxContainer}>
                    <Text style={styles.userName}>{user.username}</Text>
                    <View style={styles.knownWordsContainer}>
                        <FlatList
                            data={Object.keys(user.known_words_count)}
                            bounces={false}
                            horizontal={true}
                            renderItem={({item}) => (
                                <>
                                {user.known_words_count[item] !== 0 &&
                                <View style={styles.knownWordsPill}>
                                    <View style={styles.flagImageContainer}>
                                        <Image
                                            source={flagImageSources[item]}
                                            style={styles.flagImage}
                                        />
                                    </View>
                                    <Text style={styles.knownWordsText}>
                                        {user.known_words_count[item]}
                                    </Text>
                                </View>
                                }
                                </>
                            )}
                        />
                    </View>
                </View>
                <View style={styles.followButtonContainer}>
                    <FollowButton 
                        initUserIsFollowing={user.user_is_following}
                        followee_id={user.user_id}
                    />
                </View>
            </View>
        );
    };
    
    const styles= StyleSheet.create({
        followItemContainer: {
            flexDirection: "row",
            backgroundColor: constants.SECONDARYCOLOR,
            borderRadius: 10,
            margin: 5,
            paddingHorizontal: 10,
            paddingVertical: 5,
            height: 70
        },
        userName: {
            fontSize: constants.H2FONTSIZE,
            fontFamily: constants.FONTFAMILY,
            color: constants.BLACK,
            marginBottom: 5,
            marginRight: 10
        },
        knownWordsContainer: {
            flexDirection: 'row'
        },
        knownWordsPill: {
            flexDirection: "row",
            backgroundColor: constants.PRIMARYCOLOR,
            height: 30,
            marginTop: 'auto',
            marginBottom: 'auto',
            marginRight: 5,
            paddingVertical: 5,
            paddingHorizontal: 7,
            borderRadius: 10,

        },
        flagImageContainer: {

        },
        knownWordsText: {
            fontFamily: constants.FONTFAMILY,
            fontSize: constants.CONTENTFONTSIZE,
            color: constants.TERTIARYCOLOR,
            marginTop: 'auto',
            marginBottom: 'auto'
        },
        flagImage: {
            width: 20,
            height: 15,
            borderRadius: 5,
            marginRight: 3,
            marginTop: "auto",
            marginBottom: "auto"
        },
        knownWords: {
            fontSize: constants.CONTENTFONTSIZE
        },
        followButtonContainer: {
            marginTop: 'auto',
            marginBottom: 'auto',
            marginLeft: 'auto'
        },
        shadow: {
            shadowColor: constants.PRIMARYCOLOR,
            shadowOffset: {
                width: 0,
                height: 0
            },
            shadowOpacity: 0.15,
            shadowRadius: 0,
            elevation: 1,
            borderWidth: 0
        }
    });