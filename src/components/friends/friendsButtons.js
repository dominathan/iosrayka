import React, {Component} from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Icon, Grid, Row, Col, Button } from 'react-native-elements';

export default class FriendsButtons extends Component{
  constructor(props) {
    super(props)
  }

  render() {
    const { selectedTab } = this.props;
    return (
      <Grid style={styles.titleGroupStyle}>
        <Row>
          <Col>
            <TouchableOpacity style={selectedTab === 'followers' ? styles.selectedIconContainer : styles.iconStyleGlobe} onPress={this.props.getFollowers} >
              <Text style={selectedTab === 'followers' ? styles.selectedText : styles.text}>Followers</Text>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity style={selectedTab === 'following' ? styles.selectedIconContainer : styles.following} onPress={this.props.getFollowing} >
              <Text style={selectedTab === 'following' ? styles.selectedText : styles.text}>Following</Text>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity style={selectedTab === 'add' ? styles.selectedIconContainer : styles.iconStyleFriends} onPress={this.props.follow} >
              <Text style={selectedTab === 'add' ? styles.selectedText : styles.text}> + Follow</Text>
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
    justifyContent: 'center'
  },
  iconStyleGlobe: {
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  following: {
    borderRightWidth: 1,
    borderRightColor: "#FFF",
    borderLeftWidth: 1,
    borderLeftColor: "#FFF",
    height: '100%',
    justifyContent: 'center'
  },
  iconStyleFriends: {
    height: '100%',
    justifyContent: 'center'
  },
  selectedIconContainer: {
    height: '100%',
    backgroundColor: '#FFF',
    justifyContent: 'center'
  },
  text: {
    color: "#FFF",
    textAlign: 'center'
  },
  selectedText: {
    color: '#4296CC',
    textAlign: 'center'
  }
});
