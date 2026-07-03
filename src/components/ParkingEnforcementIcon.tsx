import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Colors, PANTONE7546 } from '../constants/Colors';

interface ParkingEnforcementIconProps {
  size?: number;
}

const ParkingEnforcementIcon: React.FC<ParkingEnforcementIconProps> = ({
  size = 120,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <Circle cx="60" cy="60" r="56" fill={Colors.cardBackground} />
        <Circle cx="60" cy="60" r="56" stroke={PANTONE7546} strokeWidth="3" />
        <Path
          d="M60 18 L92 32 V58 C92 78 78 94 60 102 C42 94 28 78 28 58 V32 Z"
          fill={PANTONE7546}
        />
        <Rect x="44" y="38" width="32" height="44" rx="4" fill={Colors.white} />
        <Path
          d="M56 48 H68 C73 48 76 51 76 56 C76 61 73 64 68 64 H60 V72 H56 V48 Z M60 52 V60 H67 C70 60 72 58 72 56 C72 54 70 52 67 52 H60 Z"
          fill={PANTONE7546}
        />
        <Path
          d="M38 88 H82"
          stroke={Colors.secondary}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <Circle cx="42" cy="88" r="5" fill={Colors.secondary} />
        <Circle cx="78" cy="88" r="5" fill={Colors.secondary} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ParkingEnforcementIcon;
