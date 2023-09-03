import { Text } from "react-native"

export function MontserratText(props: Text["props"]) {

    return(
        <Text 
            style={[props.style, {fontFamily: "montserrat"}]}
            {...props}
        />

    )

}