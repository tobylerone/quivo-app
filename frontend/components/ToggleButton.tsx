import { View, TouchableOpacity, StyleSheet } from "react-native"
import { useState } from "react";
import { FontAwesome } from '@expo/vector-icons';
import * as constants from "../constants";

interface IToggleButtonProps {
    initiallySelected: boolean;
    size: number,
    onValueChange: Function
}

// Mettre dans components
export default function ToggleButton ({ initiallySelected, size, onValueChange }: IToggleButtonProps) {

    const [selected, setSelected] = useState(initiallySelected);
    
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{
                width: size * 1.8,
                height: size,
                borderRadius: 0.5 * size,
                backgroundColor: selected ? constants.GREEN : constants.GREY,
                ...styles.toggleButton
            }}
            onPress={() => {
                setSelected(!selected);
                onValueChange();
            }}>
            <View style={{
                width: size,
                height: size,
                borderRadius: 0.5 * size,
                marginLeft: selected ? 'auto' : 0,
                ...styles.toggleCircle
                }}>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    toggleButton: {
    },
    toggleCircle: {
        backgroundColor: constants.PRIMARYCOLOR
    },
    checkContainer: {
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});