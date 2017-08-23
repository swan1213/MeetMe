import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';

import Colors from '../../../constants/Colors';
import styles from './styles/CreateMeetupScreen';

class CreateMeetupScreen extends Component {
  static navigationOptions = {
    title: 'Create hangout',
    header: ({ goBack }) => {
      const style = { backgroundColor: Colors.whiteColor };
      const titleStyle = { color: Colors.blackColor };
      const left = (
        <TouchableOpacity style={styles.iconClose} onPress={() => goBack()}>
          <MaterialIcons 
            name="close"
            size={30}
            color="Colors.blackColor"/>
        </TouchableOpacity>
      )

      return { style, titleStyle, left };
    }
  }

  state = {
    isDateTimePickerVisible: false
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true })

  _handleDateTimePicker = () => this.setState({ isDateTimePickerVisible: false })

  _handleDatePicked = date => {
    this.setState({ date });
    this._handleDateTimePicker();
  }

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <View style={styles.item}>
            <FormLabel fontFamily="catamaran">Title</FormLabel>
            <FormInput
              selectionColor={Colors.blackColor}
            />
          </View>
          <View style={styles.item}>
            <FormLabel fontFamily="catamaran">Description</FormLabel>
            <FormInput
              selectionColor={Colors.blackColor}
              multiline
            />
          </View>
          <View style={styles.item}>
            <Button
              onPress={this._showDateTimePicker}
              title="Not today? Then pick a day!"
              fontFamily="catamaran"
              raised
            />
          </View>
          <View style={styles.buttonCreate}>
            <Button
              backgroundColor={Colors.darkBlueColor}
              title="Create the hangout!"
              fontFamily="catamaran"
              raised
            />
          </View>
        </View>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._handleDateTimePicker}
          mode="datetime"
        />
      </View>
    );
  }
}

export default CreateMeetupScreen;