import EStyleSheet from 'react-native-extended-stylesheet';
import Colors from '../../../../constants/Colors';

const styles = EStyleSheet.create({
  root: {
    backgroundColor: Colors.whiteColor,
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: 300
  },
  item: {
    marginVertical: 20
  },
  iconClose: {
    marginLeft: 10
  },
  buttonCreate: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30
  }
});

export default styles;