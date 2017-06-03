import React, { Component } from 'react';
import { ListView, View, StyleSheet, RefreshControl } from 'react-native';

import { FeedDetail } from './FeedDetail';

export class Feed extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
        feed: ds.cloneWithRows(props.feed),
        refreshing: false
    };
    this.renderFeed = this.renderFeed.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.setState({
      feed: ds.cloneWithRows(newProps.feed)
    });
  }

  onRefresh() {
    this.setState({
        refreshing: true
    });
    this.props.refreshFeed()
      .then(() => {
        this.setState({
          refreshing: false
        });
      });
  }

  renderFeed(feed) {
    return (
      <FeedDetail showButtons={this.props.showButtons} feed={feed} user={this.props.user}/>
    );
  }

  render() {
    return (
      <View style={styles.listView}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              title="Update data"
            />
          }
          dataSource={this.state.feed}
          renderRow={this.renderFeed}
          enableEmptySections={true}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E'
  }
});
