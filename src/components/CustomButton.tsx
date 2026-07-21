import React, { Fragment } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { SvgXml } from 'react-native-svg';

type CustomButtonProps = {
  key?: number | string;
  icon?: string;
  iconSize?: number;
  label?: string;
  onPress?: () => void;
  buttonStyle?: any;
  labelStyle?: any;
  iconColor?: string;
  disabled?: boolean | undefined | null;
  loading?: boolean;
  iconStyle?: any;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  key,
  icon,
  iconSize,
  label,
  onPress,
  buttonStyle,
  labelStyle,
  iconColor,
  disabled,
  loading,
  iconStyle
}: any) => (
  <TouchableOpacity
    activeOpacity={0.7}
    key={key}
    style={[styles.container, styles.shadow, buttonStyle]}
    onPress={onPress}
    disabled={disabled}
  >
    {
      loading ? (
        <ActivityIndicator color={Colors.white} />
      ) :
        <Fragment>
          <SvgXml xml={icon} height={iconSize ? iconSize : 20} width={iconSize ? iconSize : 20} color={iconColor} style={iconStyle}/>
          {label && <Text style={[styles.labelText, labelStyle]}>{label}</Text>}
        </Fragment>
    }
  </TouchableOpacity>
);

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
