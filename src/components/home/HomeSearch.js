import React, { Component } from 'react';
import { TextInput, StyleSheet, View, ListView } from 'react-native';
import { Actions } from 'react-native-router-flux';

import GOOGLE_API_KEY from '../../../config/google';
import { GooglePlacesAutocomplete } from '../places/GooglePlacesAutocomplete';
import { getFilterPlacesCityOrCountry } from '../../services/apiActions';

const DEBOUNCE_TIME = 100;

export class HomeSearch extends Component {
  static defaultProps = {
    placeholder: 'Enter place name',
    placeholderTextColor: '#A8A8A8',
    autoFocus: false,
  }
  constructor(props) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    super(props);

    this.state = {
      text: '',
      searching: false,
      places: ds.cloneWithRows([]),
      lastApiCall: null,
    };

    this.handleAddPlace = this.handleAddPlace.bind(this);
  }

  handleAddPlace(place) {
    Actions.home({location: place.geometry.location, type: 'reset'})
  }

  render() {
    const { searching, places } = this.state;

    return (
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          placeholder='Search for City or Country'
          minLength={2}
          autoFocus
          onPress={(data, details) => { // 'details' is provided when fetchDetails = true
            // console.log("DATA: ", data)
            // console.log("DETAILS: ", details)
          }}
          query={{
           // available options: https://developers.google.com/places/web-service/autocomplete
            key: GOOGLE_API_KEY,
            language: 'en', // language of the results
           types: '(cities)', // default: 'geocode'
          }}
          handleAddPlace={this.handleAddPlace}
        />
      </View>

    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textInput: {
    backgroundColor: '#dee2e8',
    justifyContent: 'center',
    height: 28,
    borderRadius: 5,
    paddingTop: 4.5,
    paddingBottom: 4.5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 7.5,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 15,
    textAlign: 'center'
  },
});
