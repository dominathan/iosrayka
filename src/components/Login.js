import React, { Component } from "react";
import Expo from "expo";
import { AsyncStorage, WebView, View, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import jwtDecode from "jwt-decode";

import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "../../config/auth0";
import { loginUser } from "../services/apiActions";

const auth0ClientId = "yVWgohF5HglLD5qTqv1zols99eHPYlBK";
const auth0Domain = "https://dominathan.auth0.com";
let redirectUri;

if (Expo.Constants.manifest.xde) {
  // Hi there, dear reader!
  // This value needs to be the tunnel url for your local Expo project.
  // It also needs to be listed in valid callback urls of your Auth0 Client
  // Settings. See the README for more information.
  redirectUri = "exp://qy-j9j.dominathan.iosrayka.exp.direct/+/redirect";
} else {
  redirectUri = `${Expo.Constants.linkingUri}/redirect`;
}

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: `${auth0Domain}/authorize` + this.createQueryString(),
      user: undefined
    };
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    this.parseProfile = this.parseProfile.bind(this);
    this.handleWebError = this.handleWebError.bind(this);
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
  }

  componentDidMount() {
    if (this.props.getIsLoggedIn()) {
      Actions.home({ type: "reset" });
    }
  }

  createQueryString() {
    return this._toQueryString({
      client_id: auth0ClientId,
      response_type: "token",
      scope: "openid name profile email",
      redirect_uri: redirectUri,
      state: redirectUri
    });
  }

  _toQueryString(params) {
    return (
      "?" +
      Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&")
    );
  }

  onNavigationStateChange(navState) {
    if (navState["url"].includes("+/redirect")) {
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
    AsyncStorage.setItem("fullUser", JSON.stringify(decodedToken));
    AsyncStorage.setItem("token", JSON.stringify(encodedToken));
    this.handleLoginSuccess(decodedToken);
  }

  handleLoginSuccess(profile) {
    loginUser({ user: this.parseProfile(profile) })
      .then(res => {
        AsyncStorage.setItem("user", JSON.stringify(res.user));
        this.props.setIsLoggedIn(true);
        if (res.first_time) {
          return Actions.onboarding({ type: "reset" });
        }
        Actions.home({ type: "reset" });
      })
      .catch(err => {
        console.log("FUCK BALLS", err);
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

  handleWebError() {
    console.log("HANDLE WEB ERROR");
  }

  handleError(e) {
    console.log("ERRROR", e);
    if (e === "WebKitErrorDomain") {
      return;
    }
  }

  render() {
    const { url } = this.state;
    return (
      <View style={styles.container}>
        {url &&
          <WebView
            source={{ uri: url }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onNavigationStateChange={this.onNavigationStateChange}
            onError={this.handleWebError}
            renderError={this.handleError}
          />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
