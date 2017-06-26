import React, { Component } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements'
import { searchForFriends } from '../../services/apiActions';

const DEBOUNCE_TIME = 100;

export class FriendSearch extends Component {
  static defaultProps = {
    placeholder: 'Enter first name, last name, or email',
    placeholderTextColor: '#A8A8A8',
    autoFocus: false,
  }
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      searching: false,
      lastApiCall: null,
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.canCallApi = this.canCallApi.bind(this);
  }

  handleTextChange(text) {
    this.setState({
      text,
      lastApiCall: new Date()
    });
    if ( this.canCallApi() ) {
      this.searchForFriendsToAdd(text);
    }
  }

  canCallApi() {
    return !this.state.lastApiCall  || new Date() - this.state.lastApiCall > DEBOUNCE_TIME;
  }

  searchForFriendsToAdd(text) {
    let friendFunc = this.props.giveBackFriend
    searchForFriends(`name=${text}`)
      .then((data) => {
        friendFunc(data)
      })
      .catch(err => console.error('NO SEARACH', err));
  }

  render() {
    return (
      <SearchBar
        lightTheme
        onChangeText={this.handleTextChange}
        placeholder='Enter first name, last name, or email' />
    );
  }
}

const styles = StyleSheet.create({
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

export default FriendSearch;
