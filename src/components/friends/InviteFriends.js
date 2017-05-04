import React, { Component } from 'react';
import Expo from 'expo';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Grid, Col, Row } from 'react-native-elements';

export class InviteFriends extends Component {

  constructor(props) {
    super(props);
    this.state = {
      contacts: []
    };
  }

  componentWillMount() {
  }

  async getContacts() {
    const permission = await Expo.Permissions.askAsync(Expo.Permissions.CONTACTS);
    if (permission.status !== 'granted') {
      // Permission was denied...
      return;
    }

    const contacts = await Expo.Contacts.getContactsAsync({
      fields: [
        Expo.Contacts.PHONE_NUMBERS,
        Expo.Contacts.EMAILS,
      ],
      pageSize: 300,
      pageOffset: 0,
    });
    console.log("MY CONTACTS", contacts)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> Get your friends on Rayka </Text>
        <Text style={styles.subtitle}> Looking for travel tips from friends? Make sure they join you</Text>
        <Button
          raised
          title="Invite From Contacts"
          backgroundColor='#3c95cd'
          color="#FFF"
          borderRadius={30}
          large={true}
          onPress={this.getContacts}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 62,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'rgb(230,230,230)',
    alignItems: 'center',

  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: '3%'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '10%',
    padding: 20,
    color: 'gray'
  }
});
