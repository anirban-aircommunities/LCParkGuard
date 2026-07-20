import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { SvgXml } from 'react-native-svg';

type CustomButtonProps = {
  icon?: string;
  label?: string;
  onPress?: () => void;
  buttonStyle?: any;
  labelStyle?: any;
  iconColor?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  icon,
  label,
  onPress,
  buttonStyle,
  labelStyle,
  iconColor,
}: any) => (
  <TouchableOpacity
    activeOpacity={0.7}
    style={[styles.container, styles.shadow, buttonStyle]}
    onPress={onPress}
  >
    <SvgXml xml={icon} height={20} width={20} color={iconColor} />
    <Text style={[styles.labelText, labelStyle]}>{label}</Text>
  </TouchableOpacity>
);

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderColor: Colors.grey1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    padding: 10,
    borderRadius: 10,
  },
  labelText: {
    fontWeight: 'bold',
    paddingLeft: 10,
    color: Colors.primary,
  },
  shadow: {
    shadowOffset: { width: 0.1, height: 0.1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
});
