// 1. Import library to help create a comment.
import React, { Component } from "react";
import { Scene, Router, Actions } from "react-native-router-flux";
import {
  AsyncStorage,
  StatusBar,
  View,
  StyleSheet,
  TouchableOpacity,
  Text
} from "react-native";
import { Icon } from "react-native-elements";

import { Home } from "./components/home/Home";
import { HomeSearch } from "./components/home/HomeSearch";
import SimpleDrawer from "./SimpleDrawer";

// Places
import { GooglePlaces } from "./components/places/GooglePlaces";
import { MyPlaces } from "./components/places/MyPlaces";
import { PlaceProfile } from "./components/places/PlaceProfile";
import { ImageDetail } from "./components/feed/ImageDetail";
import { CommentBox } from "./components/places/CommentBox";

import { Login } from "./components/Login";
import { Onboarding } from "./components/onboarding/Onboarding";
import { PrivacyPolicy } from "./components/privacyPolicy/PrivacyPolicy";
import { Friends } from "./components/friends/Friends";
import { InviteFriends } from "./components/friends/InviteFriends";
import { InviteFriendsList } from "./components/friends/InviteFriendsList";
import { Notifications } from "./components/notifications/Notifications";
import { Settings } from "./components/Settings";
import { Help } from "./components/Help";
import { Profile } from "./components/profile/Profile";
import { ProfileInfo } from "./components/profile/ProfileInfo";

// Groups
import { Group } from "./components/groups/Group";
import { CreateGroup } from "./components/groups/CreateGroup";
import { GroupSearch } from "./components/groups/GroupSearch";
import { GroupProfile } from "./components/groups/GroupProfile";
import { AddFriends } from "./components/groups/AddFriends";

Text.defaultProps.allowFontScaling = false;

// 2. Create a Component
class App extends Component {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    StatusBar.setBarStyle("light-content");
    this.state = {
      isLoggedIn: undefined,
      backButton: undefined,
      drawerButton: undefined,
      selectedHeader: "global"
    };
    this.handleAddFriends = this.handleAddFriends.bind(this);
    this.setIsLoggedIn = this.setIsLoggedIn.bind(this);
    this.getIsLoggedIn = this.getIsLoggedIn.bind(this);
    this.renderDrawerButton = this.renderDrawerButton.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem("token").then(token => {
      if(token) {
        this.setState({ isLoggedIn: true });
      } else {
        this.setState({ isLoggedIn: false });
      }
    });
  }

  getIsLoggedIn() {
    return this.state.isLoggedIn;
  }

  setIsLoggedIn(val) {
    this.setState({ isLoggedIn: val });
  }

  handleAddFriends(state) {
    Actions.addFriends({ group: state.group });
  }

  renderDrawerButton() {
    return(
      <TouchableOpacity
        onPress={() => {
          Actions.get("drawer").ref.toggle();
        }}
      >
        <Icon name="menu" color="#FFF" />
      </TouchableOpacity>
    );
  }

  render() {
    if(this.state.isLoggedIn === undefined) {
      return null;
    } else {
      return(
        <Router
          navigationBarStyle={{
            backgroundColor: "#3c95cd",
            justifyContent: "flex-start",
            flex: 1
          }}
          titleStyle={{ color: "#FFF" }}
          barButtonTextStyle={{ color: "#FFF" }}
          barButtonIconStyle={{ tintColor: "rgb(255,255,255)" }}
          getIsLoggedIn={this.getIsLoggedIn}
          setIsLoggedIn={this.setIsLoggedIn}
        >
          <Scene key="drawer" component={SimpleDrawer}>
            <Scene key="main" tabs={false}>
              <Scene
                renderLeftButton={this.renderDrawerButton}
                key="home"
                component={Home}
                title="Travel"
              />
              <Scene
                renderLeftButton={this.renderDrawerButton}
                key="myPlaces"
                component={MyPlaces}
                title="Places"
              />
              <Scene
                key="googlePlaces"
                component={GooglePlaces}
                title="Add a Place"
              />
              <Scene
                renderLeftButton={this.renderDrawerButton}
                key="friends"
                component={Friends}
                title="Friends"
              />
              <Scene
                renderLeftButton={this.renderDrawerButton}
                key="notifications"
                component={Notifications}
                title="Notifications"
              />
              <Scene
                renderLeftButton={this.renderDrawerButton}
                key="settings"
                component={Settings}
                title="Settings"
              />
              <Scene
                renderLeftButton={this.renderDrawerButton}
                key="help"
                component={Help}
                title="Help"
              />
              <Scene
                renderLeftButton={this.renderDrawerButton}
                key="profile"
                component={Profile}
                title="Profile"
              />
              <Scene
                renderLeftButton={this.renderDrawerButton}
                key="inviteFriends"
                component={InviteFriends}
                title="Invite Friends"
              />
              <Scene
                key="homeSearch"
                component={HomeSearch}
                title="Search City"
              />
              <Scene
                key="inviteFriendsList"
                component={InviteFriendsList}
                title="Invite Friends"
              />
              <Scene
                key="placeProfile"
                component={PlaceProfile}
                title="Place"
              />
              <Scene
                key="addPlace"
                component={CommentBox}
                title="Add a Place"
              />
              <Scene
                renderLeftButton={this.renderDrawerButton}
                key="groups"
                component={Group}
                title="Home"
                onRight={() => Actions.searchGroup()}
                rightTitle="Search"
                rightButtonTextStyle={{ color: "#FFF" }}
              />
              <Scene
                key="createGroup"
                component={CreateGroup}
                title="Create a Group"
              />
              <Scene
                key="searchGroup"
                component={GroupSearch}
                title="Search for Groups"
              />
              <Scene
                key="addFriends"
                component={AddFriends}
                title="Add to Group"
              />
              <Scene
                key="onboarding"
                component={Onboarding}
                title="Onboarding"
                hideNavBar
              />
              <Scene
                key="privacypolicy"
                component={PrivacyPolicy}
                title="Privacy Policy"
                hideNavBar
              />
              <Scene
                key="profileInfo"
                component={ProfileInfo}
                title="Profile Info"
              />
              <Scene key="imageDetail" component={ImageDetail} title="Image" />
              {!this.state.isLoggedIn && <Scene key="login" component={Login} title="Login" hideNavBar initial />}
              {this.state.isLoggedIn && <Scene key="login" component={Login} title="Login" hideNavBar />}
              {!this.state.isLoggedIn && <Scene
                              renderLeftButton={this.renderDrawerButton}
                              key="groupProfile"
                              component={GroupProfile}
                              title="Group"
                              onRight={state => this.handleAddFriends(state)}
                              rightTitle="+ Friend"
                              rightButtonTextStyle={{ color: "#FFF" }}
                            />}
              {this.state.isLoggedIn && <Scene
                              renderLeftButton={this.renderDrawerButton}
                              key="groupProfile"
                              component={GroupProfile}
                              title="Group"
                              onRight={state => this.handleAddFriends(state)}
                              rightTitle="+ Friend"
                              rightButtonTextStyle={{ color: "#FFF" }}
                              initial
                            />}
            </Scene>
          </Scene>
        </Router>
      );
    }
  }
}

export default App;
