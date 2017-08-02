/* NOTE
Friends has been changed to twitter style following/Followers
Requested friends are your Followers
Pending friends are people you have follower
*/

import React, { Component } from 'react';
import { View, Text, ListView, Image, StyleSheet } from 'react-native';
import { getFriends, acceptFriend, getRequestedFriends, getPendingFriends } from '../../services/apiActions';
import FriendsButtons from './friendsButtons';
import { FriendSearch } from './FriendSearch';
import { FriendList } from './FriendList';

export class Friends extends Component {

  constructor(props) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    super(props);
    this.state = {
      loadingFriends: true,
      dataSource: ds.cloneWithRows([]),
      messages: {
        noFollowers: "You don't have any followers.",
        noFollowing: "You aren't following anyone! Search for people to follow."
      },
      searching: false,
      pendingFriend: false,
      selectedTab: 'followers'
    };
    this.handleFriendSearch = this.handleFriendSearch.bind(this);
    this.getRequestedFriendsList = this.getRequestedFriendsList.bind(this);
    this.loadFriends = this.loadFriends.bind(this);
    this.follow = this.follow.bind(this);
  }

  componentWillMount() {
    this.getRequestedFriendsList();
  }

  loadFriends() {
    this.setState({
      selectedTab: 'following',
      dataSource: this.state.dataSource.cloneWithRows([]),
    })
    getPendingFriends()
      .then((friends) => {
        if(friends.length > 0) {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(friends),
            loadingFriends: false,
            search: false,
          });
        }
      })
      .catch((err) => console.error('NO FRIENDS!!!', err));
  }

  handleFriendSearch(friends) {
    let friendList = friends.map((friend) => {
      friend.search = true;
      return friend;
    })
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(friendList),
      loadingFriends: false,
      search: false
    })
  }

  getRequestedFriendsList() {
    this.setState({
      selectedTab: 'followers',
      dataSource: this.state.dataSource.cloneWithRows([])
    })
    getRequestedFriends()
      .then((followers) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(followers),
          loadingFriends: false,
          search: false,
        });
      })
      .catch(err => console.error('NO SEARACH', err));
  }

  follow() {
    this.setState({
      selectedTab: 'add',
      dataSource: this.state.dataSource.cloneWithRows([])
    })
  }

  render() {
    const { loadingFriends, dataSource, messages, selectedTab } = this.state;

    return (
      <View style={styles.container}>
        { selectedTab === 'add' && <FriendSearch giveBackFriend={this.handleFriendSearch}/> }

        { selectedTab === 'followers'
          && !loadingFriends 
          && dataSource.getRowCount === 0 
          && <Text style={styles.messageText}>{messages.noFollowers}</Text>
        }

        { selectedTab === 'following'
          && !loadingFriends 
          && dataSource.getRowCount === 0 
          && <Text style={styles.messageText}>{messages.noFollowing}</Text>
        }

        { !loadingFriends
          && dataSource.getRowCount() > 0
          && <FriendList friends={dataSource} /> }

        <View style={styles.friendsButtons}>
          <FriendsButtons
            getFollowers={this.getRequestedFriendsList}
            getFollowing={this.loadFriends}
            follow={this.follow}
            selectedTab={selectedTab}/>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 62,
    alignItems: 'stretch',
    justifyContent: 'space-between'
  },
  friendsButtons: {
    height: 40,
    alignSelf: 'flex-end',
  },
  messageText: {
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    justifyContent: 'space-between',
    fontSize: 16,
    fontWeight: 'bold'
  }

});
