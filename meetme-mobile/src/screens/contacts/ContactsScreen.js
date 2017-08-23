'use strict';

import React, { Component } from 'react';
import { View, Text, ListView, Button, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import styles from './styles/ContactsScreen';
import { Contacts } from 'expo';

import {
  Card,
  CardImage,
  CardTitle,
  CardContent,
  CardAction
} from 'react-native-card-view';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class ContactsScreen extends Component {
  static navigationOptions = {
    title: 'CONTACTS',
    header: ({ navigate }) => {
      const style = { backgroundColor: Colors.whiteColor };
      const right = (
        <TouchableOpacity>
          <MaterialIcons
            name="navigate-next"
            size={30}
            color={Colors.blackColor}
            />
        </TouchableOpacity>
      );

      return {style, right };
    },
    
    tabBar: {
      icon: ({ tintColor }) => (
        <MaterialIcons 
          name="contacts"
          size={25}
          color={tintColor}
        />
      )
    }
  }

  constructor() {
    super();
    
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
  }

  componentDidMount() {
    this.getAllContacts();
  }

  async getAllContacts() {
    const contacts = await Contacts.getContactsAsync([
      Contacts.PHONE_NUMBERS,
      Contacts.EMAILS
    ]);
    if (contacts.length > 0) {
      this.setState({dataSource: ds.cloneWithRows(contacts)});  
    }

    return contacts;
  }

  render() {
    return (
      <ListView contentContainerStyle={styles.listView} dataSource={this.state.dataSource} renderRow={(rowData) =>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              style={{width: 30, height: 30, borderRadius: 15}}
              source={{uri: 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-contact-128.png'}}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{rowData.name}</Text>
            <Text style={styles.call}>
              <MaterialIcons name="call" style={styles.emailIcon}/> Call: {rowData.email}
            </Text>
            <Text style={styles.location}>
              <MaterialIcons name="home" style={styles.locationIcon}/> Home: {rowData.address}
            </Text>
            <Text style={styles.location}>
              <MaterialIcons name="work" style={styles.locationIcon}/> Work: {rowData.address}
            </Text>
          </View>
        </View>
        }
        enableEmptySections={true}
      />
    );
  }
}

export default ContactsScreen;