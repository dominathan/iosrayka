import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ListView, Linking, AsyncStorage, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';

import { addFriend, getFriends, getUserFeed, getUserPlaces, getPendingFriends, getUserFriends } from '../../services/apiActions';
import { Feed } from '../feed/Feed';
import { Map } from '../map/Map';
import ProfileStats from './ProfileStats';

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      feed: [],
      markers: [],
      favorites: [],
      friends: [],
      favoritesList: [],
      person: this.props.person || null,
      selectedFilter: 'feed',
      showActivityIndicator: false,
      friendAdded: false,
      showFriendStatus: true
    };

    this.getCountriesVisited = this.getCountriesVisited.bind(this);
    this.feed = this.feed.bind(this);
    this.userPlaces = this.userPlaces.bind(this);
    this.follow = this.follow.bind(this);
    this.refreshFeed = this.refreshFeed.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
  }

  componentDidMount() {
    this.setCurrentUser();
    this.userPlaces();
    this.friends();
    this.feed();
  }

  componentWillUnmount() {
    return AsyncStorage.removeItem('profileFeed')
      .then(() => {
        AsyncStorage.removeItem('profilePlaces');
      });
  }

  setCurrentUser() {
    AsyncStorage.getItem('user', (err, user) => {
      this.setState({ user: JSON.parse(user) });
    });
  }

  getCountriesVisited() {
    let countries = this.state.markers.reduce((countryTally, marker) => {
      if(countryTally.includes(marker.country)) {
        return countryTally;
      }
      countryTally.push(marker.country);
      return countryTally;
    }, []);
    this.setState({
      countries,
      showActivityIndicator: false
    });
  }

  feed() {
    return AsyncStorage.getItem('profileFeed')
      .then(profileFeed => {
        if(profileFeed) {
          return JSON.parse(profileFeed);
        }
        return getUserFeed(this.props.person);
      })
      .then(feed => {
        this.setState({
          display: feed,
          feed,
          feedType: 'feed'
        });
        return AsyncStorage.setItem('profileFeed', JSON.stringify(feed));
      });
  }

  follow(friend) {
    this.setState({ showActivityIndicator: true });
    addFriend(friend)
      .then((resp) => {
        this.setState({ friendAdded: true, showActivityIndicator: false })
      });
  }

  friends() {
    let activeUser;
    return AsyncStorage.getItem('user')
      .then(user => {
        activeUser = JSON.parse(user);
        if(activeUser.id === this.props.person.id) {
          this.setState({ showFriendStatus: false });
        }
        return getUserFriends(this.props.person);
      })
      .then(friends => {
        let activeFriend = friends.filter(friend => {
          return friend.id === activeUser.id;
        });
        if(activeFriend.length === 1) {
          this.setState({ friendAdded: true });
        }
        this.setState({ friends });
      })
      .catch((err) => console.error('NO FRIENDS!!!', err));
  }

  refreshFeed() {
    return AsyncStorage.removeItem('profileFeed')
      .then(() => {
        return AsyncStorage.removeItem('profilePlaces');
      })
      .then(() => {
        this.feed();
        this.userPlaces();
      });
  }

  selectedFilterChange(val) {
    this.setState({
      selectedFilter: val,
      feedType: val
    });
  }

  userPlaces() {
    this.setState({ showActivityIndicator: true });
    return AsyncStorage.getItem('profilePlaces')
      .then(profilePlaces => {
        if(profilePlaces) {
          return JSON.parse(profilePlaces);
        }
        return getUserPlaces(this.state.person);
      })
      .then(data => {
        const list = data.favorites.map(favorite => {
          return {
            place: favorite,
            user: this.state.person
          };
        });
        this.setState({
          markers: data.places,
          favorites: data.favorites,
          favoritesList: list
        });
        return AsyncStorage.setItem('profilePlaces', JSON.stringify(data));
      })
      .then(() => {
        this.getCountriesVisited();
      })
      .catch((err) => console.log('fuck balls: ', err));
  }

  render() {
    const { countries, favorites, favoritesList, feed, feedType, friends, markers, person, selectedFilter, friendAdded, showActivityIndicator, showFriendStatus, user } = this.state;

    return(
      <View style={styles.container}>
        <Map markers={markers} styles={styles.mapContainer} />
          <View source={styles.profileImageContainer}>
            <Image source={{ uri: person.photo_url }} style={styles.photo} />
          </View>
        <View style={styles.detailsContainer}>
          { person && <View style={styles.profileDetailsContainer}>
            <View style={styles.profileTextContainer}>
              <View style={styles.nameTextContainer}>
                {person.expert && <Icon style={styles.expertContainer} size={20} color={'#4296cc'} type="material-community" name="crown"/>}
                { !person.first_name &&
                  <Text style={styles.name}>{person.email}</Text>
                }
                <Text style={styles.name}>{person.first_name} {person.last_name}</Text>
                { showFriendStatus &&
                  !friendAdded &&
                    <Icon
                      style={styles.addFriendContainer}
                      name="add"
                      color="#4296CC"
                      onPress={() => { this.follow(person) }}
                    />
                }
                { showFriendStatus &&
                  friendAdded &&
                  <Text style={styles.friendAddedText}> (Following)</Text>
                }
              </View>

              {person.expert &&
                <View style={styles.expertLinkContainer}>
                  {person.expert_blog_log &&
                    <TouchableOpacity onPress={() => Linking.openURL(person.expert_blog_log)} >
                      <Text style={styles.expertBlogLink}>View Expert Blog</Text>
                    </TouchableOpacity>
                  }
                </View>
              }
            </View>
          </View> }
          <View style={styles.statsContainer}>
            <ProfileStats label="Followers" icon="group" data={friends.length} />
            <ProfileStats label="Favorites" icon="star-o" data={favorites.length} />
            <ProfileStats label="Countries" icon="globe" data={countries.length} />
          </View>
          <View style={styles.listContainer}>
            <View style={styles.filtersContainer}>
              <TouchableOpacity style={styles.privatePress} onPress={() => this.selectedFilterChange('feed')}>
                <Text style={selectedFilter === 'feed' ? styles.selectedFilter : styles.filters}>FEED</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.privatePress} onPress={() => this.selectedFilterChange('favoritesList')}>
                <Text style={selectedFilter === 'favoritesList' ? styles.selectedFilter : styles.filters}>FAVORITES</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.feed}>
               {(feedType === 'feed') && <Feed feed={feed} refreshFeed={this.refreshFeed} user={user} />}
               {(feedType === 'favoritesList') && <Feed feed={favoritesList} refreshFeed={this.refreshFeed} user={user} />}
             </View>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addFriendContainer: {
    marginLeft: 10,
    height: 25,
    width: 25
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  detailsContainer: {
    flex: 1,
    position: 'relative',
  },
  expertBlogLink: {
    color: '#4296cc',
    fontSize: 16
  },
  expertContainer: {
    height: 15,
    width: 25
  },
  expertLinkContainer: {
    marginLeft: 110,
    alignSelf: 'flex-start',
    marginTop: 5
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 45,
    borderBottomWidth: 0.4,
    borderBottomColor: '#8D8F90',
  },
  filters: {
    marginRight: 10,
    marginLeft: 15,
    alignSelf: 'center',
    color: '#8D8F90',
    paddingTop: 12
  },
  friendAddedText: {
    fontSize: 12
  },
  selectedFilter: {
    color: '#4296CC',
    borderBottomWidth: 1,
    borderBottomColor: '#4296CC',
    paddingTop: 12,
    marginRight: 10,
    marginLeft: 15,
  },
  selectedFilterButton: {
    color: '#4296CC',
    borderBottomWidth: 1,
    borderBottomColor: '#4296CC',
    marginRight: 10,
    marginLeft: 25,
  },
  filterButton: {
    alignSelf: 'center',
    position: 'absolute',
    right: 15,
    top: 12
  },
  filterButtonText: {
    color: '#8D8F90',
  },
  listContainer: {
    flex: 3
  },
  mapContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  nameTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    marginLeft: 80,
    width: 300
  },
  name: {
    fontSize: 20
  },
  profileDetailsContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f4f4f4'
  },
  profileImageContainer: {
    flex: 1,
    zIndex: 10,
  },
  profileTextContainer: {
    flex: 3,
    marginLeft: 10
  },
  photo: {
    height: 70,
    width: 70,
    borderRadius: 35,
    alignSelf: 'flex-start',
    position: 'absolute',
    top: -25,
    marginLeft: 5,
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 10,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    paddingBottom: 0
  },
  feed: {
    flex: 1
  }
});
