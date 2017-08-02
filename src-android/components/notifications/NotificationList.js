import React, { Component } from 'react';
import { ScrollView, ListView, View, StyleSheet } from 'react-native';
import { NotificationDetail } from './NotificationDetail';
import { LikeNotificationDetail } from './LikeNotificationDetail'

export class NotificationList extends Component {
  constructor(props) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    super(props);
    this.state = {
      ds: ds.cloneWithRows([])
    };
    this.renderNotifications = this.renderNotifications.bind(this);
  }

  renderNotifications(notification) {
    return (
      <NotificationDetail notification={notification} />
    );
  }

  renderLikeNotification(like) {
    return (
      <LikeNotificationDetail like={like} />
    )
  }

  render() {
    const { groupRequests, likes } = this.props;
    return (
      <View>
        {
          groupRequests.length > 0 && <ListView
            style={styles.scrollView}
            enableEmptySections={true}
            dataSource={this.state.ds.cloneWithRows(groupRequests)}
            renderRow={this.renderNotifications}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            />
        }
        {
          likes.length > 0 && <ListView
           style={styles.scrollView}
           enableEmptySections={true}
           dataSource={this.state.ds.cloneWithRows(likes)}
           renderRow={this.renderLikeNotification}
           renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          />
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  scrollView: {
    height: '100%',
    alignSelf: 'stretch',
  }
});
