import React from 'react';
import { View, Text, StyleSheet, Image, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { Colors, PANTONE5487, PANTONE7546 } from '../constants/Colors';
import { assets } from './Assets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { headerTitle } from '../constants/Constants';
import { SvgXml } from 'react-native-svg';
import { settings, sync } from './Icons';

interface AppHeaderProps {
  title: string;
  showLogo?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, showLogo = true }) => {
  const logoSource = (assets as any).logo;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.outerContainer, { paddingTop: insets.top }]}>
      {/* Screen Header */}
      <View style={styles.innerContainer}>
        <View style={styles.blankView} />
        <Text style={styles.titleText}>{headerTitle}</Text>
      </View>
      <View style={styles.iconsContainer}>
        {/* Settings */}
        <TouchableOpacity
          activeOpacity={0.7}
        >
          <SvgXml xml={settings} color={Colors.white} height={20} width={20} />
        </TouchableOpacity>
        {/* Offline Sync Icon */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ marginLeft: 10 }}
        >
          <SvgXml xml={sync} color={Colors.white} height={23} width={23} />
        </TouchableOpacity>
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
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  innerContainer: {
    padding: 10,
    flex: 0.98,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10,
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
  blankView: {
    borderWidth: 1,
    borderColor: PANTONE5487,
    backgroundColor: PANTONE5487,
    borderRadius: 6,
    height: 25,
    width: 25,
  },
  iconsContainer: {
    position: 'absolute',
    right: 10,
    top: Dimensions.get('window').height * 0.085,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default AppHeader;
