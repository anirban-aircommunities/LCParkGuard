import React from 'react';
import { Image } from 'react-native';
import { assets } from './Assets';

interface TabBarIconProps {
  name: string;
  color: string;
  size?: number;
  focused?: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color, size = 24, focused = false }) => {
  const iconSource =
    name === 'scan'
      ? assets.camera
      : name === 'towing'
        ? assets.shipping
        : assets.notebook;

  return (
    <Image
      source={iconSource}
      style={{
        width: size,
        height: size,
        tintColor: color,
        opacity: focused ? 1 : 0.55,
      }}
      resizeMode="contain"
    />
  );
};

export default TabBarIcon;
