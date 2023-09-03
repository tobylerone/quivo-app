import { FunctionComponent, useState } from "react"
import { View, Modal as DefaultModal, StyleSheet, GestureResponderEvent } from "react-native"
import { PressableText } from "./PressableText"

type ModalProps = {
    activator?: FunctionComponent<
    {
        handleOpen: () => void
    }
    >,
    children: React.ReactNode,
}


export function ModalM({
    activator : Activator,
    children
}: ModalProps) {
    const [isModalVisible, setModalVisible] = useState(false)
    return (
        <>
        <DefaultModal
            visible={isModalVisible}
            transparent={false}
            animationType="fade"
        >
         <View style={stlyes.centerView}>
            <View style={stlyes.contentView}>
            {children}
            </View>
         <PressableText 
            onPress={()=> setModalVisible(false)}
            text="Close"/>
        </View>
        </DefaultModal>
        {Activator ? 
            <Activator 
            handleOpen={() => setModalVisible(true)}
            /> : 
            <PressableText 
            onPress={() => setModalVisible(true)} 
            text="Open" />
        }
         </>
    )
}

const stlyes = StyleSheet.create({
    centerView: {
        flex:1,
        justifyContent: "center",
        alignItems: "center"

    },
    contentView: {
        marginBottom: 20
    }

  
})

