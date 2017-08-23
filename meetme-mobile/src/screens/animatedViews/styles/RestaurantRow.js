import EStyleSheet from 'react-native-extended-stylesheet';
import Colors from '../../../../constants/Colors';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row'
  },
  imageContainer: {
    height: 150,
    width: 150,
    padding: 20
  },
  image: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'gainsboro'
  },
  infoContainer: {
    flex: 3,
    padding: 10
  },
  name: {
    fontSize: 13,
    fontWeight: 'bold',
    marginVertical: 4
  },
  address: {
    fontSize: 10,
    color: 'gray',
    marginBottom: 4
  },
  button: {
    flex: 4,
    padding: 0,
    margin: 0
  }
});

export default styles;