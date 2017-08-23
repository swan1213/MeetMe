import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import { LoadingScreen } from '../../commons';

import Colors from '../../../constants/Colors';
import styles from './styles/ChatScreen';

class ChatScreen extends Component {
  static navigationOptions = {
    title: 'CHAT',
    header: {
      style: {
        backgroundColor: Colors.whiteColor
      }
    },

    tabBar: {
      icon: ({ tintColor }) => (
        <MaterialIcons 
          name="chat"
          size={25}
          color={tintColor}
        />
      )
    }
  }

  render() {
    return (
      <View style={styles.root}>
        <Text>Chat</Text>
      </View>
    );
  }
}

export default ChatScreen;