import { View, TouchableOpacity, StyleSheet } from "react-native"
import { useState } from "react";
import { FontAwesome } from '@expo/vector-icons';
import * as constants from "../constants";

interface ICheckBoxProps {
    initiallySelected: boolean;
    size: number
}

// Mettre dans components
export default function CheckBox ({ initiallySelected, size }: ICheckBoxProps) {

    const [selected, setSelected] = useState(initiallySelected);
    
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{
                width: size,
                height: size,
                ...styles.checkBox
            }}
            onPress={() => setSelected(!selected)}>
            <>
            {selected && (
                <View style={styles.checkContainer}>
                    <FontAwesome name="check" size={Math.floor(size/2)} color={constants.TERTIARYCOLOR} />
                </View>
            )}
            </>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkBox: {
        backgroundColor: constants.PRIMARYCOLOR,
        padding: 5,
        borderRadius: 10,
        alignContent: 'center'
    },
    checkContainer: {
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});