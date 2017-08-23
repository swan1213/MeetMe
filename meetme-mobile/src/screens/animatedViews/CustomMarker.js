import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';

const propTypes = {
  image: PropTypes.string.isRequired,
};

export default class CustomMarker extends React.Component {
  render() {
    const { image } = this.props;
    return (
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          style={styles.image} 
          source={{uri: image}}
        />
      </View>
    );
  }
}

CustomMarker.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
  }
  
});
