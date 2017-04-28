import React, { Component } from 'react';
import { TextInput, StyleSheet, View, ListView } from 'react-native';
import { SearchBar } from 'react-native-elements'

import { PlaceList } from '../places/PlaceList';

export class HomeSearch extends Component {
  static defaultProps = {
    placeholder: 'Enter place name',
    placeholderTextColor: '#A8A8A8',
    autoFocus: false,
  }
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      text: '',
      searching: false,
      places: ds.cloneWithRows([]),
    };

    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(text) {
    this.searchForPlace(text);
    this.setState({ text });
  }

  searchForPlace(text) {
    Promise.resolve({ name: 'test' })
        .then((data) => {
            this.setState({
                searching: true,
                places: this.state.places.cloneWithRows(data)
            });
        })
        .catch((err) => console.log("NOOO", err));
  }

  render() {
    const { searching, places } = this.state;

    return (
      <View style={styles.container}>
        <SearchBar
          lightTheme
          onChangeText={this.handleTextChange}
          placeholder='Enter place name' />

          { <PlaceList places={places} /> }

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
