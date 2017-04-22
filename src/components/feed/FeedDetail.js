import React, { Component } from 'react';
import { AsyncStorage, ListView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { List, ListItem, Icon } from 'react-native-elements';

import { createLike, beenThere } from '../../services/apiActions';

export class FeedDetail extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      showHeart: false,
      showBeenThere: false
    }

    this.handleLike = this.handleLike.bind(this);
    this.handleBeenThere = this.handleBeenThere.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
  }

  componentDidMount() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    AsyncStorage.getItem('user', (err, user) => {
      this.setState({user: JSON.parse(user) });
    });
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
    const { feed } = this.props
    const { showHeart, showBeenThere } = this.state;
    if (this.state.user === undefined) {
      return (null);
    } else {
      return (
        <ListItem
         roundAvatar
         subtitle={
           <View style={styles.subtitleView}>
             <Text style={styles.titleStyle}>
               {feed.user.first_name + ' '}
               <Text style={styles.unBold}>
                 added
               </Text>
               {" " + feed.place.name}
             </Text>
             <Text style={styles.textComment}>
               {feed.comment}
             </Text>
             {this.props.showButtons && this.state.user.id !== feed.user.id && <View style={styles.realSubTitle}>
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
