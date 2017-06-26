import React, { Component } from 'react';
import { View, Text, StyleSheet, ListView } from 'react-native';

import { getNotifications, getLikes } from '../../services/apiActions'

import { NotificationList } from './NotificationList'

export class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupRequests: [],
      likes: []
    };
  }

  componentDidMount() {
    getNotifications()
      .then(data => {
        this.setState({groupRequests: data.users})
      })
      .catch(err => console.log(err));

    getLikes()
      .then(data => {
        this.setState({likes: data.notifications})
      })
      .catch(err => console.log(err));
  }

  render() {
    const { groupRequests, likes } = this.state
    return (
      <View style={styles.container}>
        <NotificationList groupRequests={groupRequests} likes={likes} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 65,
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
})
