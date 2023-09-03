
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native"
import { Workout } from "../types/data"
import {secToMin, formatSec} from "../utils/time"
import { ReactNode } from "react"
import { PRIMARYCOLOR, OFFWHITE } from "../constants"

export default function WorkoutItem ({item, children, childStyles= {}}: 
    {
        item: Workout
        children?: ReactNode,
        childStyles? : StyleProp<ViewStyle>
    }) {
    return (
        <View style= {styles.container}>
            <Text style= {styles.name}>{item.name}</Text>
            <Text style= {styles.duration}>Duration:  {formatSec(item.duration)}</Text>
            <Text style= {styles.difficulty}>Difficulty: {item.difficulty}</Text> 
            {children &&
            <View style={childStyles}>
                {children}
            </View>}
        </View>
    )
}

const styles= StyleSheet.create({
    container: {
        borderRadius: 10,
        borderWidth:0,
        padding: 10,
        marginBottom: 10,
        backgroundColor: OFFWHITE,
        fontColor: PRIMARYCOLOR
    },
    name: {
        fontSize:15,
        fontWeight: "bold",
        marginBottom: 5

    },
    duration: {
        fontSize: 15

    },
    difficulty: {
        fontSize: 15

    }

})