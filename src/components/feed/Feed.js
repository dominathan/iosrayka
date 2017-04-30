import React, { Component } from 'react';
import { ListView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { List, ListItem } from 'react-native-elements';

import { FeedDetail } from './FeedDetail';


export class Feed extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      feed: ds.cloneWithRows(props.feed)
    };
    this.renderFeed = this.renderFeed.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.setState({
      feed: ds.cloneWithRows(newProps.feed)
    });
  }

  renderFeed(feed) {
    return (
      <FeedDetail showButtons={this.props.showButtons} feed={feed} />
    );
  }

  render() {
    console.log('WE ARE CALLING RENDER IN THE FEED LIST!!!!!!!!!!!!!');
    return (
      <View style={styles.listView}>
        <ListView
           dataSource={this.state.feed}
           renderRow={this.renderFeed}
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
    backgroundColor: '#8E8E8E',
  }

});
