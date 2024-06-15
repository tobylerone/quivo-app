import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
// Constants
import * as constants from "../../constants";
// Components
import NavBar from "../../components/NavBar";
import QACard from "./components/QACard";
//Hooks
import { useFetchFaqs } from "./hooks/useFetchFaqs";
import { faQ } from "@fortawesome/free-solid-svg-icons";

export default function FaqScreen({navigation}: NativeStackHeaderProps) {
    
    const faqData = useFetchFaqs();

    return (
        <SafeAreaView style={styles.container}>
            <NavBar title={"FAQs"} navigation={navigation}/>
            {faqData ?            
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false} 
                    showsHorizontalScrollIndicator={false}
                    overScrollMode="never"
                    removeClippedSubviews={true}
                >
                    {faqData.map((item, idx) => <QACard key={idx} item={faqData[idx]} />)}
                </ScrollView>
            : <ActivityIndicator style={styles.activityIndicator} size='large' color={constants.PURPLEREGULAR} />
            }
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
    },
    activityIndicator: {
        marginTop: 20
    }
});