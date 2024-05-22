import { View, TouchableOpacity } from "react-native"
import { useState, useContext } from "react";
import PropTypes from 'prop-types';
// Constants
import * as constants from "../constants"
// Context
import UserContext from '../contexts/UserContext';
// Client
import client from "../utils/axios";

interface IRaisedButtonProps {
    children: React.ReactNode,
    onPress: Function,
    options?: {
        width?: number,
        height?: number,
        disabled?: boolean,
        borderWidth?: number,
        borderRadius?: number,
        backgroundColor?: string,
        borderColor?: string,
        shadowColor?: string,
        raisedHeight?: number
    }
}

RaisedButton.propTypes = {
    children: PropTypes.node.isRequired,
    onPress: PropTypes.func.isRequired,
    options: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
        disabled: PropTypes.bool,
        borderWidth: PropTypes.number,
        borderRadius: PropTypes.number,
        backgroundColor: PropTypes.string,
        borderColor: PropTypes.string,
        shadowColor: PropTypes.string,
        raisedHeight: PropTypes.number
    })
};

RaisedButton.defaultProps = {
    options: {
        flexDirection: 'row',
        width: 100,
        height: 50,
        disabled: false,
        borderWidth: 3,
        borderRadius: 10,
        backgroundColor: constants.PRIMARYCOLOR,
        borderColor: constants.PRIMARYCOLOR,
        shadowColor: constants.PRIMARYCOLORSHADOW,
        raisedHeight: 7
    }
};

export default function RaisedButton(
    {children, onPress, options}: IRaisedButtonProps) {
    
    //Not sure if you can import hook setters like this but it didn't seem to work
    const { currentUser, setCurrentUser } = useContext(UserContext);
    
    const [isPressedDown, setIsPressedDown] = useState<boolean>(false);

    const handlePress = () => {
        onPress();
    }
    
    return (
        <View style={{
            height: options.height + options.borderWidth
            }}>
            <View style={{
                flexDirection: options.flexDirection,
                width: options.width,
                height: options.height,
                backgroundColor: options.shadowColor,
                borderWidth: options.borderWidth,
                borderColor: options.shadowColor,
                borderRadius: options.borderRadius,
                //marginBottom: -(options.height + (isPressedDown ? -4 : options.raisedHeight - (2 * options.borderWidth)))
                marginBottom: -(options.height + options?.raisedHeight)
            }}></View>
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={() => {
                    handlePress();
                    setIsPressedDown(true);
                }}
                onPressOut={() => setIsPressedDown(false)}
                style={{
                    width: options.width,
                    height: options.height,
                    borderWidth: options.borderWidth,
                    borderRadius: options.borderRadius,
                    backgroundColor: options.backgroundColor,
                    borderColor: options.borderColor,
                    marginTop: isPressedDown ? options?.raisedHeight : 0
                }}
                onPress={() => {}}
                disabled={options.disabled}
                >
                {children}
            </TouchableOpacity>
        </View>
    );
}