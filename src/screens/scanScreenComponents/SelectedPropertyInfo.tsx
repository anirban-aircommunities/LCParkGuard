import React, { Fragment, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { Colors, DARK_BLUE, LIGHT_BLUE } from '../../constants/Colors';
import { SvgXml } from 'react-native-svg';
import {
  downArrowIcon,
  propertySelectionIcon,
  upArrowIcon,
} from '../../components/Icons';
import LinearGradient from 'react-native-linear-gradient';

type SelectedPropertyInfoProps = {
  selectedProperty?: any;
};

const SelectedPropertyInfo: React.FC<SelectedPropertyInfoProps> = (
  selectedProperty: any
) => {
  const [isTowingInfoExpanded, setIsTowingInfoExpanded] = useState(false);
  return (
    <LinearGradient
      colors={[DARK_BLUE, LIGHT_BLUE]}
      style={styles.expandablePropertyCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.7, y: 0.7 }}
    >
      <View style={styles.propertyAddressRow}>
        <SvgXml
          xml={propertySelectionIcon.colored}
          color={Colors.white}
          height={20}
          width={20}
        />
        <Text style={styles.propertyAddressText}>
          {selectedProperty?.selectedProperty?.address}
        </Text>
      </View>

      <View style={styles.subContainerStyle}>
        <SvgXml
          xml={propertySelectionIcon.colored}
          color={Colors.white}
          height={20}
          width={20}
        />
        <View style={styles.rowWithSpace}>
          <Text style={styles.towingInfoTitle}>Towing Company Info</Text>
          <TouchableOpacity
            onPress={() => setIsTowingInfoExpanded(!isTowingInfoExpanded)}
            activeOpacity={0.7}
          >
            <SvgXml
              xml={
                isTowingInfoExpanded ? upArrowIcon.white : downArrowIcon.white
              }
              color={Colors.white}
              height={20}
              width={20}
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.subContainerStyle]}>
        <View style={styles.horizontalGap} />
        {isTowingInfoExpanded && (
          <View style={styles.gapAroundRow}>
            <Text style={styles.towingInfoLabel}>
              Name: {selectedProperty?.selectedProperty?.towingCompany}
            </Text>
            <Text style={styles.towingInfoLabel}>
              Phone:{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {selectedProperty?.selectedProperty?.towingPhone}
              </Text>
            </Text>
            <Text style={styles.towingInfoLabel}>
              Email: {selectedProperty?.selectedProperty?.towingEmail}
            </Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

export default SelectedPropertyInfo;

const styles = StyleSheet.create({
  expandablePropertyCard: {
    borderRadius: 10,
    marginBottom: 15,
  },
  propertyAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  propertyRowIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  propertyAddressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    paddingLeft: 10,
  },
  subContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  rowWithSpace: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  towingInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    paddingLeft: 10,
  },
  gapAroundRow: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  towingInfoLabel: {
    fontSize: 16,
    color: Colors.white,
  },
  horizontalGap: { width: 22 },
});
