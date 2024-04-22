import { StyleSheet, SafeAreaView, ScrollView, View, Text } from "react-native";
import { useContext, useState } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
// Constants
import * as constants from "../../constants";
// Contexts
import UserContext from "../../contexts/UserContext";
// Components
import NavBar from "../../components/NavBar";
import BottomNavBar from "../../components/BottomNavBar";
import RaisedButton from "../../components/RaisedButton";

export default function StoriesScreen({navigation}: NativeStackHeaderProps) {

    const { currentUser } = useContext(UserContext);
  
    const stories = [
        ["Language Ace", "Once upon a time, there was a young woman named Mia. She had a deep passion for languages and cultures. One day, she decided to learn Spanish, inspired by its rich history and beautiful literature. She started with basic vocabulary, practicing every day without fail. Mia used flashcards, language apps, and even watched Spanish movies to improve her listening skills. She struggled with the grammar at first, but she was determined not to give up. Mia joined a local language exchange group where she met native Spanish speakers. This helped her immensely in understanding the nuances of the language. After a year of hard work, Mia became fluent in Spanish. Her journey taught her that with perseverance, one can indeed master a new language."],
        ["Day at The Zoo", "In the heart of a bustling city, lived a curious boy named Sam. His fascination for animals was unparalleled, and the zoo was his favourite place. One sunny day, his family decided to surprise him with a trip to the zoo. As they entered, Sam's eyes sparkled with excitement. He ran from one enclosure to another, his laughter echoing through the zoo. His favourite were the majestic lions, their roars sending chills down his spine. He watched in awe as the elephants bathed, splashing water around playfully. The colourful parrots, chattering away, reminded him of a vibrant painting. As the day ended, Sam left the zoo with a heart full of joy and a mind full of memories. This day at the zoo with his family, seeing his favourite animals, was a day he would cherish forever."],
        ["An Old Flame", "There was an old man named John. Many years ago, he met a woman from Poland. They fell in love, but life took them on different paths. Now, John was alone and missed her deeply. He decided to learn Polish to reconnect with her. Every day, he studied hard, learning new words and phrases. He practiced speaking Polish with anyone who would listen. After months of hard work, he could speak Polish fluently. He then traveled to Poland, hoping to find his old love. When they met, she was touched by his effort to learn her language, and they rekindled their love."],
        ["The Baker's Surprise", "In a small town, there was a baker named Tom. He was known for his delicious pastries. One day, he found an old recipe in his grandmother's cookbook. It was for a cake he had never heard of before. Intrigued, Tom decided to bake it. He followed the recipe carefully, adding each ingredient with precision. When the cake was ready, it smelled heavenly. He shared it with his customers the next day. To his delight, they loved it! It became the most popular item in his bakery."],
        ["The Lost Puppy", "A little puppy named Spot got lost in the park. He was scared and missed his family. A girl named Lily found him hiding behind a tree. She could tell he was lost and decided to help. Lily made posters and put them up around the park. She took good care of Spot, giving him food and a warm place to sleep. After a few days, Spot's family saw the poster. They were overjoyed to find Spot safe with Lily. Lily was happy to reunite Spot with his family. From that day, Lily and Spot became the best of friends."],
        ["The Brave Kitten", "There was a tiny kitten named Whiskers. He was adventurous and loved exploring. One day, he climbed up a tall tree. But then, he couldn't get down. He was scared and started meowing loudly. A boy named Max heard him. Max quickly called the fire department. They arrived and rescued Whiskers. Max decided to adopt Whiskers and gave him a loving home. From then on, Whiskers preferred to have his adventures on the ground."],
        ["The Magic Paintbrush", "A young artist named Bella found a paintbrush on the beach. She started painting with it and realized it was magical. Whatever she painted became real. She painted beautiful landscapes and they came to life. Bella used this magic to bring happiness to her town. She painted parks, playgrounds, and beautiful buildings. The town became a vibrant and joyful place. Bella's art brought the community together. She continued to create magic with her paintbrush, spreading joy wherever she went."],
        ["The Forgotten Book", "In a dusty old bookstore, there was a forgotten book. No one seemed to notice it. One day, a girl named Lucy found the book. She started reading it and couldn't put it down. The book was full of fascinating tales and adventures. Lucy shared the stories with her friends. They were captivated by the tales. The book became popular in the town. It was no longer forgotten, but cherished. The book taught everyone the joy of reading and the magic of storytelling."],
        // Simple
        ["The Lost Toy", "A boy named Tim had a toy. It was a red car. He lost it one day. He was very sad. He looked for it everywhere. His sister found it under the bed. She gave it to Tim. He was very happy. He thanked his sister. He played with his car again."],
        ["The Friendly Dog", "There was a dog named Spot. Spot was very friendly. He liked to play with a ball. One day, the ball rolled away. Spot looked for the ball. He found it in a bush. He was very excited. He took the ball home. He played with it all day. Spot loved his ball very much."],
        //Intermediate
        ["A Stellar Surprise", "There was a girl named Emma who loved stargazing. One clear night, she saw a shooting star. It was a beautiful sight. She made a wish, hoping it would come true. The next day, she found a telescope in her room. Her parents had surprised her. Emma was thrilled. She could now see the stars up close. Every night, she would look at the stars and dream. It was a magical experience for her."],
        ["The Hidden Treasure", "In a small town, there was a legend of hidden treasure. A boy named Jake was fascinated by this legend. He decided to find the treasure. He studied old maps and books. He followed the clues to a cave. Inside the cave, he found a chest. It was filled with gold and jewels. Jake was thrilled with his discovery. He used the treasure to help his town. His adventure made him a local hero."],
        //Advanced
        ["The Mysterious Island", "In the vast expanse of the Pacific Ocean, there existed an uncharted island. It was discovered by an intrepid explorer named Captain James. The island was teeming with exotic flora and fauna, unlike anything James had ever seen. Intrigued, he decided to delve deeper into the island's mysteries. He encountered ancient ruins, hinting at a lost civilization. James meticulously documented his findings, capturing the essence of the island's enigmatic charm. His discoveries piqued the interest of the scientific community. Expeditions were organized to further explore the island. The island, once unknown, became a beacon of discovery and exploration. It was a testament to the endless wonders that our world holds."],
        ["The Enchanted Forest", "In the realm of Eldoria, there existed an enchanted forest. It was said to be home to mystical creatures. A brave knight named Sirus ventured into the forest. He was on a quest to find the legendary Phoenix. Guided by the whispers of the wind and the forest's subtle signs, he journeyed deeper. Amidst the emerald foliage, he found the Phoenix. Its radiant plumage illuminated the forest, casting ethereal shadows. The Phoenix granted Sirus a single wish for his bravery. Sirus wished for the prosperity of Eldoria. His encounter with the Phoenix marked a new era of peace and prosperity in Eldoria."],
    ];

    const renderDot = (index: number, completedStories: number) => (
        <View style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: index < completedStories ? constants.PRIMARYCOLORSHADOW : constants.GREY,
            marginBottom: 10
        }}></View>
    );

    const renderItem = (title: string, index: number) => {
        
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
            <RaisedButton
                onPress={() => {}}
                options={{
                    ...RaisedButton.defaultProps.options,
                    width: '100%',
                    height: 80,
                    borderWidth: 3,
                    borderRadius: 20,
                    borderColor: index < completedStories ? constants.PRIMARYCOLORSHADOW : constants.GREY,
                    backgroundColor: constants.TERTIARYCOLOR,
                    shadowColor: index < completedStories ? constants.PRIMARYCOLORSHADOW : constants.GREY,
                }}
            >
                <Text style={{
                fontFamily: constants.FONTFAMILYBOLD,
                fontSize: constants.H3FONTSIZE,
                color: index < completedStories ? constants.PRIMARYCOLORSHADOW : constants.GREY,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 'auto',
                marginBottom: 'auto'
            }}>{title}</Text>
            </RaisedButton>
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
                {stories.map((story, index) => renderItem(story[0], index))}
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
        marginTop: -13,
        marginBottom: 3
    }
});