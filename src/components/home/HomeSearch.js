import React, { Component } from 'react';
import { StyleSheet, View, ListView } from 'react-native';
import { SearchBar } from 'react-native-elements'

import { PlaceList } from '../places/PlaceList';
import { getFilterPlacesCityOrCountry } from '../../services/apiActions';

const DEBOUNCE_TIME = 100;

export class HomeSearch extends Component {
  static defaultProps = {
    placeholder: 'Enter place name',
    placeholderTextColor: '#A8A8A8',
    autoFocus: false,
  };
  constructor(props) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    super(props);

    this.state = {
      text: '',
      searching: false,
      places: ds.cloneWithRows([]),
      lastApiCall: null,
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.searchForPlace = this.searchForPlace.bind(this);
    this.canCallApi = this.canCallApi.bind(this);
  }

  handleTextChange(text) {
    if ( this.canCallApi() ) {
      this.searchForPlace(text);
    }
    this.setState({ text });
  }

  canCallApi() {
    return !this.state.lastApiCall  || new Date() - this.state.lastApiCall > DEBOUNCE_TIME;
  }

  searchForPlace(text) {
    this.setState({ lastApiCall: new Date() })
    getFilterPlacesCityOrCountry(`city_or_country=${text}`)
      .then(data => {
        this.setState({ places: this.state.places.cloneWithRows(data) })
      })
      .catch(err => console.log("ERRR", err))
  }

  render() {
    const { places } = this.state;

    return (
      <View style={styles.container}>
        <SearchBar
          lightTheme
          onChangeText={this.handleTextChange}
          placeholder='Enter city or country' />

          <PlaceList places={places} />
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
