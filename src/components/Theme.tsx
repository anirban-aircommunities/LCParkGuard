import { StyleSheet } from 'react-native';
import { Colors, PANTONE664, PANTONE7546 } from '../constants/Colors';
// import { fontConstants } from './Constants';

export const darkModeStyles = StyleSheet.create({
  background: {
    backgroundColor: Colors.black,
  },
  border: {
    borderColor: Colors.black,
  },
  whiteBorder: {
    borderColor: Colors.white,
  },
  backgroundBorder: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  visibleBackground: {
    backgroundColor: PANTONE664,
  },
  text: {
    color: Colors.white,
  },
  textWithRegularFont: {
    color: Colors.white,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  textWithBoldFont: {
    color: Colors.white,
    fontWeight: 'bold'
  },
  blueText: {
    color: PANTONE7546,
  },
});
