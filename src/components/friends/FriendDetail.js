import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Icon, CheckBox, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import { addFriend, acceptFriend, declineFriend } from '../../services/apiActions';

export class FriendDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      showActivityIndicator: false
    };

    this.addFriendToDatabase = this.addFriendToDatabase.bind(this);
    this.denyFriendRequest = this.denyFriendRequest.bind(this);
    this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
    this.addToGroup = this.addToGroup.bind(this);
  }

  addFriendToDatabase(friend) {
    addFriend(friend)
      .then((resp) => console.log('ADDED FRIEND', resp))
      .catch((err) => console.error('NO ADD FRIEND', err));
  }

  goToProfile(friend) {
    Actions.profile({person: friend});
  }

  acceptFriendRequest(friend) {
    console.log("ACCEPT FRIEND", friend)
    acceptFriend(friend)
      .then((yay) => console.log("ACCEPTED", yay))
      .catch(err => console.log('nOOOOO ', err))
  }

  denyFriendRequest(friend) {
    console.log("DENIED", friend)
    declineFriend(friend)
      .then((yay) => console.log("DECLINE", yay))
      .catch(err => console.log('nOOOOO ', err))
  }

  renderCheckBox(friend) {
    return (
      <View style={styles.checkboxContainer}>
        <CheckBox
          checked={this.state.checked}
          onPress={ _ => {
            friend.invited = !this.state.checked
            this.setState({
              checked: !this.state.checked
            })
          }}
        />
      </View>
    );
  }

  addToGroup(friend) {
    return (
      <View style={styles.checkboxContainer}>
        <CheckBox
          center
          checked={this.state.checked}
          onPress={ _ => {
            friend.invited = !this.state.checked
            this.setState({
              checked: !this.state.checked
            })
            console.log("ON CHECK", friend)
          }}
        />
      </View>
    );
  }

  render() {
    const friend = this.props.friend;
    return (
      <View style={styles.friendItem}>
        <Image source={{ uri: friend.photo_url || null }} style={styles.photo} />
        <View style={styles.textContainer}>
          <TouchableOpacity onPress={() => this.goToProfile(friend)}>
            <Text style={styles.text}>
              {`${friend.first_name} ${friend.last_name}`}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.addFriend}>
            {
              friend.search &&
                <Button
                  buttonStyle={styles.acceptJoinGroupRequestButton}
                  title="Add"
                  icon={{name: 'add', color: '#4296CC'}}
                  backgroundColor='#FFF'
                  color='#4296CC'
                  borderRadius={1}
                />
            }
          </View>


          {
            friend.pending &&
            <View style={styles.acceptFriend}>
              <Icon
                containerStyle={styles.iconStyle}
                name='cancel'
                color='red'
                onPress={() => this.denyFriendRequest(friend)} />
              <Icon
                containerStyle={styles.iconStyle}
                name='add'
                color="#4296CC"
                onPress={() => this.acceptFriendRequest(friend)} />
            </View>
          }

          { this.props.isGroup && this.renderCheckBox(friend) }
          { friend.isGroup && this.addToGroup(friend) }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  friendItem: {
    height: 45,
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 7,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    alignItems: 'flex-start'
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  textContainer: {
    marginLeft: 5,
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'flex-start'
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4296CC',
    fontWeight: '500'
  },
  checkboxContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    justifyContent: 'flex-start',
    flex: 1,
    marginRight: 20
  },
  acceptFriend: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  acceptJoinGroupRequestButton: {
    borderWidth: 1,
    borderColor: '#4296CC',
    alignSelf: 'flex-end',
    flex: 1
  },
  acceptJoinPlus: {
    color: '#4296CC',
    backgroundColor: '#4296CC',
    alignSelf: 'flex-end',
    flex: 1
  },
  addFriend: {
    alignSelf: 'flex-end',
    flexDirection: 'row'
  },
  iconStyle: {
    marginRight: 10
  }
});
