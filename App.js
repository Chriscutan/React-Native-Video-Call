/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  StatusBar,
  StyleSheet,
} from 'react-native';
import Navigation from './src/navigation';

function App() {
  return (
    <>
      <StatusBar
        barStyle='dark-content'
      />

      <Navigation />
    </>
      

  );
}

const styles = StyleSheet.create({
  page: {
    padding: 15,
  },
  contactName: {
    fontSize: 16,
    marginVertical: 10,
  },
  seperator: {
    width: '100%',
    height: 1,
    backgroundColor: '#f0f0f0',
  }
});

export default App;
