// https://github.com/FaridSafi/react-native-google-places-autocomplete
import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import { Icon } from "react-native-elements";
import MapView from "react-native-maps";

export class Map extends Component {
  constructor(props) {
    super(props);
    this.loadMarkers = this.loadMarkers.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.loadMarkers();
  }

  loadMarkers() {
    const { markers } = this.props;
    if (markers && markers.length) {
      return this.props.markers
        .map(place => {
          return {
            place: place,
            key: place.id + Math.random(),
            coordinate: {
              latitude: place.lat,
              longitude: place.lng
            },
            title: place.name
          };
        })
        .map(marker => {
          return (
            <MapView.Marker
              coordinate={marker.coordinate}
              key={marker.key}
              title={marker.title}
            >
              <Icon name="location-on" color="red" key={marker.key} />
              <MapView.Callout style={styles.callout}>
                  <Text onPress={() => { Actions.placeProfile({place: marker.place}) }}style={styles.calloutText}>{marker.title}</Text>
              </MapView.Callout>
            </MapView.Marker>
          );
        });
    }
  }

  render() {
    const startingPoints = this.props.markers.length > 0
      ? this.loadMarkers()
      : null;
    const { Region, gpsAccuracy } = this.props;
    console.log("Region from maps: ", this.props.region)
    return (
      <MapView.Animated
        style={{ height: 300, alignSelf: "stretch" }}
        onRegionChangeComplete={this.props.onRegionChangeComplete}
        region={this.props.region}
      >
        {startingPoints}
      </MapView.Animated>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  callout: {
    width: 150,
    height: 25,
    justifyContent: "center",
    alignItems: "center"
  },
  calloutText: {
    fontSize: 16,
    textAlign: "center"
  }
});
