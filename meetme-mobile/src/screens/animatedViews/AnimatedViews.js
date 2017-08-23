import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  Navigator
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import MapView from 'react-native-maps';

import { Components, Location } from 'expo';

import PanController from './PanController';
// import CustomMarker from './CustomMarker';
import RestaurantRow from './RestaurantRow';

import Colors from '../../../constants/Colors';

import { GooglePlacesAPI } from '../../config';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0122;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const ITEM_SPACING = 10;
const ITEM_PREVIEW = 10;
const ITEM_WIDTH = width - (2 * ITEM_SPACING) - (2 * ITEM_PREVIEW);
const SNAP_WIDTH = ITEM_WIDTH + ITEM_SPACING;
const ITEM_PREVIEW_HEIGHT = 150;
const SCALE_END = width / ITEM_WIDTH;
const BREAKPOINT1 = 246;
const BREAKPOINT2 = 350;
const ONE = new Animated.Value(1);

function getMarkerState(panX, panY, scrollY, i) {
  const xLeft = (-SNAP_WIDTH * i) + (SNAP_WIDTH / 2);
  const xRight = (-SNAP_WIDTH * i) - (SNAP_WIDTH / 2);
  const xPos = -SNAP_WIDTH * i;

  const isIndex = panX.interpolate({
    inputRange: [xRight - 1, xRight, xLeft, xLeft + 1],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp'
  });

  const isNotIndex = panX.interpolate({
    inputRange: [xRight - 1, xRight, xLeft, xLeft + 1],
    outputRange: [1, 0, 0, 1],
    extrapolate: 'clamp'
  });

  const center = panX.interpolate({
    inputRange: [xPos - 10, xPos, xPos + 10],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp'
  });

  const selected = panX.interpolate({
    inputRange: [xRight, xPos, xLeft],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp'
  });

  const translateY = Animated.multiply(isIndex, panY);

  const translateX = panX;

  const anim = Animated.multiply(isIndex, scrollY.interpolate({
    inputRange: [0, BREAKPOINT1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }));

  const scale = Animated.add(ONE, Animated.multiply(isIndex, scrollY.interpolate({
    inputRange: [BREAKPOINT1, BREAKPOINT2],
    outputRange: [0, SCALE_END - 1],
    extrapolate: 'clamp'
  })));

  // [0 => 1]
  let opacity = scrollY.interpolate({
    inputRange: [BREAKPOINT1, BREAKPOINT2],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  // if i === index: [0 => 0]
  // if i !== index: [0 => 1]
  opacity = Animated.multiply(isNotIndex, opacity);


  // if i === index: [1 => 1]
  // if i !== index: [1 => 0]
  opacity = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  });

  let markerOpacity = scrollY.interpolate({
    inputRange: [0, BREAKPOINT1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  markerOpacity = Animated.multiply(isNotIndex, markerOpacity).interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  });

  const markerScale = selected.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2]
  });

  return {
    translateY,
    translateX,
    scale,
    opacity,
    anim,
    center,
    selected,
    markerOpacity,
    markerScale
  };
}

