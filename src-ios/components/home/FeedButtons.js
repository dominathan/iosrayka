import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Icon, Grid, Col, Row} from 'react-native-elements';

export default class FeedButtons extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { selectedHeader, handleGlobal, handleFriends, handleExpert } = this.props;
    return (
      <Grid style={styles.titleGroupStyle}>
        <Row>
          <Col>
            <TouchableOpacity style={selectedHeader === 'global' ? styles.selectedIconContainer : styles.iconStyleGlobe} onPress={handleGlobal}>
              <Icon containerStyle={styles.iconContainerStyles} name="public" color={selectedHeader === 'global' ? '#3c95cd': "#FFF"}/>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity style={selectedHeader === 'friends' ? styles.selectedIconContainer : styles.iconStyleFriends} onPress={handleFriends}>
              <Icon containerStyle={styles.iconContainerStyles} name="people" color={selectedHeader === 'friends' ? '#3c95cd': "#FFF"}/>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity style={selectedHeader === 'expert' ? styles.selectedIconContainer : styles.iconStyleExpert} onPress={handleExpert}>
              <Icon containerStyle={styles.iconContainerStyles} type="material-community" name="crown" color={selectedHeader === 'expert' ? '#3c95cd': "#FFF"} />
            </TouchableOpacity>
          </Col>
        </Row>
      </Grid>
    )
  }

}

const styles = StyleSheet.create({
  titleGroupStyle: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#4296CC',
    justifyContent: 'center',
  },
  iconStyleGlobe: {
    height: '100%',
    paddingTop: 5,
    justifyContent: 'center'
  },
  iconStyleFriends: {
    height: '100%',
    paddingTop: 5,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRightColor: "#FFF",
    borderLeftColor: "#FFF",
    justifyContent: 'center'
  },
  iconStyleExpert: {
    height: '100%',
    paddingTop: 5,
    justifyContent: 'center'
  },
  selectedIconContainer: {
    height: '100%',
    backgroundColor: '#FFF',
    paddingTop: 5,
    justifyContent: 'center'
  }
})
