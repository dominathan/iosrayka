import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { OnboardingTile } from './OnboardingTile';
import { Actions } from 'react-native-router-flux';

export class Onboarding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0,
            slides: [
                {
                    image: require('./tiles/discover.png'),
                    text: 'Scroll through the feed to see recommendations and favorite places from people you know and trust. Use the bottom tabs to navigate between Public, Friends and Experts',
                    title: 'Discover'
                },
                {
                    image: require('./tiles/explore.png'),
                    text: 'Tired of outdated rankings and 1-5 star reviews? Find the best the world has to offer from a ranking based on compiled favorites.',
                    title: 'Explore'
                },
                {
                    image: require('./tiles/master.png'),
                    text: 'Curious what the world’s veteran travelers recommend? Find the best cities, bars, restaurants and more from experts who have travelled the globe.',
                    title: 'Master'
                },
                {
                    image: require('./tiles/groups.png'),
                    text: 'Join Study Abroad Groups to see the recommendations and favorite places of past students who studied there.',
                    title: 'Groups'
                }
            ]
        };
    }

    getActiveSlide() {
        let activeSlide = this.state.slides.filter((slide, idx) => {
          if (idx === this.state.activeSlide) {
            return slide;
          }
        });
        return activeSlide[0];
    }

    advanceSlide() {
        if ((this.state.activeSlide + 1) === this.state.slides.length) {
          this.setState({activeSlide: 0});
          Actions.home({ type: 'reset'});
        } else {
          let newActiveSlide = ++this.state.activeSlide;
          this.setState({activeSlide: newActiveSlide});
        }
    }

    render() {
        return (<View style={styles.container}>
            <View style={styles.onboardingContainer}>
                <OnboardingTile
                  style={styles.tile}
                  tile={this.getActiveSlide()}
                />
                <Button
                  buttonStyle={styles.button}
                  raised
                  backgroundColor='#3c95cd'
                  icon={{ name: 'chevron-right', type: 'font-awesome' }}
                  title="Next"
                  onPress={() => { this.advanceSlide() }}
                />
            </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    button: {
      marginBottom: 15
    },
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    onboardingContainer: {
        flex: 1
    },
    tile: {
      flex: 2
    }
});
