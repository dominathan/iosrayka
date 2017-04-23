// https://github.com/FaridSafi/react-native-google-places-autocomplete
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Icon } from 'react-native-elements';
import MapView from 'react-native-maps';

import { getPlaces } from '../../services/apiActions';

export class Map extends Component {

  constructor(props) {
    super(props);
    this.loadMarkers = this.loadMarkers.bind(this);
  }

  componentWillMount() {
  }

  loadMarkers() {
    return this.props.markers.map((place) => {
      return {
        key: place.id,
        coordinate: {
          latitude: place.lat,
          longitude: place.lng
        },
        title: place.name
      };
    }).map((marker) => {
      return (
        <MapView.Marker coordinate={marker.coordinate} key={marker.key} title={marker.title}>
          <Icon name="location-on" color="red" key={marker.key} />
          <MapView.Callout style={styles.callout}>
            <Text style={styles.calloutText}>{marker.title}</Text>
          </MapView.Callout>
        </MapView.Marker>
      );
    });
  }

  render() {
    const startingPoints = this.props.markers.length > 0 ? this.loadMarkers() : null;
    const {Region, gpsAccuracy} = this.props;
    return (
      <MapView.Animated
        style={{ height: 300, alignSelf: 'stretch' }}
        onRegionChange={this.props.onRegionChange}
        region={this.props.region}
      >
        { startingPoints }
      </MapView.Animated>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  callout: {
    width: 100,
    height: 25,
  },
  calloutText: {
    fontSize: 12
  }
});
