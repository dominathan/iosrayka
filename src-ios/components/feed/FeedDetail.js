import React, { Component } from 'react';
import { AsyncStorage, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { List, ListItem, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import { createLike, beenThere } from '../../services/apiActions';

export class FeedDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHeart: props.feed.showHeart,
      showBeenThere: props.feed.showBeenThere,
    }

    this.handleLike = this.handleLike.bind(this);
    this.handleBeenThere = this.handleBeenThere.bind(this);
  }

  handleLike(feed) {
    this.setState({showHeart: true})
    createLike({likee: feed.user.id, place_id: feed.place.id})
      .then(data => console.log("CREATED?", data))
      .catch(err => console.log("ERR CREATE LIKE", err))
  }

  handleBeenThere(feed) {
    this.setState({showBeenThere: true})
    beenThere({ place_id: feed.place.id })
      .then((data) => console.log("I BEEN THERE", data))
      .catch((err) => console.log("NO BEEN", err))
  }

  render() {
    const { feed, user } = this.props;
    const { showHeart, showBeenThere } = this.state;
    if (!user) {
      return (null);
    } else {
      return (
        <ListItem
         roundAvatar
         subtitle={
           <View style={styles.subtitleView}>
            <View style={styles.expertIcon}>
              {feed.user.expert && <Icon color="#4296CC" type="material-community" name="crown" />}
              <Text
                onPress={()=> { Actions.profile({
                  person: feed.user
                })}}
                style={styles.titleStyle}>
                  {feed.user.first_name ? feed.user.first_name + ' ' : feed.user.email + " "}
              </Text>
              <Text style={styles.unBold}>
                added
              </Text>
              <Text
                onPress={()=>{ Actions.placeProfile({
                  place: feed.place
                })}}
                style={styles.titleStyle}>
                  {" " + feed.place.name}
              </Text>
            </View>
            <Text style={styles.textComment}>
              {feed.comment}
            </Text>
            {this.props.showButtons && user && user.id !== feed.user.id && <View style={styles.realSubTitle}>
              <View style={styles.likeAndBeen}>
                { !showHeart && <TouchableOpacity onPress={() => this.handleLike(feed)}><Text style={styles.likeButton}>Like</Text></TouchableOpacity> }
                { !showBeenThere && <TouchableOpacity onPress={() => this.handleBeenThere(feed)}><Text style={styles.beenButton}>Been there</Text></TouchableOpacity> }
              </View>
              <View style={styles.icons}>
                { showHeart && <Icon name="favorite" color="red" /> }
                { showBeenThere && <Icon name="place" color="red"/> }
              </View>
            </View>}
           </View>
         }
       hideChevron={true}
       avatar={{uri: feed.user.photo_url}}
       avatarStyle={styles.avatarStyle} />
      );
    }
  }
}

const styles = StyleSheet.create({
  subtitleView: {
    paddingLeft: 13,
    width: '100%'
  },
  bold: {
    fontWeight: '600'
  },
  textComment: {
    fontWeight: '100',
    flexWrap: 'wrap',
  },
  likeAndBeen: {
    flexDirection: 'row',
    marginTop: 10,
    alignSelf: 'flex-start'
  },
  likeButton: {
    color: 'gray'
  },
  beenButton: {
    color: 'gray',
    marginLeft: 45
  },
  titleStyle: {
    fontWeight: '600',
  },
  expertIcon: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center'
  },
  unBold: {
    fontWeight: '300'
  },
  avatarStyle: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginLeft: '2%'
  },
  icons: {
    flexDirection: 'row',
    alignSelf: 'flex-end'
  },
  realSubTitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
