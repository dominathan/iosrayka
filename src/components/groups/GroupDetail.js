import React, { Component } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import { joinPublicGroup, joinPrivateGroup } from '../../services/apiActions';

export class GroupDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      groupJoined: false,
      showActivityIndicator: false,
    };

    this.joinGroup = this.joinGroup.bind(this);
  }

  joinGroup(group) {
    if(group.publicGroup || !group.private) {
      //join public
      this.setState({showActivityIndicator: true});
      joinPublicGroup(group)
        .then((success) => {
          this.setState({showActivityIndicator: false, groupJoined: true});
        })
        .catch((err) => {
          this.setState({showActivityIndicator: false});
         })

    } else {
      // join private
      this.setState({showActivityIndicator: true});
      joinPrivateGroup(group)
        .then(success => {
          this.setState({showActivityIndicator: false, groupJoined: true});
        })
        .catch(err => {
          this.setState({showActivityIndicator: false});
        });
    }
  }

  render() {
    const { group } = this.props;
    const { groupJoined, showActivityIndicator } = this.state;
    return (
      <View style={styles.groupItem}>
        { group.myGroup && <Icon name='group' color='#8E8E8E' /> }
        { group.publicGroup  && <Icon name='lock-open' color='#8E8E8E' />}
        { group.privateGroup && <Icon name='lock' color='#8E8E8E' />}

        <View style={styles.textContainer}>
          <TouchableOpacity onPress={() => Actions.groupProfile({group: group})}>
            <Text style={styles.text}>
              {`${group.name}`}
            </Text>
            <Text style={styles.memberCount}>
              {group.memberCount && `${group.memberCount} Members` }
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonStyles}>
            {
              group.publicGroup && !showActivityIndicator && !groupJoined && <Button
                buttonStyle={styles.acceptJoinGroupRequestButton}
                title="JOIN"
                icon={{name: 'add', color: '#4296CC'}}
                backgroundColor='#FFF'
                color='#4296CC'
                borderRadius={1}
                onPress={() => this.joinGroup(group)}
              />
            }
            {
              showActivityIndicator && !groupJoined && <ActivityIndicator
                animating={showActivityIndicator}
                size="large"
              />
            }
            {
              group.publicGroup || group.privateGroup && !showActivityIndicator && groupJoined && <Icon style={styles.icon} name='check-circle' color="green" />
            }
            {
              group.privateGroup && !showActivityIndicator && !groupJoined && <Button
                buttonStyle={styles.acceptJoinGroupRequestButton}
                title="REQUEST"
                icon={{name: 'add', color: '#4296CC'}}
                backgroundColor='#FFF'
                color='#4296CC'
                borderRadius={1}
                onPress={() => this.joinGroup(group)}
              />
            }
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  groupItem: {
    height: 45,
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 7,
    marginBottom: 5,
    alignItems: 'stretch',
    justifyContent: 'space-between'
  },
  textContainer: {
    flex: 1,
    marginLeft: 5,
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'flex-start'
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4296CC',
    fontWeight: '500'
  },
  memberCount: {
    color: '#8D8F90',
    fontSize: 12,
    paddingLeft: 10
  },
  acceptJoinGroupRequestButton: {
    borderWidth: 1,
    borderColor: '#4296CC',
    alignSelf: 'flex-end'
  },
  acceptJoinPlus: {
    color: '#4296CC',
    backgroundColor: '#4296CC'
  },
  buttonStyles: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    flex: 1
  },
  icon: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    flex: 1
  }
});
