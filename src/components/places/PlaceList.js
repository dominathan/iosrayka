import React, { Component } from 'react';
import { ScrollView, ListView, View, StyleSheet, RefreshControl } from 'react-native';
import { PlaceDetail } from './PlaceDetail';

export class PlaceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
    this.renderPlaces = this.renderPlaces.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    this.setState({
        refreshing: true
    });
    this.props.refreshPlaces()
      .then(() => {
        this.setState({
          refreshing: false
        });
      });
  }

  renderPlaces(place) {
    return (
      <PlaceDetail place={place} />
    );
  }

  render() {
    return (
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
            title="Update Data"
          />
        }
        dataSource={this.props.places}
        enableEmptySections={true}
        renderRow={this.renderPlaces}
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
      />
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
