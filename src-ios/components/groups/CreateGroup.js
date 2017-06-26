import React, { Component } from 'react';
import {
  ListView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button } from 'react-native-elements'

import { getFriends, createGroup } from '../../services/apiActions';
import { FriendList } from '../friends/FriendList';
import { GooglePlacesAutocomplete } from '../places/GooglePlacesAutocomplete';
import GOOGLE_API_KEY from '../../../config/google';

export class CreateGroup extends Component {

  static defaultProps = {
    placeholder: 'Enter a Group Name',
    placeholderTextColor: '#8D8F90',
    autoFocus: false,
  }

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      text: '',
      loadingFriends: true,
      dataSource: ds.cloneWithRows([]),
      private: false,
      disableCreateButton: false,
      lat: null,
      lng: null,
      city: null
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.createThisGroup = this.createThisGroup.bind(this);
    this.togglePrivate = this.togglePrivate.bind(this);
    this.handleSelectedCity = this.handleSelectedCity.bind(this);
  }

  componentWillMount() {
    this.loadFriends();
  }

  createThisGroup() {
    this.setState({disableCreateButton: true})
    const group = {
      groupName: this.state.text,
      friends: this.state.dataSource._dataBlob.s1.filter((friend) => friend.invited),
      private: this.state.private,
      lat: this.state.lat,
      lng: this.state.lng,
      city: this.state.city
    };
    createGroup(group)
      .then((data) => {
        Actions.groups({type: 'reset'})
      })
      .catch((err) => console.error('NO CREATION', err));
  }

  loadFriends() {
    getFriends()
      .then((friends) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(friends),
          loadingFriends: false,
        });
      })
      .catch((err) => console.error('NO FRIENDS!!!', err));
  }


  handleTextChange(text) {
    this.setState({ text });
  }

  togglePrivate(priv) {
    this.setState({
      private: priv
    })
  }

  handleSelectedCity(place) {
    this.setState({
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      city: place.name
    });
  }

  render() {
    const { dataSource, loadingFriends, disableCreateButton } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.publicPrivateContainer}>
          <TouchableOpacity style={styles.privatePress} onPress={() => this.togglePrivate(false)}>
            <Text style={this.state.private ? styles.pubPriv : styles.pubPrivSelected}>PUBLIC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.privatePress} onPress={() => this.togglePrivate(true)}>
            <Text style={!this.state.private ? styles.pubPriv : styles.pubPrivSelected}>PRIVATE</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.publicPrivateContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={this.handleTextChange}
            value={this.state.text}
            placeholder={this.props.placeholder}
            placeholderTextColor={this.props.placeholderTextColor}
            clearButtonMode='while-editing'
          />
        </View>
        <View style={styles.selectCity}>
          <GooglePlacesAutocomplete
            placeholder='Enter City'
            minLength={3}
            currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
            onPress={(data, details) => { // 'details' is provided when fetchDetails = true
              // console.log("DATA: ", data)
              // console.log("DETAILS: ", details)
            }}
            query={{
             // available options: https://developers.google.com/places/web-service/autocomplete
              key: GOOGLE_API_KEY,
              language: 'en', // language of the results
              types: '(cities)'
            }}
            styles={{
              textInputContainer: {
                backgroundColor: 'rgba(0,0,0,0)',
                borderTopWidth: 0,
                borderBottomWidth: 0.4,
                borderBottomColor: '#8D8F90',
              }
            }}
            handleAddPlace={this.handleSelectedCity}
          />
        </View>
        { !loadingFriends && <FriendList friends={dataSource} isGroup={true} /> }
        <TouchableOpacity onPress={this.createThisGroup} style={styles.createGroup}>
          <Button
            raised
            title="Create!"
            backgroundColor='#4296CC'
            color="#FFF"
            borderRadius={30}
            onPress={this.createThisGroup}
            disabled={disableCreateButton}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  publicPrivateContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 45,
    justifyContent: 'center',
    borderBottomWidth: 0.4,
    borderBottomColor: '#8D8F90',
  },
  pubPriv: {
    marginRight: 25,
    marginLeft: 25,
    alignSelf: 'center'
  },
  pubPrivSelected: {
    color: '#4296CC',
    borderBottomWidth: 1,
    borderBottomColor: '#4296CC',
    alignSelf: 'center',
    marginRight: 25,
    marginLeft: 25,
  },
  createGroup: {
    alignSelf: 'center',
    marginBottom: "4%",
    width: "85%"
  },
  buttonText: {
    alignSelf: 'center',
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  textInput: {
    flex: 1,
    height: 45,
    borderRadius: 5,
    paddingTop: 4.5,
    paddingBottom: 4.5,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 8,
    fontSize: 15,
    alignSelf: 'stretch'
  },
  privatePress: {
    alignSelf: 'center'
  },
  selectCity: {
    flex: 1,
    width: '100%'
  }
});
