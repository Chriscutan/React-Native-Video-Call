import { StyleSheet, View, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const CallActionBox = ({onHangupPress}) => {

    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);

    const onReverseCamera = () => {
        Alert.alert("Camera Reversed...");
    }

    const onToggleCamera = () => {
        setIsCameraOn(currentValue => !currentValue);
    }

    const onToggleMicrophone = () => {
        setIsMicOn(currentValue => !currentValue);
    }

    const onHangup = () => {
        Alert.alert("Call Hanged up...")
    }
  return (
    <View style={styles.buttonContainer}>
    <Pressable onPress={onReverseCamera} style={styles.iconButton}>
        <Ionicons name='camera-reverse' size={30} color="white" />
    </Pressable>

    <Pressable onPress={onToggleCamera} style={styles.iconButton}>
        <MaterialIcons name={isCameraOn ? 'camera-off' : 'camera'} size={30} color="white" />
    </Pressable>

    <Pressable onPress={onToggleMicrophone} style={styles.iconButton}>
        <MaterialIcons name={isMicOn ? 'microphone-off' : 'microphone'} size={30} color="white" />
    </Pressable>

    <Pressable onPress={onHangupPress} style={[styles.iconButton, {backgroundColor: "red"}]}>
        <MaterialIcons name='phone-hangup' size={30} color="white" />
    </Pressable>
</View>
  )
}

export default CallActionBox

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: '#333333',
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        width: '100%',
        paddingBottom: 40,
        marginTop: 'auto',
    },
    iconButton: {
        backgroundColor: '#4a4a4a',
        padding: 10,
        borderRadius: 50,
    },
})