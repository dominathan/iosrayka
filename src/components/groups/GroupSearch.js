import React, { Component } from 'react';
import { TextInput, StyleSheet, View, ListView } from 'react-native';
import { SearchBar } from 'react-native-elements'
import { searchForGroups } from '../../services/apiActions';
import { GroupList } from './GroupList';

const DEBOUNCE_TIME = 100;

export class GroupSearch extends Component {
  static defaultProps = {
    placeholder: 'Enter group name',
    placeholderTextColor: '#A8A8A8',
    autoFocus: false,
  }
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      text: '',
      searching: false,
      groups: ds.cloneWithRows([]),
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
      this.searchForGroupsToAdd(text);
    }
  }

  canCallApi() {
    return !this.state.lastApiCall  || new Date() - this.state.lastApiCall > DEBOUNCE_TIME;
  }

  searchForGroupsToAdd(text) {
    searchForGroups(`search=${text}`)
    .then((data) => {
      if (data.length && data.length > 0) {
        data = data.map(elm => {
          let groupAddition = {};
          if(elm.private) {
            groupAddition.privateGroup = true;
          } else {
            groupAddition.publicGroup = true;
          };
          return Object.assign(elm, groupAddition);
        })
      };

      this.setState({
        searching: true,
        groups: this.state.groups.cloneWithRows(data)
      })
    })
    .catch((err) => console.log("NOOO", err))
  }


  render() {
    const { searching, groups } = this.state;

    return (
      <View style={styles.container}>
        <SearchBar
          lightTheme
          onChangeText={this.handleTextChange}
          placeholder='Enter group name' />

          { <GroupList groups={groups} /> }

      </View>

    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
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
