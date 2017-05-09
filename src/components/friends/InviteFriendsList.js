import React, { Component } from 'react';
import { ListView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export class InviteFriendsList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      contacts: ds.cloneWithRows([])
    }
    this.renderContacts = this.renderContacts.bind(this);
  }

componentWillMount() {
    this.setState({contacts: this.state.contacts.cloneWithRows(this.props.contacts)});
}

  renderContacts(contact) {
    let number = contact.phoneNumbers.filter(number => { return number.label === 'mobile' || number.label === 'home' })[0];
    console.log("NUMBER", number);
    return (
      <View style={styles.listItem}>
        <TouchableOpacity onPress={() => {}}>
            <Text style={styles.name}>{`${contact.firstName} ${contact.lastName}`}</Text>
            {number &&
            <Text style={styles.number}>{number.number}</Text>
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