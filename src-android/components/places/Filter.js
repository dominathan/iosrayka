import React, {Component} from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { List, ListItem, CheckBox } from 'react-native-elements'


export default class Filter extends Component {
  createTypeList(type, idx) {
    return (
      <ListItem
        key={idx}
        subtitle={
          <View style={styles.subtitle}>
            <Text style={styles.title}>{type.visibleName}</Text>
            <CheckBox
              containerStyle={styles.checkboxContainer}
              checked={type.checked}
              onPress={() => {
                this.props.toggleFilterCheckbox(type);
              }}
            />
          </View>
        }
        hideChevron={true}
      />
    )
  }

  render() {
    return (
      <ScrollView>
        <List style={styles.container}>
          {this.props.types.map((type,idx) => this.createTypeList(type, idx))}
        </List>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  checkboxContainer: {
    alignItems: 'flex-end',
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 0,
  },
  subtitle: {
    flexDirection: 'row'
  },
  title: {
    alignSelf: 'center',
    fontSize: 20
  }
});
