import React, {Component} from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Icon, Grid, Row, Col, Button } from 'react-native-elements';

export default class FriendsButtons extends Component{
  constructor(props) {
    super(props)
  }

  changeTab(selectedTab) {
    this.setState({selectedTab})
  }

  render() {
    const { selectedTab } = this.props;
    return (
      <Grid style={styles.titleGroupStyle}>
        <Row>
          <Col>
            <TouchableOpacity style={selectedTab === 'friends' ? styles.selectedIconContainer : styles.iconStyleGlobe} onPress={this.props.getFriends} >
              <Icon containerStyle={styles.iconContainerStyles} name="people" color={selectedTab === 'friends' ? '#3c95cd': "#FFF"}/>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity style={selectedTab === 'requests' ? styles.selectedIconContainer : styles.iconStyleFriends} onPress={this.props.getRequestedFriendsList} >
              <Icon containerStyle={styles.iconContainerStyles} name="person-add" color={selectedTab === 'requests' ? '#3c95cd': "#FFF"}/>
            </TouchableOpacity>
          </Col>
        </Row>
      </Grid>
    );
  }
};

const styles = StyleSheet.create({
  titleGroupStyle: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#4296CC',
  },
  iconStyleGlobe: {
    height: '100%',
    paddingTop: 5,
    borderRightColor: "#FFF",
    borderRightWidth: 2
  },
  iconStyleFriends: {
    height: '100%',
    paddingTop: 5,
  },
  selectedIconContainer: {
    height: '100%',
    paddingTop: 5,
    backgroundColor: '#FFF',
  }
});
