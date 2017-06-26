import React, {Component} from 'react';
import { Image, Text, View, TouchableOpacity, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class TabViewHeader extends Component {
  constructor(props) {
    super(props)
    console.log('bo', props)
    this.state = {
      user: props.user || {}
    }
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
  }

  componentDidMount() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    AsyncStorage.getItem('user', (err, user) => {
      if (err) return err;
      console.log('yo', user)
      this.setState({user: JSON.parse(user)})
    });
  }

  shouldComponentUpdate(a,b) {
    return AsyncStorage.getItem('user',(err, user) => {
      console.log('ho', user)
      const parsedUser = JSON.parse(user);
      if(parsedUser && this.state.user && parsedUser.photo_url === this.state.user.photo_url) {
        return false
      } else {
        this.setState({user: parsedUser})
        return true
      }
    })
  }

  goToProfile() {
    this.props.drawer.close();
    Actions.profile({ person: this.state.user, type: 'reset' });
  }

  render() {
    const { user } = this.state
    const { imageViewStyle,
            profileImageStyle,
            textStyle,
            textStyleEmail,
            textViewStyle,
            viewStyle
    } = styles;

    return (
      <TouchableOpacity onPress={() => this.goToProfile()}>
      {!user && <Text> No User To Display</Text>}
      {user &&  <View style={viewStyle}>
            <View style={imageViewStyle}>
                <Image style={profileImageStyle} source={{ uri: user.photo_url }} />
            </View>
            <View style={textViewStyle}>
                <Text style={textStyle}>{user.first_name} {user.last_name}</Text>
                <Text style={textStyleEmail}>{user.email}</Text>
            </View>
        </View>}
      </TouchableOpacity>
    );
  }

};

const styles = {
    imageViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginRight: 15,
        marginLeft: 15
    },
    profileImageStyle: {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    textStyle: {
        fontSize: 16,
        color: '#8D8F90'
    },
    textStyleEmail: {
        fontSize: 12,
        color: '#8D8F90'
    },
    textViewStyle: {
        height: 50,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    viewStyle: {
        backgroundColor: '#333B42',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 20,
        height: 60,
        paddingTop: 15
    }
};
