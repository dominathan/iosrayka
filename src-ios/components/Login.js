// https://github.com/FaridSafi/react-native-google-places-autocomplete
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import Auth0Lock from 'react-native-lock';
import { Actions } from 'react-native-router-flux';
import jwtDecode from 'jwt-decode';

import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../../config/auth0';
import { loginUser } from '../services/apiActions';


const lock = new Auth0Lock({
  clientId: AUTH0_CLIENT_ID,
  domain: AUTH0_DOMAIN
});

export class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: undefined
    };
    this.showLock = this.showLock.bind(this);
    this.parseProfile = this.parseProfile.bind(this);
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
  }

  componentDidMount() {
    if (this.props.getIsLoggedIn()) {
      Actions.home({ type: 'reset' });
    } else {
      this.showLock();
    }
  }

  showLock() {
    lock.show({
      closable: false,
      authParams: {
        scope: 'openid email profile'
      }
    }, ((err, profile, token) => {
        if (err) {
          console.log(err);
          return;
        }
        let encodedToken = token.idToken;
        let decodedToken = jwtDecode(encodedToken);
        this.setState({user: decodedToken, isLoggedIn: true});
        AsyncStorage.setItem('token', JSON.stringify(token), () => {
          AsyncStorage.setItem('fullUser', JSON.stringify(decodedToken), () => {
            this.handleLoginSuccess(profile);
          });
        });
      })
    );
  }

  handleLoginSuccess(profile) {
    loginUser({ user: this.parseProfile(profile) })
      .then(res => {
        AsyncStorage.setItem('user', JSON.stringify(res.user));
        this.props.setIsLoggedIn(true);
        if (res.first_time) {
          return Actions.onboarding({ type: 'reset'});
        }
        Actions.home({ type: 'reset' });
      })
      .catch((err) => {
        console.log('FUCK BALLS', err);
      });
  }

  parseProfile(profile) {
    let first_name = profile.given_name || profile.name.split(" ")[0];
    let last_name =
      profile.family_name ||
      profile.name.split(" ")[profile.name.split(" ").length - 1];
    let email = profile.email || `${profile.nickname}@instagram.com`;
    return {
      first_name: first_name,
      last_name: last_name,
      birthday: profile.birthday,
      photo_url: profile.picture,
      email: email
    };
  }

  render() {
    return (null);
  }
}