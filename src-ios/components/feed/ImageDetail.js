import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Tile } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

export class ImageDetail extends Component {

    render() {
        return (
            <Tile
              imageSrc={this.props.image}
              containerStyle={styles.container}
              imageContainerStyle={styles.imageContainer}
            >
            </Tile>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222'
    },
    imageContainer: {
      flex: 3,
      width: null,
      height: null,
      resizeMode: 'contain',
      backgroundColor: '#222'
    }
});
