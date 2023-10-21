import { StyleSheet, View } from 'react-native'
import React from 'react'
import CallActionBox from '../../components/CallActionBox'

const CallScreen = () => {
  return (
    <View style={styles.page}>

        <View style={styles.cameraPreview}>

            <View></View>

        </View>

        <CallActionBox />
    </View>
  )
}

export default CallScreen

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: "#7b4e80"
    },
    cameraPreview: {
       width: 100,
       height: 150,
       backgroundColor: "#7b4e80",
       position: 'absolute',
       top: 40,
       right: 10,
       borderRadius: 10,
    },
})