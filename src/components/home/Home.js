// https://github.com/FaridSafi/react-native-google-places-autocomplete
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ListView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import MapView from 'react-native-maps';
import { Icon, Grid, Row } from 'react-native-elements';

import { getPlaces, getFeed, getFriendFeed, getExpertFeed, getFilterPlaces, getExpertPlaces, getFriendPlaces } from '../../services/apiActions';
import { Feed } from '../feed/Feed';
import { Map } from '../map/Map';
import { PlaceList } from '../places/PlaceList';
import { HomeSearch } from './HomeSearch';
import FeedButtons from './FeedButtons';
import Filter from '../places/Filter';

const DEBOUNCE_TIME = 500;

export class Home extends Component {
  constructor(props) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    super(props);

    this.state = {
      markers: [],
      places: ds.cloneWithRows([]),
      feed: null,
      feedReady: false,
      selectedFilter: 'feed',
      selectedHeader: 'global',
      lastApiCall: null,
      region: new MapView.AnimatedRegion({
        latitude: 32.8039917,
        longitude: -79.9525327,
        latitudeDelta: 0.00922*1.5,
        longitudeDelta: 0.00421*1.5
      }),
      text: '',
      watchID: null,
    };
    this.onRegionChange = this.onRegionChange.bind(this);
    this.getHomePlaces = this.getHomePlaces.bind(this);
    this.navigateToAddPlace = this.navigateToAddPlace.bind(this);
    this.filterFriends = this.filterFriends.bind(this);
    this.filterExperts = this.filterExperts.bind(this);
    this.globalFilter = this.globalFilter.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleGlobal = this.handleGlobal.bind(this);
    this.handleExpert = this.handleExpert.bind(this);
    this.handleFriends = this.handleFriends.bind(this);
    this.canCallApi = this.canCallApi.bind(this);
    this.selectedFilterChange = this.selectedFilterChange.bind(this);
    this.filterPlacesFromFeed = this.filterPlacesFromFeed.bind(this);
    this.updatePlaceAndFeedFromSearch = this.updatePlaceAndFeedFromSearch.bind(this);
  }

  componentDidMount(props) {
    this.watchID = navigator.geolocation.watchPosition((position) => {
      let region = new MapView.AnimatedRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922*1.5,
          longitudeDelta: 0.00421*1.5
      })
      this.state.region = region;
      this.handleGlobal();
    });
    this.globalFilter();
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

  handleGlobal() {
    this.setState({selectedHeader: 'global'})
    this.getHomePlaces();
  }

  handleExpert() {
    this.setState({selectedHeader: 'expert'})
    this.filterExperts();
  }

  handleFriends() {
    this.setState({selectedHeader: 'friends'})
    this.filterFriends();
  }

  getHomePlaces() {
    this.setState({
      lastApiCall: new Date()
    })
    const latitude = this.state.region.latitude._value;
    const longitude = this.state.region.longitude._value;
    const queryString = `lat=${latitude}&lng=${longitude}&distance=20`
    getPlaces(queryString)
      .then((data) => {
        this.setState({
          markers: data,
          places: this.state.places.cloneWithRows(data)
        });
      })
      .catch((err) => console.log('fuck balls: ', err));
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.state.watchID);
  }

  onRegionChange(region) {
    this.state.region.setValue(region);
    if ( this.canCallApi() ) {
      this.getHomePlaces();
    }
  }

  canCallApi() {
    return !this.state.lastApiCall  || new Date() - this.state.lastApiCall > DEBOUNCE_TIME;
  }

  navigateToAddPlace() {
    Actions.googlePlaces({region: this.state.region});
  }

  selectedFilterChange(val) {
    this.setState({
      selectedFilter: val
    });
    if(val === 'feed') {
      this.globalFilter();
    }
  }

  filterPlacesFromFeed(data) {
    return data.reduce((acc,feed,idx,self) => {
      if(!acc.some((elem) => elem.id === feed.place.id)) {
        acc.push(feed.place);
      }
      return acc
    },[])
  }

  handleFilter(type) {
    const latitude = this.state.region.latitude._value;
    const longitude = this.state.region.longitude._value;
    const queryString = `lat=${latitude}&lng=${longitude}&distance=20&type=${type.name}`
    getFilterPlaces(queryString)
    .then(data => {
      this.setState({markers: data, selectedFilter: 'feed'})
    })
    .catch(err => console.log("ERR FILTER", data))
  }

  globalFilter() {
    this.setState({ feedReady: false });
    // const latitude = this.state.region.latitude._value;
    // const longitude = this.state.region.longitude._value;
    // const queryString = `lat=${latitude}&lng=${longitude}&distance=20`
    getFeed()
      .then((data) => {
        if(data.errors) { Actions.login(); return }
        this.setState({
          feed: data || [],
          feedReady: true
        });
      })
      .catch((err) => console.error('NOO FEED', err));
  }

  filterFriends() {
    this.setState({ feedReady: false });
    getFriendFeed()
      .then((data) => {
        this.setState({
          feed: data || [],
          feedReady: true
        });
      })
      .catch((err) => console.error('NOO FEED', err));
    getFriendPlaces()
      .then((data) => {
          this.setState({
            markers: data,
            places: this.state.places.cloneWithRows(data)
          });
        })
        .catch((err) => console.log('fuck balls: ', err));
  }

  filterExperts() {
    this.setState({ feedReady: false });
    getExpertFeed()
      .then((data) => {
        this.setState({
          feed: data || [],
          feedReady: true
        });
      })
      .catch((err) => console.error('NOO FEED', err));

    getExpertPlaces()
      .then((data) => {
          this.setState({
            markers: data,
            places: this.state.places.cloneWithRows(data)
          });
        })
        .catch((err) => console.log('fuck balls: ', err));
  }

  updatePlaceAndFeedFromSearch(data) {
    this.setState({
      markers: data,
      places: this.state.places.cloneWithRows(data)
    })
    const updatedFeed = [].concat(...data.map(elm => elm.feed))
    this.setState({
      feed: updatedFeed
    })
  }

  render() {
    const { feedReady, region, feed, markers, selectedFilter, places, selectedHeader } = this.state;
    return (
      <View style={styles.container}>
        {region && <Map onRegionChange={this.onRegionChange} region={region} markers={markers}/>}

        <View style={styles.publicPrivateContainer}>
          <TouchableOpacity style={styles.privatePress} onPress={() => this.selectedFilterChange('feed')}>
            <Text style={this.state.selectedFilter === 'feed' ? styles.selectedFilter : styles.filters}>FEED</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.privatePress} onPress={() => this.selectedFilterChange('top')}>
            <Text style={this.state.selectedFilter === 'top' ? styles.selectedFilter : styles.filters}>TOP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.privatePress} onPress={() => this.selectedFilterChange('search')}>
            <Text style={this.state.selectedFilter === 'search' ? styles.selectedFilter : styles.filters}>SEARCH</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => this.selectedFilterChange('filter')}>
            <Text style={this.state.selectedFilter === 'filter' ? styles.selectedFilterButton : styles.filterButtonText}>FILTER</Text>
          </TouchableOpacity>
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
        <View style={styles.feed}>
          {feedReady && selectedFilter === 'feed' && <Feed showButtons={true} feed={feed} />}
          {feedReady && selectedFilter === 'top' && <PlaceList places={places} />}
          {feedReady && selectedFilter === 'search' && <HomeSearch updatePlaceAndFeedFromSearch={this.updatePlaceAndFeedFromSearch}/>}
          {feedReady && selectedFilter === 'filter' && <Filter onPress={this.handleFilter} />}
        </View>
        <View style={styles.feedButtons}>
          <FeedButtons handleGlobal={this.handleGlobal} handleExpert={this.handleExpert} handleFriends={this.handleFriends} selectedHeader={selectedHeader}/>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  map: {
    flex: 1,
  },
  addPlaceButton: {
    position: 'absolute',
    bottom: '15%',
    right: '5%',
    zIndex: 100
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
  selectedFilterButton: {
    color: '#4296CC',
    borderBottomWidth: 1,
    borderBottomColor: '#4296CC',
    marginLeft: 25,
  },
  filterButton: {
    alignSelf: 'center',
    position: 'absolute',
    right: 15,
    top: 12
  },
  filterButtonText: {
    color: '#8D8F90',
  },
  feed: {
    height: '43%'
  },
  feedButtons: {
    height: 60
  },
  search: {
    flex: 1,
    marginTop: 60,
  }
});
