// https://github.com/FaridSafi/react-native-google-places-autocomplete
import React, { Component } from 'react';
import Expo from 'expo';
import { AsyncStorage, WebView,View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../../config/auth0';

const auth0ClientId = 'yVWgohF5HglLD5qTqv1zols99eHPYlBK'
const auth0Domain = 'https://dominathan.auth0.com';
const redirectUri = 'exp://ek-n3k.dominathan.iosrayka.exp.direct/+/redirect';

export class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: `${auth0Domain}/authorize` + this.createQueryString()
    }
  }

  componentDidMount() {
    console.log("IS LOGGED IN", this.props.getIsLoggedIn())
    if (this.props.getIsLoggedIn()) {
      Actions.home({ type: 'reset' });
    }
  }

  createQueryString() {
    return this._toQueryString({
      client_id: auth0ClientId,
      response_type: 'token',
      scope: 'openid name profile email',
      redirect_uri: redirectUri,
      state: redirectUri,
    });
  }

  _toQueryString(params) {
    return '?' + Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  onNavigationStateChange(navState) {
    console.log("HAPPENING", navState)
    if(navState['url'].includes('/+/redirect')) {
      Actions.home({type: 'reset'})
    }
  }

  render() {
    const { url } = this.state;
    return (
      <View style={styles.container}>
        {url && <WebView
          source={{uri: url}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onNavigationStateChange={this.onNavigationStateChange}

        />}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
