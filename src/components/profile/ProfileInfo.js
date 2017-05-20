import React, { Component } from 'react';
import { ImagePicker } from 'expo';
import { Alert, AsyncStorage, StyleSheet, View, TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import { updateUser, postImageToUser } from '../../services/apiActions';
import { CameraRollPicker } from '../places/CameraRollPicker';

export class ProfileInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: undefined,
      image: null,
      imageChanged: false,
      showActivityIndicator: false
    }
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.getPhoto = this.getPhoto.bind(this);
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this);
  }

  componentDidMount() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    AsyncStorage.getItem('user', (err, user) => {
      user = JSON.parse(user);
      this.setState({user: user, image: user.photo_url });
    });
  }

  getPhoto() {
    ImagePicker.launchImageLibraryAsync({})
      .then((response) => {
        this.setState({image: response.uri, imageChanged: true})
      })
      .catch(error => {
        console.error(error);
      })
  }

  handlePhotoUpload(imageUri) {
    const photo = {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    };
    const data = {
      photo: photo,
    };
    return postImageToUser(data);
  }

  submit() {
    Alert.alert(
      'Update user settings',
      'Are you sure you want to update?',
      [
        {
          text: 'Cancel',
          onPress: () => { return }
        },
        {
          text: 'Ok',
          onPress: () => {
            this.setState({showActivityIndicator: true})
            updateUser(this.state.user)
              .then(() => {
                if (this.state.imageChanged) {
                  return this.handlePhotoUpload(this.state.image)
                }
              })
              .then(data => {
                return Promise.all([AsyncStorage.removeItem('user'), data]);
              })
              .then(results => {
                let userData = results[1];
                return AsyncStorage.setItem('user', JSON.stringify(data));
              })
              .then(data => {
                Actions.settings({type: 'reset'});
              })
              .catch(error => {
                console.log('FUCK: ', error);
              });
          }
        }
      ]
    );
  }

  render() {
    if (this.state.user === undefined) {
      return (null);
    } else {
      let user = this.state.user;
      return (
        <View style={styles.container}>
          <View style={styles.formContainer}>
              <FormLabel>First Name</FormLabel>
              <FormInput
                inputStyle={styles.inputStyle}
                onChangeText={(text) => {
                  user.first_name = text;
                  this.setState({ user: user })
                }}
                value={user.first_name} />
              <FormLabel>Last Name</FormLabel>
              <FormInput
                inputStyle={styles.inputStyle}
                onChangeText={(text) => {
                  user.last_name = text;
                  this.setState({ user: user })
                }}
                value={user.last_name} />
            { user.expert &&
              <View style={styles.fieldView}>
                <FormLabel>Blog</FormLabel>
                <FormInput
                  inputStyle={styles.inputStyle}
                  autoCapitalize={'none'}
                  onChangeText={(text) => {
                    user.expert_blog_log = text;
                    this.setState({ user: user })
                  }}
                  value={user.expert_blog_log}
                />
              </View>
            }
            <TouchableOpacity style={styles.addPhotoContainer} onPress={this.getPhoto}>
              <Text style={styles.addPhoto}> Add / Update Photo </Text>
            </TouchableOpacity>

            { this.state.image && <CameraRollPicker image={this.state.image} pickImage={() => console.log("YAY")}/>}
          </View>



          <View style={styles.buttonContainer}>
            {!this.state.showActivityIndicator
                ? <Button
                    buttonStyle={styles.button}
                    raised
                    backgroundColor='#3c95cd'
                    icon={{ name: 'check', type: 'font-awesome' }}
                    title="Submit"
                    onPress={() => { this.submit() }}
                  />
                : <ActivityIndicator
                  animating={this.state.showActivityIndicator}
                  size="large"
                />}
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 15
  },
  container: {
    flex: 1,
    marginTop: 60,
    justifyContent: 'flex-start'
  },
  fieldView: {
    height: 40
  },
  formContainer: {
    flex: 3
  },
  inputStyle: {
    width: '100%'
  },
  addPhotoContainer: {
    margin: '4%'
  },
  addPhoto: {
    color: '#3c95cd'
  }
});
