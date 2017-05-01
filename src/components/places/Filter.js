import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, ListItem } from 'react-native-elements'

const types = [
  { name: 'bar||night_club', visibleName: 'Bar'},
  { name: "cafe", visibleName: 'Coffee'},
  { name: "food||restaurant", visibleName: 'Restaurant'},
  { name: "lodging", visibleName: 'Hotel'},
  { name: "park", visibleName: 'Park'},
  { name: "place_of_worship", visibleName: 'Place of Worship' },
  { name: "spa", visibleName: 'Spa' },
  { name: "point_of_interes||establishment", visibleName: 'Other' },
  { name: 'zoo||amusement_park||aquarium||art_gallery||museum', visibleName: 'Things To Do'}
]

const createTypeList = (onPress) => {
  return types.map((type, idx) => {
    return (
      <ListItem
        key={idx}
        title={type.visibleName}
        rightIcon={{name: 'filter', type: 'font-awesome'}}
        onPress={() => selectedFilter(onPress, type)}
      />
    )
  })
}

const selectedFilter = (onPress, type) => {
  onPress(type)
}

const Filter = ({ onPress, props }) => {
  return (
    <ScrollView>
      <List style={styles.container}>
        {createTypeList(onPress)}
      </List>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0
  }
});

export default Filter;
