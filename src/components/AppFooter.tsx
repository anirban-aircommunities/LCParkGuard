import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/Colors';
import { assets } from './Assets';

interface AppFooterProps {
  showLogo?: boolean;
  variant?: 'subtle' | 'prominent';
}

const AppFooter: React.FC<AppFooterProps> = ({ 
  showLogo = true, 
  variant = 'subtle' 
}) => {
  // Try to use logo from assets, fallback to null if not available
  const logoSource = (assets as any).logo;

  if (!showLogo || !logoSource) return null;

  return (
    <View style={[styles.footer, variant === 'subtle' && styles.footerSubtle]}>
      <Image
        source={logoSource}
        style={[
          styles.logo,
          variant === 'subtle' && styles.logoSubtle,
        ]}
        resizeMode="contain"
      />
      {variant === 'prominent' && (
        <Text style={styles.footerText}>LCParkGuard</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  footerSubtle: {
    paddingVertical: 8,
    opacity: 0.3,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoSubtle: {
    width: 24,
    height: 24,
  },
  footerText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

export default AppFooter;
