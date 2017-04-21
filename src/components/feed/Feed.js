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

  renderFeed(feed) {
    return (
      <FeedDetail showButtons={this.props.showButtons} feed={feed} />
    );
  }

  render() {
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
  container: {
    flex: 1,
    padding: 4,
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginLeft: 10,
    height: 65
  },
  subtitleView: {
    paddingLeft: 13,
    width: '80%'
  },
  bold: {
    fontWeight: '600'
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  textComment: {
    fontWeight: '100',
    flexWrap: 'wrap',
  },
  likeAndBeen: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: 10
  },
  likeButton: {
    color: 'gray'
  },
  beenButton: {
    color: 'gray',
    marginLeft: 45
  },
  titleStyle: {
    fontWeight: '600',
  },
  unBold: {
    fontWeight: '300'
  },
  avatarStyle: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginLeft: '2%'
  },
  listStyle: {
    flex: 1
  }

});
