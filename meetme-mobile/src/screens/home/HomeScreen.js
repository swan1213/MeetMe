import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { Components, Location } from 'expo';
import { connect } from 'react-redux';
import { Button, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import { LoadingScreen } from '../../commons';
import { MyMeetupsList } from './components';

import { fetchMyMeetups } from './actions';
import Colors from '../../../constants/Colors';
import styles from './styles/HomeScreen';

@connect(
  state => ({
    myMeetups: state.home.myMeetups,
    currentRegion: 'unknown'
  }),
  { fetchMyMeetups }
)

class HomeScreen extends Component {
  static navigationOptions = {
    header: ({ navigate }) => {
      const style = { backgroundColor: Colors.whiteColor };
      const left = (
        <TouchableOpacity style={styles.iconAdd} onPress={() => navigate('CreateMeetup')}>
          <MaterialIcons
            name="add-circle"
            size={30}
            color={Colors.blackColor} />
        </TouchableOpacity>
      );
      const right = (
        <TouchableOpacity>
          <MaterialIcons
            name="navigate-next"
            size={30}
            color={Colors.blackColor}
            />
        </TouchableOpacity>
      );

      return {style, left, right };
    },
    tabBar: {
      icon: ({ tintColor }) => (
        <MaterialIcons 
          name="map"
          size={25}
          color={tintColor}
        />
      )
    }
  }

  // state = {
  //   currentRegion: 'unknown'
  // }

  watchID: ?number = null;

  componentDidMount() {
    this.props.fetchMyMeetups();

    let { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.01;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    navigator.geolocation.getCurrentPosition((position) => {
      console.log("Here is the postion: " + position.coords);
      this.setState({currentRegion: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }});
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.setState({currentRegion: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }});
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onRegionChange(region) {
    return regionChanged =  this.setState({ region });
  }

  render() {
    const {
      myMeetups: {
        isFetched,
        data,
        error
      }
    } = this.props;
    if (!isFetched) {
      return <LoadingScreen />;
    } else if (error.on) {
      return (
        <View>
          <Text>{error.message}</Text>
        </View>
      );
    }
    return (
      <View style={styles.root}>
        <Components.MapView
          style={styles.mapContainer}
          region={this.state.currentRegion}
          showsUserLocation={true}>
          <Components.MapView.Marker
            coordinate={{latitude: 34.0195, longitude: -118.4912}}
            title={"title"}
            description={"description"}
          />
          <Components.MapView.Marker
            coordinate={{latitude: 34, longitude: -118.45}}
            title={"title"}
            description={"description"}
          />
        </Components.MapView>
        <View style={styles.bottomContainer}>
          <MyMeetupsList meetups={data} />
        </View>
      </View>
    );
  }
}

export default HomeScreen;