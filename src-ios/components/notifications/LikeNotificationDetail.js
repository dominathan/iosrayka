import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Icon, Button, ListItem } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import { acceptJoinGroupRequest } from '../../services/apiActions';

export class LikeNotificationDetail extends Component {
  constructor(props) {
    super(props);
    console.log("LIEK PROPS: ", props)
    this.state = {
    };

  }

  render() {
    const { like } = this.props;
    return (
      <ListItem
       roundAvatar
       title={`${like.place.name}`}
       titleStyle={styles.titleStyle}
       subtitle={
         <View style={styles.subtitleView}>
          <Icon name="favorite" color='rgb(200,200,200)' size={18}/>
           <Text style={styles.textComment}>
             {`${like.user.first_name} ${like.user.last_name} liked this`}
           </Text>
         </View>
       }
       subtitleStyle={styles.subtitleStyle}
       hideChevron={true}
       avatar={{uri: like.user.photo_url}}
       avatarStyle={styles.avatar}
     />
    );
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    color: '#3c95cd',
    fontWeight: '600'
  },
  subtitleView: {
    marginLeft: '3%',
    flexDirection: 'row',
  },
  textComment: {
    color: 'rgb(200,200,200)',
    fontWeight: '500',
    marginLeft: '1%'
  },
  avatar: {
    marginLeft: '2%'
  }
});
