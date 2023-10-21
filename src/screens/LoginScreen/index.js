import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import {Voximplant} from 'react-native-voximplant';
import { ACC_NAME, APP_NAME } from '../../Constants';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    const voxImplant = Voximplant.getInstance();

    useEffect(() => {
        const connect = async () => {
            const status = await voxImplant.getClientState();
            if(status === Voximplant.ClientState.DISCONNECTED){
                await voxImplant.connect();
            } else if(status === Voximplant.ClientState.LOGGED_IN){
                redirectHome();
            }
        }

        connect();
    }, [])

    const signIn = async () => {
        try{
            const perfectUsername = `${username}@${APP_NAME}.${ACC_NAME}.voximplant.com`
            await voxImplant.login(perfectUsername, password);
            redirectHome();
        }catch(err){
            Alert.alert(err.name, `Error code: ${err.code}`);
        }
    }

    const redirectHome = () => {
        navigation.reset({
            index: 0,
            routes: [{
                name: 'Contacts',
            }]
        });
    }
  return (
    <View style={styles.page}>
        <TextInput value={username} onChangeText={(text) => setUsername(text)} autoCapitalize='none' placeholder='Username' style={styles.input}/>
        <TextInput value={password} secureTextEntry onChangeText={(text) => setPassword(text)} placeholder='Password' style={styles.input}/>

        <Pressable style={styles.button} onPress={signIn}>
            <Text>Sign In</Text>
        </Pressable>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    page: {
        padding: 10,
        alignItems: 'stretch',
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        backgroundColor: "white",
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
    },
    button: {
        backgroundColor: "dodgerblue",
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    }
})