import React, {useState, useEffect} from "react";
import { FlatList, StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import Contacts from '../../../assets/contacts.json'
import { useNavigation } from "@react-navigation/native";
import {Voximplant} from 'react-native-voximplant';


const ContactsScreeen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredContacts, setFilteredContacts] = useState(Contacts);

    const navigation = useNavigation();

    const voxImplant = Voximplant.getInstance();

    useEffect(() => {
      voxImplant.on(Voximplant.ClientEvents.IncomingCall, (incomingCallEvent) => {
        navigation.navigate("IncomingCall", {call: incomingCallEvent.call});
      })

      return () => {
        voxImplant.off(Voximplant.ClientEvents.IncomingCall);
      }
    }, [])


    useEffect(() => {
        const newContacts = Contacts.filter((contact) => contact.user_display_name.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredContacts(newContacts);
    }, [searchTerm])

    const callUser = (user) => {
       navigation.navigate('Calling', {user});
    }

    return(
        <View style={styles.page}>
            <TextInput placeholder="Search..." value={searchTerm} onChangeText={(text) => setSearchTerm(text)} style={styles.searchInput}/>
            <FlatList ItemSeparatorComponent={() => <View style={styles.seperator}/>} data={filteredContacts} renderItem={({item}) => (
                <Pressable onPress={() => callUser(item)}><Text style={styles.contactName}>{item.user_display_name}</Text></Pressable>
            )}/>
      </View>
    )
}

export default ContactsScreeen;

const styles = StyleSheet.create({
    page: {
      padding: 15,
      flex: 1,
      backgroundColor: "white"
    },
    contactName: {
      fontSize: 16,
      marginVertical: 10,
    },
    seperator: {
      width: '100%',
      height: 1,
      backgroundColor: '#f0f0f0',
    },
    searchInput: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
    },
  });