import React, { Component } from 'react';
import { AsyncStorage, ListView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { text } from 'react-native-communications';

export class InviteFriendsList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      contacts: ds.cloneWithRows([]),
      message: undefined
    }
    this.renderContacts = this.renderContacts.bind(this);
  }

componentWillMount() {
  AsyncStorage.getItem('user')
    .then(user => {
      let parsedUser = JSON.parse(user);
      console.log("Parsed user: ", parsedUser);
      let name = `${parsedUser.first_name} ${parsedUser.last_name}`;
      this.setState({
        message: `${name} wants you to join them in Rayka! Visit http://rayka-app.com/ to get started.`
      });
    });
  this.setState({contacts: this.state.contacts.cloneWithRows(this.props.contacts)});
}

  renderContacts(contact) {
    console.log("Contact: ", contact);
    let phoneNumber = contact.phoneNumbers.filter(number => { return number.label === 'mobile' || number[0] })[0];
    let message = this.state.message;
    return (
      <View style={styles.listItem}>
        <TouchableOpacity onPress={() => {text(phoneNumber.number, message)}}>
          {contact.givenName && contact.familyName && <Text style={styles.name}>{`${contact.givenName} ${contact.familyName}`}</Text>}
          {contact.givenName && !contact.familyName && <Text style={styles.name}>{`${contact.givenName}`}</Text>}
          {!contact.givenName && contact.familyName && <Text style={styles.name}>{`${contact.familyName}`}</Text>}            {phoneNumber &&
            <Text style={styles.number}>{phoneNumber.number}</Text>
            }
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <ListView
       style={styles.scrollView}
       dataSource={this.state.contacts}
       renderRow={this.renderContacts}
       enableEmptySections={true}
       renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
      />
    );
  }

}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    marginLeft: 15,
    paddingTop: 10,
    paddingBottom: 10
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  scrollView: {
    flex: 1,
    alignSelf: 'stretch',
    marginTop: 75
  },
});
