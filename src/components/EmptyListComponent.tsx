import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { SvgXml } from 'react-native-svg';
import { propertySelectionIcon } from './Icons';
import React from 'react';

type EmptyListComponentProps = {
  emptyText?: string;
};

const EmptyListComponent: React.FC<EmptyListComponentProps> = ({
  emptyText,
}: any) => (
  <View style={styles.outerContainer}>
    <View style={styles.innerContainer}>
      <SvgXml
        xml={propertySelectionIcon.colored}
        height={50}
        width={50}
        color={Colors.grey1}
      />
      <Text style={styles.emptyTextStyle}>{emptyText}</Text>
    </View>
  </View>
);

export default EmptyListComponent;

const styles = StyleSheet.create({
  outerContainer: {
    padding: 15,
  },
  innerContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.grey1,
    borderRadius: 15,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextStyle: {
    marginTop: 10,
    fontSize: 16,
  },
});
