import React, { Component, NativeModules } from 'react';
import { TextInput, View, Text, AsyncStorage, TouchableOpacity, CameraRoll, StyleSheet, Keyboard } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { ImagePicker } from 'expo';
import { CameraRollPicker } from './CameraRollPicker';

import { addPlaceToFavorite, postImageToPlace } from '../../services/apiActions';


export class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      favorite: false,
      showPhoto: false,
      image: null,
      photo: {},
      buttonDisabled: false,
      user: {}
    };
    this.savePlace = this.savePlace.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.togglePhoto = this.togglePhoto.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this);
    this.getCity = this.getCity.bind(this);
    this.getCountry = this.getCountry.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem('user', (err, user) => this.setState({user: JSON.parse(user)}))
  }

  savePlace(place) {
    if (place.google_id) {
      return this.saveChosenPlaceAsFavorite(place, this.props.group);
    }
    const city = this.getCity(place);
    const country = this.getCountry(place);
    const parsedPlace = {
      name: place.name,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      google_id: place.id,
      google_place_id: place.place_id,
      favorite: this.state.favorite,
      city: city,
      country: country,
      data: place
    };
    this.saveChosenPlaceAsFavorite(parsedPlace, this.props.group);
  }

  getCountry(place) {
    const country = place.address_components.filter((item) => item['types'].includes('country'))[0]
    return country ? country['long_name'] : null
  }

  getCity(place) {
    const city = place.address_components.filter((item) => item['types'].includes('locality'))[0]
    return city ? city['long_name'] : null
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

  handlePhotoUpload(imageUri) {
    const photo = {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    };
    const data = {
      photo: photo,
      place: this.props.place
    };
    postImageToPlace(data);
  }

  saveChosenPlaceAsFavorite(place, group) {
    const { favorite, text, photo, user } = this.state;
    Keyboard.dismiss();
    this.setState({buttonDisabled: true})
    addPlaceToFavorite({ place: place, comment: text, favorite: favorite, group: group })
      .then((res) => {
        if(this.state.image) {
          this.handlePhotoUpload(this.state.image)
        }

        newPlace = {
          user: user,
          place: place,
          comment: text,
          created_at: Date.now()
        };

        if (group) {
          Actions.pop({
            refresh: {
              group: group,
              new_place: newPlace,
              new_marker: place
            }
          });
        } else {
          Actions.pop({
            refresh: {
              new_place: newPlace,
              new_marker: place
            }
          });
        }
      })
      .catch((error) => console.log('Failed Saving Place: ', error));
  }

  handleKeyDown(e) {
    if(e.nativeEvent.key === "Enter"){
      Keyboard.dismiss()
    }
  }

  render() {
    const { place } = this.props;
    const { showPhoto, image, buttonDisabled } = this.state;
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
            maxLength={255}
            returnKeyType={'done'}
            onKeyPress={this.handleKeyDown}
          />
        </View>
        <Button
         raised
         title='Add Place'
         backgroundColor='#4296CC'
         onPress={() => this.savePlace(place)}
         disabled={buttonDisabled}
         />

         { showPhoto && <CameraRollPicker pickImage={this.pickImage} image={image}/>}

      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    marginTop: 70
  },
  placeToAdd: {
    flexDirection: 'row',
    paddingTop: 10,
    height: 40,
    borderBottomWidth: 0.4,
    borderBottomColor: 'gray'
  },
  placeToAddText: {
    marginLeft: 15,
    width: '75%',
    flexWrap: 'wrap'
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
