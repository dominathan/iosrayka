import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking,
  TouchableHighlight,
  AsyncStorage
} from "react-native";
import Button from "../Button";
import { Actions } from "react-native-router-flux";


export class PrivacyPolicy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readPolicy: false
    }
    this.policyRead = this.policyRead.bind(this);
  }

  policyRead() {
    this.setState({ readPolicy: !this.state.readPolicy });
  }

  render() {
    return(
      <View style={styles.view}>
          <Text>I have read and accept the</Text>
          <TouchableOpacity onPress={()=> Linking.openURL("http://rayka-app.com/privacy-policy/")} >
            <Text  style={styles.policyLink}>Rayka Terms and Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonWrapper}>
            <Button onPress={() => Actions.onboarding({ type: "reset" })} children="Accept" />
          </TouchableOpacity>
        </View>
    );
  }
};

const styles = StyleSheet.create({
  policyLink: {
    textDecorationLine: "underline",
  },
  view: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 40,
    width: 120,
  }
})
