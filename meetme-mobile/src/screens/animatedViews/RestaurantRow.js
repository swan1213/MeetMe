import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button
} from 'react-native';
import StarRating from 'react-native-star-rating';
import styles from './styles/RestaurantRow';

const propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired
};

export default class RestaurantRow extends React.Component {
  render() {
    const { image, name, address, rating } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image 
            style={styles.image}
            source={{uri: image}}
            resizeMode="contain"
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.address}>{address}</Text>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={rating}
            starColor={'black'}
            starSize={15}
          />
          <Button
            onPress={() => {}}
            title='Select'>
          </Button>
        </View>
      </View>
    );
  }
}

RestaurantRow.propTypes = propTypes;