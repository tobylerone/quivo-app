import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { faQ } from "@fortawesome/free-solid-svg-icons";
// Assets
import faqs from '../../assets/faqs.json';
// Constants
import * as constants from "../../constants";
// Components
import NavBar from "../../components/NavBar";
import QACard from "./components/QACard";

export default function FaqScreen({navigation}: NativeStackHeaderProps) {

    return (
        <SafeAreaView style={styles.container}>
            <NavBar title={"FAQs"} navigation={navigation}/>
            {faqs ?            
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false} 
                    showsHorizontalScrollIndicator={false}
                    overScrollMode="never"
                    removeClippedSubviews={true}
                >
                    {faqs.map((item, idx) => <QACard key={idx} item={faqs[idx]} />)}
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