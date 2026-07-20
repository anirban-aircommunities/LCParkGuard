import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, PANTONE7546 } from '../constants/Colors';
import UserInteractionItem from './UserInteractionItem';
import { propertySelectionIcon } from './Icons';
import { ScanHistoryItem } from '../models/ScanHistory';
import { SvgXml } from 'react-native-svg';
import { scanHistoryTexts } from '../constants/Constants';

type ScanHistoryCardViewProps = {
  checkbox?: boolean;
  iconName?: string;
  iconSize?: number;
  labelIconAdditionalStyle?: any;
  item?: any;
  hasBottomButtons?: boolean;
  selectItem?: () => void;
  markAsTowed?: () => void;
  markAsResolved?: () => void;
  statusIconName?: string;
  statusIconSize?: number;
  towButtonLabel?: string;
};

const ScanHistoryCardView: React.FC<ScanHistoryCardViewProps> = ({
  checkbox,
  iconName,
  iconSize,
  labelIconAdditionalStyle,
  item,
  hasBottomButtons,
  selectItem,
  markAsTowed,
  markAsResolved,
  statusIconName,
  statusIconSize,
  towButtonLabel,
}: any) => (
  <View style={styles.outerContainer}>
    {/* Card Header */}
    <View style={styles.rowStyle}>
      {checkbox && (
        // Card Header Label Icon
        <TouchableOpacity
          style={[styles.iconContainer, labelIconAdditionalStyle]}
          onPress={selectItem}
        >
          <SvgXml xml={iconName} height={iconSize} width={iconSize} />
        </TouchableOpacity>
      )}
      <View style={styles.frontRow}>
        {/* Card Header Label Text */}
        <Text
          style={[
            styles.heading,
            checkbox && { paddingLeft: 10 },
            item?.texted && { width: '77%' },
          ]}
        >
          {(item as any)?.licensePlate}
        </Text>
        {/* Card Header Label Side View */}
        <View style={[styles.rowStyle, styles.rowBackground]}>
          {/* Card Header Label Side Icon */}
          <SvgXml
            xml={statusIconName}
            height={statusIconSize}
            width={statusIconSize}
            color={Colors.white}
          />
          {/* Card Header Label Side Text */}
          <Text style={[styles.scannedText]}>
            {item?.texted ? scanHistoryTexts.texted : scanHistoryTexts.sent}
          </Text>
        </View>
      </View>
    </View>
    {/* Owner - Parking Spot */}
    <UserInteractionItem
      labelText={`${(item as any)?.carOwner} - Unit ${
        (item as any)?.parkingSpot
      }`}
      // iconName={propertySelectionIcon.colored}
      haveItemHeader
      iconSize={16}
      labelSize={13}
      labelTextAdditionalStyle={styles.subText}
      labelIconAdditionalStyle={styles.subItem}
      labelContainerAdditionalStyle={styles.subContainer}
      all={undefined}
      unauthorized={undefined}
      valid={undefined}
    />
    {/* Location */}
    <UserInteractionItem
      labelText={`Current Location - Unit ${(item as any)?.address}`}
      // iconName={propertySelectionIcon.colored}
      haveItemHeader
      iconSize={16}
      labelSize={13}
      labelTextAdditionalStyle={styles.subText}
      labelIconAdditionalStyle={styles.subItem}
      labelContainerAdditionalStyle={styles.subContainer}
      all={undefined}
      unauthorized={undefined}
      valid={undefined}
    />
    {/* Scanned Timestamp */}
    <UserInteractionItem
      labelText={(item as any)?.scannedAt}
      // iconName={propertySelectionIcon.colored}
      haveItemHeader
      iconSize={16}
      labelSize={13}
      labelTextAdditionalStyle={styles.subText}
      labelIconAdditionalStyle={styles.subItem}
      labelContainerAdditionalStyle={styles.subContainer}
      all={undefined}
      unauthorized={undefined}
      valid={undefined}
    />
    {/* User who has scanned */}
    <UserInteractionItem
      labelText={`Entered by: ${(item as any)?.propertyName}`}
      // iconName={propertySelectionIcon.colored}
      haveItemHeader
      iconSize={16}
      labelSize={13}
      labelTextAdditionalStyle={styles.subText}
      labelIconAdditionalStyle={styles.subItem}
      labelContainerAdditionalStyle={styles.subContainer}
      all={undefined}
      unauthorized={undefined}
      valid={undefined}
    />
    {/* Description */}
    <UserInteractionItem
      labelText={`${(item as any)?.description}`}
      // iconName={propertySelectionIcon.colored}
      haveItemHeader
      iconSize={16}
      labelSize={13}
      item={item}
      isDesc
      labelTextAdditionalStyle={styles.subText}
      labelIconAdditionalStyle={styles.subItem}
      labelContainerAdditionalStyle={styles.subContainer}
      numberOfLines={2}
      all={undefined}
      unauthorized={undefined}
      valid={undefined}
    />
    {/* Mark buttons */}
    {hasBottomButtons && (
      <View style={styles.bottomButtonContainerStyle}>
        {/* "Mark as Towed" button */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.bottomButtonStyle}
          onPress={markAsTowed}
        >
          <Text style={styles.bottomButtonTextStyle}>{towButtonLabel}</Text>
        </TouchableOpacity>
        {/* "Mark as Resolved" button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={markAsResolved}
          style={[
            styles.bottomButtonStyle,
            { backgroundColor: 'rgba(0, 255, 0, 0.24)' },
          ]}
        >
          <Text style={styles.bottomButtonTextStyle}>Mark as Resolved</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

export default ScanHistoryCardView;

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.grey1,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 15,
  },
  frontRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    width: '70%',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scannedText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 5,
  },
  subText: { fontWeight: '300', paddingLeft: 0, color: '#000', fontSize: 16 },
  subItem: { padding: 0, alignItems: 'flex-start' },
  subContainer: { marginTop: 10 },
  iconContainer: {
    borderRadius: 15,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  bottomButtonStyle: {
    flex: 0.48,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: 10,
  },
  bottomButtonTextStyle: {
    color: '#000',
  },
  rowStyle: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowBackground: {
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PANTONE7546,
  },
});
