import React, { Component } from 'react';
import { ScrollView, ListView, View, StyleSheet } from 'react-native';
import { PlaceDetail } from './PlaceDetail';

export class PlaceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.renderPlaces = this.renderPlaces.bind(this);
  }

  renderPlaces(place) {
    return (
      <PlaceDetail place={place} />
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.props.places}
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
