import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import * as constants from "../../constants";
import NavBar from "../../components/NavBar";
import QACard from "./components/QACard";

export default function FaqScreen({navigation}: NativeStackHeaderProps) {
    
    // To be replaced by a JSON response
    const data = [
        {
            question: "Who is this app for?",
            answer: "This app is intended for beginner to intermediate learners of a foreign language who want to quickly \
            grow their vocabulary. It was borne out of my own frustrations learning French vocabulary, particularly when my \
            knowledge of the language wasn't yet sufficient to learn through context. At the time, I wished there was an app \
            that could just show me lots of examples of sentences that were comprehensible to someone of my level, and where \
             the sentences would become increasingly more complex as my knowledge increased."
        },
        {
            question: "How should the app be used?",
            answer: "Simply choose what percentage of already-known words you want in new sentences. Tap a word once to see the english translation and word frequency, and double tap the word to add it to your dictionary."
        },
        {
            question: "How is the percentage comprehension calculated?",
            answer: "..."
        },
        {
            question: "Where do the sentences used in the app come from?",
            answer: "..."
        },
        {
            question: "What if I already know some words in the language I'm learning? Can I skip ahead?",
            answer: "Yes, if you already have some knowledg of your target language..."
        },
        {
            question: "Why the name Quivo?",
            answer: "Quivo is short for 'quick vocabulary'."
        },
    ]

    return (
        <SafeAreaView style={styles.container}>
            <NavBar title={"FAQs"} navigation={navigation}/>
            <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
                removeClippedSubviews={true}
            >
                {data.map((item, idx) => <QACard item={data[idx]} />)}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 20
    },
    title: {
        fontSize: constants.H2FONTSIZE,
        fontFamily: constants.FONTFAMILYBOLD,
        backgroundColor: constants.SECONDARYCOLOR,
        width: "100%",
        textAlign: "center",
        padding: 10
    }
});