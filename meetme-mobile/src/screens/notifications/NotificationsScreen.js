import React, { Component } from 'react';
import { ScrollView, View, Text, Button, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import styles from './styles/NotificationsScreen';
import {
  Card,
  CardImage,
  CardTitle,
  CardContent,
  CardAction
} from 'react-native-card-view';

class NotificationsScreen extends Component {
  static navigationOptions = {
    title: 'NOTIFICATIONS',
    header: {
      style: {
        backgroundColor: Colors.whiteColor
      }
    },
    
    tabBar: {
      icon: ({ tintColor }) => (
        <MaterialIcons 
          name="notifications"
          size={25}
          color={tintColor}
        />
      )
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
        <Text>Basic</Text>
          <Card>
            <CardTitle>
              <Text style={styles.title}>Card Title</Text>
            </CardTitle>
            <CardContent>
              <Text>Content</Text>
            </CardContent>
            <CardAction >
              <Button
                style={styles.button}
                onPress={() => {}}
                title='button 1'>
              </Button>
              <Button
                style={styles.button}
                onPress={() => {}}
                title='button 2'>
              </Button>
            </CardAction>
          </Card>

          <Text>Fix width : 300</Text>
          <Card styles={{card: {width: 300}}}>
            <CardTitle>
              <Text style={styles.title}>Card Title</Text>
            </CardTitle>
            <CardContent>
              <Text>Content</Text>
            </CardContent>
            <CardAction >
              <Button
                style={styles.button}
                onPress={() => {}}
                title='button 1'>
              </Button>
              <Button
                style={styles.button}
                onPress={() => {}}
                title='button 2'>
              </Button>
            </CardAction>
          </Card>

          <Text>Card Image + Card Title + Card Content + Card Action</Text>
          <Card>
            <CardImage>
              <Image
                style={{width: 300, height: 200}}
                source={{uri: 'https://getmdl.io/assets/demos/image_card.jpg'}}
              />
            </CardImage>
            <CardTitle>
              <Text style={styles.title}>Card Title</Text>
            </CardTitle>
            <CardContent>
              <Text>Content</Text>
              <Text>Content</Text>
              <Text>Content</Text>
              <Text>Content</Text>
              <Text>Content</Text>
              <Text>Content</Text>
            </CardContent>
            <CardAction>
              <Button
                style={styles.button}
                onPress={() => {}}
                title='button 1'>
              </Button>
              <Button
                style={styles.button}
                styleDisabled={{color: 'red'}}
                onPress={() => {}}
                title='button 2'>
              </Button>
            </CardAction>
          </Card>

          <Text>Card Image</Text>
          <Card>
            <CardImage>
              <Image
                style={{width: 256, height: 256}}
                source={{uri: 'https://getmdl.io/assets/demos/image_card.jpg'}}
              >
                <Text style={[styles.title, {alignSelf: 'center'}]}>Beautiful Girl</Text>
              </Image>
            </CardImage>
          </Card>

          <Text>Card Image</Text>
          <Card>
            <CardImage>
              <Image
                style={{width: 256, height: 256}}
                source={{uri: 'https://static.pexels.com/photos/59523/pexels-photo-59523.jpeg'}}
              />
            </CardImage>
          </Card>
        </View>
      </ScrollView>
    );
  }
}


export default NotificationsScreen;