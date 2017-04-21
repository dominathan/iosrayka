// https://github.com/FaridSafi/react-native-google-places-autocomplete
import React, { Component } from 'react';
import Expo from 'expo';
import { AsyncStorage } from 'react-native';
// import Auth0Lock from 'react-native-lock';
import { Actions } from 'react-native-router-flux';

import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../../config/auth0';
import { loginUser } from '../services/apiActions';

const auth0ClientId = 'yVWgohF5HglLD5qTqv1zols99eHPYlBK'
const auth0Domain = 'https://dominathan.auth0.com';
const redirectUri = 'exp://ek-n3k.dominathan.iosrayka.exp.direct/+/redirect';

export class Login extends Component {

  componentDidMount() {
    if (this.props.getIsLoggedIn()) {
      Actions.home({ type: 'reset' });
    } else {
      this._loginWithAuth0()
    }
  }

  _loginWithAuth0 = async () => {
    console.log("SHOW SCREEN")
    const redirectionURL = `${auth0Domain}/authorize` + this._toQueryString({
      client_id: auth0ClientId,
      response_type: 'token',
      scope: 'openid name profile email',
      redirect_uri: redirectUri,
      state: redirectUri,
    });
    Expo.WebBrowser.openBrowserAsync(redirectionURL);
  }

  _toQueryString(params) {
    return '?' + Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }


  render() {
    return (null);
  }
}
