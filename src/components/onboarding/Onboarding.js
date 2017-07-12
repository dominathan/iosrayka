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
                    image: require('./tiles/Onboarding_1.png'),
                    text: 'Create or join study abroad groups to find the best places to go during your time abroad.',
                    title: ''
                },
                {
                    image: require('./tiles/Onboarding_2.png'),
                    text: 'Find the best resturants, bars, coffee shops, and more from the recommendations of only study abroad students.',
                    title: ''
                },
                {
                    image: require('./tiles/Onboarding_3.png'),
                    text: 'Don’t rely on a 1-5 rating from strangers: search among rankings of compiled student favorites.',
                    title: ''
                },
                {
                    image: require('./tiles/Onboarding_4.png'),
                    text: 'Recommend your own favorite places to go through our easy interface.',
                    title: ''
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
          Actions.groups({ type: 'reset'});
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
