import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Linking, AsyncStorage } from 'react-native';
import App from './src/App';
import jwtDecode from 'jwt-decode';

class Rayka extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      user: null,
      isLoggedIn: false
    }
  }

  componentDidMount() {
    this.handleUser(this.props['exp']['initialUri']);
  }

  removeBrowser() {
    Linking.addEventListener('url', () => Expo.WebBrowser.dismissBrowser());
  }

  handleUser(redirectUri) {
    let queryString, responseObj, encodedToken, decodedToken;
    if (redirectUri && redirectUri.includes('redirect')) {
      this.removeBrowser();
      queryString = redirectUri.split('#')[1];
      responseObj = queryString.split('&').reduce((map, pair) => {
        const [key, value] = pair.split('=');
        map[key] = value; // eslint-disable-line
        return map;
      }, {});
      encodedToken = responseObj.id_token;
      decodedToken = jwtDecode(encodedToken)
      this.setState({user: decodedToken, isLoggedIn: true});
      AsyncStorage.setItem('user', JSON.stringify(decodedToken))
      AsyncStorage.setItem('token', JSON.stringify(encodedToken), () => {
      })
    } else {
      return false
    }
  }

  // handleLoginSuccess(profile) {
  //   loginUser({ user: this.parseProfile(profile) })
  //     .then(res => {
  //       AsyncStorage.setItem('user', JSON.stringify(res));
  //       this.props.setIsLoggedIn(true);
  //       if (res.first_time) {
  //         return Actions.onboarding({ type: 'reset'});
  //       }
  //       Actions.home({ type: 'reset' });
  //     })
  //     .catch((err) => {
  //       console.log('FUCK BALLS', err);
  //     });
  // }
  //
  // parseProfile(profile) {
  //   return {
  //     first_name: profile.extraInfo.given_name,
  //     last_name: profile.extraInfo.family_name,
  //     birthday: profile.extraInfo.birthday,
  //     photo_url: profile.extraInfo.picture_large,
  //     email: profile.email,
  //   };
  // }

  render() {
    const { user, isLoggedIn } = this.state;
    return (
      <App isLoggedIn={isLoggedIn}/>
    );
  }
}

Expo.registerRootComponent(Rayka);
