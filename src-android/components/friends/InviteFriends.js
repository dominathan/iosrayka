import React, { Component } from 'react';
import Contacts from 'react-native-contacts';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Grid, Col, Row } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';


export class InviteFriends extends Component {

  constructor(props) {
    super(props);
    this.state = {
      contacts: []
    };
  }

  getContacts() {
    Contacts.getAll((err, contacts) => {
      if(err) {
        console.log('Error: ', err);
      } else {
        Actions.inviteFriendsList({ contacts: contacts });
      }
    })
  }

  render() {
    return(
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
          onPress={() => this.getContacts()}
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
