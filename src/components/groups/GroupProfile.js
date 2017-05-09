// https://github.com/FaridSafi/react-native-google-places-autocomplete
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ListView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import MapView from 'react-native-maps';
import { Icon } from 'react-native-elements';

import { getGroupPlaces } from '../../services/apiActions';
import { Feed } from '../feed/Feed';
import { Map } from '../map/Map';
import { PlaceList } from '../places/PlaceList';

export class GroupProfile extends Component {

  constructor(props) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    super(props);
    this.state = {
      markers: [],
      feed: [],
      places: ds.cloneWithRows([]),
      feedReady: false,
      selectedFilter: 'feed',
      region: new MapView.AnimatedRegion({
        latitude: props.group.lat || 32.8039917,
        longitude: props.group.lng || -79.9525327,
        latitudeDelta: 0.00922*6.5,
        longitudeDelta: 0.00421*6.5
      }),
      watchID: null,
      lastCall: null
    };
    this.navigateToAddPlace = this.navigateToAddPlace.bind(this);
    this.getGroupPlaces = this.getGroupPlaces.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.new_place) {
      let updatedMarkers = this.state.markers;
      let updatedFeed = this.state.feed;
      updatedFeed.unshift(nextProps.new_place);
      updatedMarkers.unshift(nextProps.new_marker);
      this.setState({
        feed: updatedFeed,
        markers: updatedMarkers
      });
    }
  }

  componentDidMount() {
    this.getGroupPlaces(this.props.group.name);
  }

  getGroupPlaces(groupName) {
    getGroupPlaces(`groupName=${groupName}`)
      .then((data) => {
        this.setState({
          feed: data.feed,
          users: data.users,
          feedReady: true,
          markers: data.places,
          places: this.state.places.cloneWithRows(data.places)
        })
      })
      .catch((err) => console.log("I AM A FAILURE", err))
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.state.watchID);
  }

  navigateToAddPlace() {
    Actions.googlePlaces({region: this.state.region, group: this.props.group});
  }

  selectedFilterChange(val) {
    this.setState({
      selectedFilter: val
    });
  }

  render() {
    const { selectedFilter, feedReady, feed, markers, places, region } = this.state;
    return (
      <View style={styles.container}>
        {region && <Map region={region} markers={markers}/>}

        <View style={styles.publicPrivateContainer}>
          <TouchableOpacity style={styles.privatePress} onPress={() => this.selectedFilterChange('feed')}>
            <Text style={this.state.selectedFilter === 'feed' ? styles.selectedFilter : styles.filters}>FEED</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.privatePress} onPress={() => this.selectedFilterChange('top')}>
            <Text style={this.state.selectedFilter === 'top' ? styles.selectedFilter : styles.filters}>TOP</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.feed}>
          {feedReady && selectedFilter === 'feed' && <Feed feed={feed} />}
          {feedReady && selectedFilter === 'top' && <PlaceList places={places} />}
        </View>
        <TouchableOpacity style={styles.addPlaceButton}>
          <Icon
            raised
            name='add'
            color='#FFF'
            containerStyle={{ backgroundColor: '#4296CC' }}
            onPress={this.navigateToAddPlace}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  addPlaceButton: {
    position: 'absolute',
    bottom: 10,
    right: 12
  },
  publicPrivateContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 45,
    borderBottomWidth: 0.4,
    borderBottomColor: '#8D8F90',
  },
  filters: {
    marginRight: 10,
    marginLeft: 25,
    alignSelf: 'center',
    color: '#8D8F90',
    paddingTop: 12
  },
  selectedFilter: {
    color: '#4296CC',
    borderBottomWidth: 1,
    borderBottomColor: '#4296CC',
    paddingTop: 12,
    marginRight: 10,
    marginLeft: 25,
  },
  feed: {
    height: '48%'
  }
});
