import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, ListItem } from 'react-native-elements'

const types = ["bar","cafe","museum", "night_club", "park", "restaurant"]

const createTypeList = (onPress) => {
  return types.map((type, idx) => {
    return (
      <ListItem
        key={idx}
        title={type}
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
      <List>
        {createTypeList(onPress)}
      </List>
    </ScrollView>
  );
};

export default Filter;
