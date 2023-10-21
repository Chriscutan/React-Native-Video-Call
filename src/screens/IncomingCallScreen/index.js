import { StyleSheet, Text, View, ImageBackground, Pressable, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import bg from '../../../assets/images/ios-bg.png'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation, useRoute } from '@react-navigation/native'
import {Voximplant} from 'react-native-voximplant';

const IncomingCallScreen = () => {

    const [caller, setCaller] = useState('');

    const route = useRoute();
    const navigation = useNavigation();
    const {call} = route.params;


    useEffect(() => {
       setCaller(call.getEndpoints()[0].displayName);

        call.on(Voximplant.CallEvents.Disconnected, () => {
            navigation.navigate("Contacts");
        })

        return () => {
            call.off(Voximplant.CallEvents.Disconnected);
        }
    }, [])

    const onDecline = () => {
       call.decline();
    }

    const onAccept = () => {
        navigation.navigate("Calling", {
            call,
            isIncomingCall: true,
        })
    }
    
  return (
       <ImageBackground source={bg} style={styles.bg} resizeMode='cover'>
            <Text style={styles.name}>{caller}</Text>
            <Text style={styles.phoneNumber}>Whatsapp Video</Text>

            <View style={{marginTop: 50 }}>
                <View style={styles.row}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="alarm" color="white" size={30} />
                        <Text style={styles.iconText}>Remind me</Text>
                    </View>

                    <View style={styles.iconContainer}>
                        <Entypo name="message" color="white" size={30} />
                        <Text  style={styles.iconText}>Message</Text>
                    </View>
                </View>

                <View  style={styles.row}>
                    {/* Decline Button */}
                    <Pressable style={styles.iconContainer} onPress={onDecline}>
                        <View style={styles.iconButtonContainer}>
                            <Feather name="x" color="white" size={30} />
                        </View>
                        <Text  style={styles.iconText}>Decline</Text>
                    </Pressable>

                    {/* Accept Button */}
                    <Pressable style={styles.iconContainer} onPress={onAccept}>
                        <View style={[styles.iconButtonContainer, {backgroundColor: 'blue'}]}>
                            <AntDesign name="check" color="white" size={30} />
                        </View>
                        <Text  style={styles.iconText}>Accept</Text>
                    </Pressable>
                </View> 
            </View>
               
        </ImageBackground>    
  )
}

export default IncomingCallScreen

const styles = StyleSheet.create({
    bg: {
       flex: 1,
       alignItems: "center",
       padding: 10,
    },
    name: {
        fontSize: 30,
        fontWeight: "bold",
        color: 'white',
        marginTop: 50,
        marginBottom: 10,
    },
    phoneNumber: {
        fontSize: 20,
        color: "white",
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-around",
    },
    iconContainer: {
        alignItems: "center",
    },
    iconText: {
        color: "white",
        marginTop: 10,
    },
    iconButtonContainer: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 50,
        margin: 10,
    },
})