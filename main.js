import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Linking, AsyncStorage } from 'react-native';
import App from './src/App';

class Rayka extends React.Component {

  render() {
    return (
      <App />
    );
  }
}

Expo.registerRootComponent(Rayka);
