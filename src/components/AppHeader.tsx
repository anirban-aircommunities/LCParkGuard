import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { Colors, PANTONE7546 } from '../constants/Colors';
import { assets } from './Assets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { headerTitle } from '../constants/Constants';

interface AppHeaderProps {
  title: string;
  showLogo?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, showLogo = true }) => {
  const logoSource = (assets as any).logo;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.outerContainer, {paddingTop: insets.top}]}>
      <View style={styles.innerContainer}>
        <Image
          source={logoSource}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.titleText}>{headerTitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PANTONE7546,
    width: '100%',
  },
  innerContainer: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 20,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    ...Platform.select({
      ios: {
        shadowColor: Colors.white,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
    }),
  },
});

export default AppHeader;
