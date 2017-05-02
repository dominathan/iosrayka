import React, { Component } from 'react';
import { Image, ListView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

export class ImageFeed extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      images: ds.cloneWithRows([])
    }
  }

  componentWillMount() {
    console.log(this.props)
    this.setState({images: this.state.images.cloneWithRows(this.props.images)});
  }

  renderImageRow(image) {
    return (
        <TouchableOpacity style={styles.imageContainer} onPress={() => { Actions.imageDetail({image: {uri: image.uri}}); }}>
          <Image style={styles.image} source={{uri: image.uri}}/>
        </TouchableOpacity>
    );
  }

  render() {
    return(
      <View style={styles.container}>
        <ListView
          contentContainerStyle={styles.grid}
          dataSource={this.state.images}
          renderRow={this.renderImageRow}
          enableEmptySections={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageContainer: {
    margin: 5,
    width: 100,
    height: 100,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  image: {
    width: 100,
    height: 100
  },
  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1
  }
});
