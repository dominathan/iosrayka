// 1. Import library to help create a comment.
import React, { Component } from 'react';
import Expo from 'expo';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { AsyncStorage, Image, StatusBar, TouchableHighlight, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Icon, Grid, Col, Row} from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';

import { Home } from './components/Home';
import SimpleDrawer from './SimpleDrawer';

// Places
import { GooglePlaces } from './components/places/GooglePlaces';
import { MyPlaces } from './components/places/MyPlaces';
import { PlaceProfile } from './components/places/PlaceProfile';
import { ImageDetail } from './components/feed/ImageDetail';

import { Login } from './components/Login';
import { Onboarding } from './components/onboarding/Onboarding';
import { Friends } from './components/friends/Friends';
import { Notifications } from './components/notifications/Notifications';
import { Settings } from './components/Settings';
import { Help } from './components/Help';
import { Profile } from './components/profile/Profile';
import { ProfileInfo } from './components/profile/ProfileInfo';

// Groups
import { Group } from './components/groups/Group';
import { CreateGroup } from './components/groups/CreateGroup';
import { GroupSearch } from './components/groups/GroupSearch';
import { GroupProfile } from './components/groups/GroupProfile';
import { AddFriends } from './components/groups/AddFriends';

// 2. Create a Component
class App extends Component {
  static propTypes = {}
  static defaultProps = {}
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
    this.state = {
      isLoggedIn: undefined,
      backButton: undefined,
      drawerButton: undefined,
      selectedHeader: 'global'
    };
    this.handleAddFriends = this.handleAddFriends.bind(this);
    this.setIsLoggedIn = this.setIsLoggedIn.bind(this);
    this.getIsLoggedIn = this.getIsLoggedIn.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.renderDrawerButton = this.renderDrawerButton.bind(this);
    this.handleSelectedHeaderChange = this.handleSelectedHeaderChange.bind(this);
    this.handleGlobal = this.handleGlobal.bind(this);
    this.handleExpert = this.handleExpert.bind(this)
    this.handleFriends = this.handleFriends.bind(this)
  }

  // componentDidMount() {
  //   this.setState({isLoggedIn: this.props.isLoggedIn})
  // }

  componentDidMount() {
      AsyncStorage.getItem('token')
      .then(token => {
        if (token) {
          this.setState({ isLoggedIn: true });
        } else {
          this.setState({ isLoggedIn: false });
        }
      });
  }

  renderTitle() {
    const { selectedHeader } = this.state
    return (
      <Grid style={styles.titleGroupStyle}>
        <Row>
          <Col>
            <TouchableOpacity style={selectedHeader === 'global' ? styles.selectedIconContainer : styles.iconStyleGlobe} onPress={() => this.handleGlobal()}>
              <Icon containerStyle={styles.iconContainerStyles} name="public" color={selectedHeader === 'global' ? '#3c95cd': "#FFF"}/>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity style={selectedHeader === 'friends' ? styles.selectedIconContainer : styles.iconStyleFriends} onPress={() => this.handleFriends()}>
              <Icon containerStyle={styles.iconContainerStyles} name="people" color={selectedHeader === 'friends' ? '#3c95cd': "#FFF"}/>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity style={selectedHeader === 'expert' ? styles.selectedIconContainer : styles.iconStyleExpert} onPress={() => this.handleExpert()}>
              <Icon containerStyle={styles.iconContainerStyles} name="whatshot" color={selectedHeader === 'expert' ? '#3c95cd': "#FFF"} />
            </TouchableOpacity>
          </Col>
        </Row>
      </Grid>
    )
  }

  handleGlobal() {
    this.setState({selectedHeader: 'global'})
    Actions.home({selectedHeader: this.state.selectedHeader})
  }

  handleExpert() {
    this.setState({selectedHeader: 'expert'})
    Actions.home({selectedHeader: this.state.selectedHeader})
  }

  handleFriends() {
    this.setState({selectedHeader: 'friends'})
    Actions.home({selectedHeader: this.state.selectedHeader})
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
    return (
      <TouchableOpacity onPress={() => { Actions.get('drawer').ref.toggle()}}>
        <Icon name="menu" color="#FFF" />
      </TouchableOpacity>
    )
  }

  handleSelectedHeaderChange() {
    Actions.refresh({selectedHeader: this.state.selectedHeader})
  }

  render() {
      if (this.state.isLoggedIn === undefined) {
        return (null);
      } else {
        return (
          <Router navigationBarStyle={{ backgroundColor: '#3c95cd', justifyContent: 'flex-start', flex: 1 }} titleStyle={{ color: '#FFF' }} barButtonTextStyle={{ color: "#FFF" }} barButtonIconStyle={{ tintColor: 'rgb(255,255,255)' }} getIsLoggedIn={this.getIsLoggedIn} setIsLoggedIn={this.setIsLoggedIn}>
            <Scene key='drawer' component={SimpleDrawer} >
              <Scene key='main' tabs={false}>
                <Scene renderLeftButton={this.renderDrawerButton} key="home" component={Home} renderRightButton={this.renderTitle} onRight={() => console.log("ANYHTHIGN")} selectedHeader={this.state.selectedHeader} initial />
                <Scene renderLeftButton={this.renderDrawerButton} key="myPlaces" component={MyPlaces} title="Places" />
                <Scene key="googlePlaces" component={GooglePlaces} title="Add a Place" />
                <Scene renderLeftButton={this.renderDrawerButton} key="friends" component={Friends} title="Friends" />
                <Scene renderLeftButton={this.renderDrawerButton} key="notifications" component={Notifications} title="Notifications"  />
                <Scene renderLeftButton={this.renderDrawerButton} key="settings" component={Settings} title="Settings" />
                <Scene renderLeftButton={this.renderDrawerButton} key="help" component={Help} title="Help" />
                <Scene renderLeftButton={this.renderDrawerButton} key="profile" component={Profile} title="Profile" />
                <Scene key="placeProfile" component={PlaceProfile} title="Place" />
                <Scene renderLeftButton={this.renderDrawerButton} key="groups" component={Group} title="Groups" onRight={() => Actions.searchGroup()} rightTitle="Search" titleStyle={{ color: "#FFF" }} />
                <Scene key="createGroup" component={CreateGroup} title="Create a Group" />
                <Scene key='searchGroup' component={GroupSearch} title="Search for Groups" />
                <Scene key='groupProfile' component={GroupProfile} title="Group" onRight={(state) => this.handleAddFriends(state)} rightTitle="+ Friend" />
                <Scene key='addFriends' component={AddFriends} title='Add to Group' />
                <Scene key='onboarding' component={Onboarding} title='Onboarding' hideNavBar />
                <Scene key='profileInfo' component={ProfileInfo} title='Profile Info' />
                <Scene key='imageDetail' component={ImageDetail} title='Image' />
                <Scene key='login' component={Login} title="Login" hideNavBar />

              </Scene>
            </Scene>
          </Router>
        );
      }
  }

}

const styles = StyleSheet.create({
  titleGroupStyle: {
    width: 200,
    borderWidth: 2,
    borderColor: "#FFF",
    position: 'absolute',
    right: 70,
    top: '20%',
    alignSelf: 'flex-start'
  },
  iconStyleGlobe: {
    borderRightWidth: 2.5,
    borderRightColor: '#FFF',
  },
  iconStyleFriends: {
    borderRightWidth: 2.5,
    borderRightColor: '#FFF',
  },
  selectedIconContainer: {
    backgroundColor: '#FFF',
  }
})

export default App;