class AnimatedViews extends React.Component {
  static navigationOptions = {
    title: 'NEARBY PLACES',
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

  constructor(props) {
    super(props);

    const panX = new Animated.Value(0);
    const panY = new Animated.Value(0);

    const scrollY = panY.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1]
    });

    const scrollX = panX.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1]
    });

    const scale = scrollY.interpolate({
      inputRange: [0, BREAKPOINT1],
      outputRange: [1, 1.6],
      extrapolate: 'clamp'
    });

    const translateY = scrollY.interpolate({
      inputRange: [0, BREAKPOINT1],
      outputRange: [0, -100],
      extrapolate: 'clamp'
    });

    const markers = [];

    this.state = {
      initialRegion: null,
      panX,
      panY,
      index: 0,
      canMoveHorizontal: true,
      scrollY,
      scrollX,
      scale,
      translateY,
      markers,
      region: new MapView.AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
      coordinate: {
        latitude: LATITUDE,
        longitude: LONGITUDE
      }
    };
  }

  componentDidMount() {
    const { panX, panY, scrollY } = this.state;

    panX.addListener(this.onPanXChange);
    panY.addListener(this.onPanYChange);

    navigator.geolocation.getCurrentPosition((position) => {
      if (position && position.coords){
        this.onRegionChangeComplete(position.coords);

      }
    }, (error) => {
      
      Alert.alert(
        'Error',
        "Please Activate your location !",
        [
          {text: 'Close', onPress: () => {}},
        ]
      );
    }
    );
  }
  
  onStartShouldSetPanResponder = (e) => {
    // we only want to move the view if they are starting the gesture on top
    // of the view, so this calculates that and returns true if so. If we return
    // false, the gesture should get passed to the map view appropriately.
    const { panY } = this.state;
    const { pageY } = e.nativeEvent;
    const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue();
    const topOfTap = height - pageY;

    return topOfTap < topOfMainWindow;
  }

  onMoveShouldSetPanResponder = (e) => {
    const { panY } = this.state;
    const { pageY } = e.nativeEvent;
    const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue();
    const topOfTap = height - pageY;

    return topOfTap < topOfMainWindow;
  }

  onPanXChange = ({ value }) => {
    const { index } = this.state;
    const newIndex = Math.floor(((-1 * value) + (SNAP_WIDTH / 2)) / SNAP_WIDTH);
    if (index !== newIndex) {
      this.setState({ index: newIndex });
    }
  }

  onPanYChange = ({ value }) => {
    const { canMoveHorizontal, region, scrollY, scrollX, markers, index } = this.state;
    const shouldBeMovable = Math.abs(value) < 2;
    if (shouldBeMovable !== canMoveHorizontal) {
      this.setState({ canMoveHorizontal: shouldBeMovable });
      if (!shouldBeMovable) {
        const { coordinate } = markers[index];
        region.stopAnimation();
        region.timing({
          latitude: scrollY.interpolate({
            inputRange: [0, BREAKPOINT1],
            outputRange: [
              coordinate.latitude,
              coordinate.latitude - (LATITUDE_DELTA * 0.5 * 0.375),
            ],
            extrapolate: 'clamp'
          }),
          latitudeDelta: scrollY.interpolate({
            inputRange: [0, BREAKPOINT1],
            outputRange: [LATITUDE_DELTA, LATITUDE_DELTA * 0.5],
            extrapolate: 'clamp'
          }),
          longitudeDelta: scrollY.interpolate({
            inputRange: [0, BREAKPOINT1],
            outputRange: [LONGITUDE_DELTA, LONGITUDE_DELTA * 0.5],
            extrapolate: 'clamp'
          }),
          duration: 0
        }).start();
      } else {
        region.stopAnimation();
        region.timing({
          latitude: scrollX.interpolate({
            inputRange: markers.map((m, i) => i * SNAP_WIDTH),
            outputRange: markers.map(m => m.coordinate.latitude),
          }),
          longitude: scrollX.interpolate({
            inputRange: markers.map((m, i) => i * SNAP_WIDTH),
            outputRange: markers.map(m => m.coordinate.longitude),
          }),
          duration: 0
        }).start();
      }
    }
  }

  onRegionChange(/* region */) {
    // this.state.region.setValue(region);
  }

  onRegionChangeComplete = (region) => {
    const {initialRegion} = this.state;
    this.setState({initialRegion: region});
    if (initialRegion !== null) {
      return;
    }
    else {
      this.findRestaurant(region);
    }
  }

  generateMarkers(markers) {
    const { panX, panY, scrollY } = this.state;
    const animations = markers.map((m, i) =>
      getMarkerState(panX, panY, scrollY, i));
    console.log('markers.length', markers.length)
    this.setState({ animations, markers });
    this.startAnimate();
  }

  startAnimate() {
    const { region, panX, panY, scrollX, markers } = this.state;
    if(markers.length > 1) {
      region.stopAnimation();
      region.timing({
        latitude: scrollX.interpolate({
          inputRange: markers.map((m, i) => i * SNAP_WIDTH),
          outputRange: markers.map(m => m.coordinate.latitude),
        }),
        longitude: scrollX.interpolate({
          inputRange: markers.map((m, i) => i * SNAP_WIDTH),
          outputRange: markers.map(m => m.coordinate.longitude),
        }),
        duration: 0
      }).start();
    }
  }

  async findRestaurant(region) {

    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
    `location=${region.latitude},${region.longitude}` +
    // `location=${LATITUDE},${LONGITUDE}` +
    "&radius=500&type=restaurant&key=" + GooglePlacesAPI
    console.log(url);

    let markes = [];

    await fetch(url)
    .then(response => {
      return response.json();
    })
    .then((responseData) => {
      console.log('responseDataresponseData', responseData)
      if(responseData && responseData.results) {
        console.log('responseDataresponseData', responseData.results.length)
        responseData.results.forEach((r, index) => {
          markes.push({id: index,
            name: r.name,
            icon: r.icon,
            rating: r.rating,
            image: this.getUrlImage(r),
            vicinity: r.vicinity,
            coordinate: {
              latitude: r.geometry.location.lat,
              longitude: r.geometry.location.lng,
            }
          })
        });
      }
    })
    .catch(error => {
    });

    this.generateMarkers(markes);
  }

  getUrlImage(item) {
    let url = item.icon;
    if(item.photos[0]) {
      url =  "https://maps.googleapis.com/maps/api/place/photo?"+
      "maxwidth=400&photoreference="+ item.photos[0].photo_reference +
      "&key="+ GooglePlacesAPI;
    }
    
    console.log(url);
    return url;
  }


  render() {
    const {
      panX,
      panY,
      animations,
      canMoveHorizontal,
      markers,
      region,
      initialRegion
    } = this.state;

    return (
      <View style={styles.container}>
        <PanController
          style={styles.container}
          vertical
          horizontal={canMoveHorizontal}
          xMode="snap"
          snapSpacingX={SNAP_WIDTH}
          yBounds={[-1 * height, 0]}
          xBounds={[-width * (markers.length - 1), 0]}
          panY={panY}
          panX={panX}
          onStartShouldSetPanResponder={this.onStartShouldSetPanResponder}
          onMoveShouldSetPanResponder={this.onMoveShouldSetPanResponder}
        >
          <MapView.Animated
            provider={this.props.provider}
            style={styles.map}
            region={region}
            initialRegion={initialRegion}
            onRegionChange={this.onRegionChange}
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            showsBuildings={true}
            zoomEnabled={true}
            rotateEnabled={true}
            loadingEnabled={true}
            showsTraffic={true}
            onRegionChangeComplete={this.onRegionChangeComplete}
            legalLabelInsets={{top: 10, right: 10, bottom: 10, left: 10 }}
          >
            {markers.map((marker, i) => {
              const {
                selected,
                markerOpacity,
                markerScale
              } = animations[i];

              return (
                <Components.MapView.Marker
                  key={marker.id}
                  coordinate={marker.coordinate}
                  //image={marker.image}
                  selected={selected}
                />
              );
            })}
          </MapView.Animated>
          <View style={styles.itemContainer}>
            {markers.map((marker, i) => {
              const {
                translateY,
                translateX,
                scale,
                opacity
              } = animations[i];

              return (
                <Animated.View
                  key={marker.id}
                  style={[styles.item, {
                    opacity,
                    transform: [
                      { translateY },
                      { translateX },
                      { scale }
                    ]
                  }]}
                >
                  <RestaurantRow
                    rating={marker.rating}
                    name={marker.name}
                    image={marker.image}
                    address={marker.vicinity}
                  />
                </Animated.View>
              );
            })}
          </View>
        </PanController>
      </View>
    );
  }
}

AnimatedViews.propTypes = {
  provider: MapView.ProviderPropType
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  itemContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingHorizontal: (ITEM_SPACING / 2) + ITEM_PREVIEW,
    position: 'absolute',
    // top: height - ITEM_PREVIEW_HEIGHT - 64,
    paddingTop: height - ITEM_PREVIEW_HEIGHT - 100,
    // paddingTop: !ANDROID ? 0 : height - ITEM_PREVIEW_HEIGHT - 64,
  },
  map: {
    backgroundColor: 'transparent',
    ...StyleSheet.absoluteFillObject
  },
  item: {
    width: ITEM_WIDTH,
    height: height + (2 * ITEM_PREVIEW_HEIGHT),
    marginHorizontal: ITEM_SPACING / 2,
    overflow: 'hidden',
    borderRadius: 3,
    borderColor: '#000'
  },
  iconAdd: {
    marginLeft: 10
  }
});

module.exports = AnimatedViews;