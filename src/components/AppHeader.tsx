import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { Colors } from '../constants/Colors';
import { assets } from './Assets';

interface AppHeaderProps {
  title: string;
  showLogo?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, showLogo = true }) => {
  // Try to use logo from assets, fallback to null if not available
  const logoSource = (assets as any).logo;

  // If no title provided, just show logo (for headerLeft)
  if (!title) {
    return showLogo && logoSource ? (
      <View style={styles.logoContainer}>
        <Image
          source={logoSource}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    ) : null;
  }

  return (
    <View style={styles.headerContainer}>
      {showLogo && logoSource && (
        <View style={styles.logoContainer}>
          <Image
            source={logoSource}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    marginHorizontal: 0,
    width: '100%',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
});

export default AppHeader;
