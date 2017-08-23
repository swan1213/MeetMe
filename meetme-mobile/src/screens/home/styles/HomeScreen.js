import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '$whiteColor'
  },
  topContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mapContainer: {
    flex: 0.8
  },
  bottomContainer: {
    flex: 1
  },
  iconAdd: {
    marginLeft: 10
  }
});

export default styles;