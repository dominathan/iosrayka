import React, { Component } from "react";
import { AsyncStorage, WebView, View, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import jwtDecode from "jwt-decode";
import Auth0Lock from "react-native-lock";

import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "../../config/auth0";
import { loginUser } from "../services/apiActions";

const auth0ClientId = "yVWgohF5HglLD5qTqv1zols99eHPYlBK";
const auth0Domain = "https://dominathan.auth0.com";

const lock = new Auth0Lock({
  clientId: auth0ClientId,
  domain: auth0Domain
});



export class Login extends Component {
  constructor(props) {
    console.log('HELLO trigger')
    super(props);
    this.state = {
      user: undefined
    };
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    this.parseProfile = this.parseProfile.bind(this);
  }

  componentDidMount() {
    // if(this.props.getIsLoggedIn()) {
    //   Actions.home({ type: "reset" });
    // } else {
    this.showLock();
    // }
  }



  onNavigationStateChange(navState) {
    if(navState["url"].includes("+/redirect")) {
      console.log("STATE CHANGE");
      this.handleUser(navState["url"]);
      return;
    }
  }

  handleUser(redirectUri) {
    let queryString, responseObj, encodedToken, decodedToken;
    queryString = redirectUri.split("#")[1];
    responseObj = queryString.split("&").reduce((map, pair) => {
      const [key, value] = pair.split("=");
      map[key] = value;
      return map;
    }, {});
    encodedToken = responseObj.id_token;
    decodedToken = jwtDecode(encodedToken);
    this.setState({ user: decodedToken, isLoggedIn: true });
    AsyncStorage.setItem("user", JSON.stringify(decodedToken));
    AsyncStorage.setItem("fullUser", JSON.stringify(decodedToken));
    AsyncStorage.setItem("token", JSON.stringify(encodedToken));
    this.handleLoginSuccess(decodedToken);
  }

  handleLoginSuccess(profile) {
    loginUser({ user: this.parseProfile(profile) })
      .then(res => {
        AsyncStorage.setItem("user", JSON.stringify(res.user));
        this.props.setIsLoggedIn(true);
        if(res.first_time) {
          return Actions.onboarding({ type: "reset" });
        }
        Actions.home({ type: "reset" });
      })
      .catch(err => {
        console.log("FUCK BALLS", err);
      });
  }

  showLock() {
    console.log("TRIGGER LOCK")
    lock.show({
      closable: false,
      authParams: {
        scope: 'openid email profile'
      },
      mustAcceptTerms: true,
      languageDictionary: {
        signUpTerms: "I agree to the <a href='/terms' target='_new'>terms of service</a> and <a href='/privacy' target='_new'>privacy policy</a>."
      }
    }, ((err, profile, token) => {
      if(err) {
        console.log(err);
        return;
      }
      AsyncStorage.setItem('token', JSON.stringify(token), () => {
        this.handleLoginSuccess(profile);
      });
    }));
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
    return(null)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
