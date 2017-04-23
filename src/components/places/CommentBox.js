import React, { Component, NativeModules } from 'react';
import { TextInput, View, Text, AsyncStorage, TouchableOpacity, CameraRoll, StyleSheet, Keyboard } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { ImagePicker } from 'expo';
import { CameraRollPicker } from './CameraRollPicker';
import { API_BASE } from '../../../config/apiBase';

import { addPlaceToFavorite } from '../../services/apiActions';


export class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      favorite: false,
      showPhoto: false,
      image: null,
      photo: {},
    };
    this.savePlace = this.savePlace.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.togglePhoto = this.togglePhoto.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this);
  }

  savePlace(place) {
    const parsedPlace = {
      name: place.name,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      google_id: place.id,
      google_place_id: place.place_id,
      favorite: this.state.favorite,
      city: place.address_components[3].long_name,
      country: place.address_components[6].long_name,
      data: place
    };
    this.saveChosenPlaceAsFavorite(parsedPlace, this.props.group);
  }

  handleTextChange(text) {
    this.setState({ text });
  }

  pickImage() {
    ImagePicker.launchImageLibraryAsync({})
      .then((response) => {
        this.setState({image: response.uri})
      })
      .catch(error => {
        console.error(error);
      })
  }

  togglePhoto() {
    this.setState({
      showPhoto: !this.state.showPhoto
    });
  }

  toggleFavorite() {
    this.setState({
      favorite: !this.state.favorite
    });
  }

  saveChosenPlaceAsFavorite(place, group) {
    const { favorite, text, photo } = this.state;
    place.group ? Actions.groupProfile({group: group}) : Actions.home({type: 'refresh'});
    Keyboard.dismiss();
    addPlaceToFavorite({ place: place, comment: text, favorite: favorite, group: group })
      .then((res) => {
        if(this.state.image) {
          this.handlePhotoUpload(this.state.image)
        }
      })
      .catch((error) => console.log('Failed Saving Place: ', error));
  }

  render() {
    const { place } = this.props
    const { showPhoto, image } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.placeToAdd}>
          <Text style={styles.placeToAddText}>{place.name}</Text>
          <View style={styles.favoriteContainer}>
            <TouchableOpacity style={styles.addFavorite} onPress={this.toggleFavorite}>
              <Text style={styles.addFavoriteText}>Add as Favorite</Text>
              {
                !this.state.favorite ?
                <Icon
                  name='star-border'
                />
                :
                <Icon name="star"
                  color='yellow'
                />
              }
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={this.togglePhoto} style={styles.addPhotoContainer}>
          <Icon
            name='add-circle-outline'
            color='#4296CC'
          />
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </TouchableOpacity>
        <View style={styles.commentContainer}>
          <TextInput
            style={styles.textStyle}
            placeholder="Write something about this place."
            onChangeText={this.handleTextChange}
            value={this.state.text}
            autoFocus={true}
            multiline={true}
          />
        </View>
        <Button
         raised
         title='Add Place'
         backgroundColor='#4296CC'
         onPress={() => this.savePlace(place)}
         />

         { showPhoto && <CameraRollPicker pickImage={this.pickImage} image={image}/>}

      </View>
    );
  }

  handlePhotoUpload(response) {
    var photo = {
      uri: response,
      type: 'image/jpeg',
      name: 'photo.jpg',
    };
    AsyncStorage.getItem('token', (err, token) => {
     if (err) {
       console.log(' NO TOKEN: ', err);
       return
     }
     const parsedToken = JSON.parse(token);
      var form = new FormData();
      form.append("photo", photo);
      form.append("placename", this.props.place.name)
      fetch(
        `${API_BASE}/places/image`,
        {
          body: form,
          method: "POST",
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token
          }
        })
    })
  }
}

const styles = {
  container: {
    flex: 1,
  },
  placeToAdd: {
    flexDirection: 'row',
    paddingTop: 10,
    height: 40,
    borderBottomWidth: 0.4,
    borderBottomColor: 'gray'
  },
  placeToAddText: {
    marginLeft: 15
  },
  star: {
    position: 'absolute',
    top: 1
  },
  addFavorite: {
    right: 10,
    flexDirection: 'row',
    marginTop: 10
  },
  addFavoriteText: {
    color: '#4296CC',
    marginLeft: 10
  },
  addPhotoContainer: {
    height: 40,
    flexDirection: 'row',
    marginLeft: 15,
  },
  addPhotoText: {
    alignSelf: 'center',
    marginLeft: 10,
    color: '#4296CC'
  },
  textStyle: {
    fontSize: 15,
    margin: 15,
    color: 'black',
    alignSelf: 'stretch',
    height: 200,
    textAlignVertical: 'top'
  },
  commentContainer: {
    height: 200,
    alignItems: 'flex-start',
  },
  favoriteContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 10
  }
};
