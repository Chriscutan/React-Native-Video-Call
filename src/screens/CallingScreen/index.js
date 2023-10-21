import { StyleSheet, Text, View, Pressable, PermissionsAndroid, Alert, Platform } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import CallActionBox from '../../components/CallActionBox'
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation, useRoute } from '@react-navigation/native'
import {Voximplant} from 'react-native-voximplant';

const permissions = [
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.CAMERA,
]

const CallingScreen = () => {

    const [permissionsGranted, setPermissionsGranted] = useState(false);
    const [callStatus, setCallStatus] = useState('Initializing...')
    const [localVideoStreamId, setLocalVideoStreamId] = useState('');
    const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');
    
    const navigation = useNavigation();
    const route = useRoute();

    const {user, call: incomingCall, isIncomingCall} = route?.params;

    const voxImplant = Voximplant.getInstance();

    const call = useRef(incomingCall);
    const endPoint = useRef(null);

    useEffect(() => {
        const getPermissions = async () => {
            const granted = await PermissionsAndroid.requestMultiple(permissions);
            const recordAudioGranted = granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
            const cameraGranted = granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';

            if(!cameraGranted || !recordAudioGranted){
                Alert.alert("Permissions not granted");
            }else {
                setPermissionsGranted(true)
            }
        }

        if(Platform.OS === 'android'){
            getPermissions();
        }else{
            setPermissionsGranted(true);
        }
    }, [])

    useEffect(() => {
        if(!permissionsGranted){
            return;
        }

        const callSettings = {
            video: {
                sendVideo: true,
                receiveVideo: true,
            }
        }
        
        const makeCall = async () => {
            call.current = await voxImplant.call(user.user_name, callSettings);
            subscribeToCallEvents();
        }

        const subscribeToCallEvents = () => {
            call.current.on(Voximplant.CallEvents.Failed, (callEvent) => {
                showError(callEvent.reason);
            })

            call.current.on(Voximplant.CallEvents.ProgressToneStart, () => {
                setCallStatus('Calling...');
            })

            call.current.on(Voximplant.CallEvents.Connected, () => {
                setCallStatus('Connected...');
            })

            call.current.on(Voximplant.CallEvents.Disconnected, () => {
                setCallStatus('Disconnected...');
                navigation.navigate("Contacts");
            })

            call.current.on(Voximplant.CallEvents.LocalVideoStreamAdded, (callEvent) => {
                setLocalVideoStreamId(callEvent.videoStream.id);
            })

            call.current.on(Voximplant.CallEvents.EndpointAdded, (callEvent) => {
                endPoint.current = callEvent.endpoint;
                subscribeToEndpointEvent();
            })
        }

        const subscribeToEndpointEvent = async () => {
            endPoint.current.on(
                Voximplant.EndpointsEvents.RemoteVideoStreamAdded, endpointEvent => {
                    setRemoteVideoStreamId(endpointEvent.videoStream.id);
                }
            )
        }

        const answerCall = async () => {
            subscribeToCallEvents();
            endPoint.current = call.current.getEndpoints()[0];
            call.current.answer(callSettings);
        }

        if(isIncomingCall){
            answerCall();
        }else{
            makeCall();
        }

        return () => {
            call.current.off(Voximplant.CallEvents.Failed);
            call.current.off(Voximplant.CallEvents.ProgressToneStart);
            call.current.off(Voximplant.CallEvents.Connected);
            call.current.off(Voximplant.CallEvents.Disconnected);
        }
    }, [permissionsGranted])

    const showError = (reason) => {
        Alert.alert("Call Failed", `Reason: ${reason}`, [{
            text: 'Ok',
            onPress: navigation.navigate("Contacts"),
        }])
    }

    const onHangupPress = () => {
        call.current.hangup();
    }

  return (
    <View style={styles.page}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" color="white" size={30}/>
        </Pressable>

        <Voximplant.VideoView videoStreamId={localVideoStreamId} style={styles.localVideo}/>

        <Voximplant.VideoView videoStreamId={remoteVideoStreamId} style={styles.remoteVideo}/>

        <View style={styles.cameraPreview}>
            <Text style={styles.name}>{user?.user_display_name}</Text>
            <Text style={styles.phoneNumber}>{callStatus}</Text>           
        </View>

        <CallActionBox onHangupPress={onHangupPress}/>
    </View>
  )
}

export default CallingScreen

const styles = StyleSheet.create({
    page: {
        height: '100%',
        backgroundColor: '#7b4880',
    },
    cameraPreview: {
        flex: 1,
        alignItems: "center",
        paddingTop: 10,
        paddingHorizontal: 10,
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
    backButton: {
        position: "absolute",
        top: 20,
        left: 10,
    },
    localVideo: {
       width: 100,
       height: 150,
       backgroundColor: "#ffff6e",
       position: 'absolute',
       top: 40,
       right: 10,
       borderRadius: 10,
       zIndex: 10,
    },
    remoteVideo: {
       backgroundColor: "#ffff6e",
       position: 'absolute',
       top: 0,
       left: 0,
       bottom: 100,
       right: 0,
       borderRadius: 10,
    }
})