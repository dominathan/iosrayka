import React, { Component } from 'react';
import { Alert, AsyncStorage, StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, CameraRoll } from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { updateUser, postImageToUser } from '../../services/apiActions';
import { CameraRollPicker } from '../places/CameraRollPicker';
import ImagePicker from 'react-native-image-picker';
export class ProfileInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: undefined,
      imageUri: null,
      imageSource: null,
      imageChanged: false,
      showActivityIndicator: false,
      error: ''
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
      if(user) this.setState({user: user, imageUri: user.photo_url });
    });
  }
  getPhoto() {
    const options = {
      title: 'Select Profile Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.setState({
          imageUri: 'data:image/jpeg;base64,' + response.data,
          imageChanged: true
        });
      }
    });
  }
  handlePhotoUpload(imageUri) {
    const data = {
      photo: imageUri,
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
            this.setState({showActivityIndicator: true, error: ''});
            updateUser(this.state.user)
              .then((data) => {
                if (this.state.imageChanged) {
                  return this.handlePhotoUpload(this.state.imageUri);
                }
                else {
                  return new Promise((resolve, reject) => {
                    resolve(data);
                  });
                }
              })
              .then(results => {
                console.log("Results; ", results)
                if(results.error) {
                  return new Promise((resolve, reject) => {
                    reject(results.error);
                  });
                }
                return AsyncStorage.setItem('user', JSON.stringify(results));
              })
              .then(data => {
                Actions.settings({type: 'reset'});
              })
              .catch(error => {
                this.handleUpdateError(error);
              });
          }
        }
      ]
    );
  }
  handleUpdateError(error) {
    console.log('ERROR: ', error);
    this.setState({showActivityIndicator: false, error});
    Alert.alert(
      'An error occurred',
      'The was a problem updating your profile.',
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
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
            { this.state.imageUri && <CameraRollPicker image={this.state.imageUri} pickImage={() => console.log('yay')}/>}
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
