import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { headerTitle, scanHistoryTexts, scanTypes, timePeriodArray } from '../constants/Constants';
import EmptyListComponent from '../components/EmptyListComponent';
import CustomButton from '../components/CustomButton';
import { checkboxes, downArrowIcon, messaging, propertySelectionIcon } from '../components/Icons';
import ScanHistoryCardView from '../components/ScanHistoryCardView';
import * as scanHistoryData from "../demo/scanHistoryData.json";
import UserInteractionItem from '../components/UserInteractionItem';
import { useSelector } from 'react-redux';
import AppHeader from '../components/AppHeader';

const ScanHistoryScreen = () => {
  const scanHistoryItems = useSelector((state: any) => state?.scanHistory?.items);
  const [licensePlate, changeLicensePlate] = useState("");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(timePeriodArray[0]);
  const [selectedTab, setSelectedTab] = useState(scanTypes[0]);
  const [emailToSelfRecordCount, setEmailToSelfRecordCount] = useState(scanHistoryData.list.length);

  // Select Tab
  const selectTab = (item: any, index: number) => {
    setSelectedTab(item);
  }

  // Count Email-To-Self Record Count in a tab
  const getRecordCount = () => {
    if(selectedTab.name == "All") {
      setEmailToSelfRecordCount(scanHistoryData.list.length);
    } else {
      setEmailToSelfRecordCount(scanHistoryData.list?.filter(item => (item as any)?.status == selectedTab.dataType)?.length);
    }
  }
  // On change of text in license plate textfield
  useEffect(() => {
    setSelectedTab(scanTypes[0]);
  }, [licensePlate]);
  // On change of Time Period 
  useEffect(() => {
    setSelectedTab(scanTypes[0]);
  }, [selectedTimePeriod]);
  // On Tab Change
  useEffect(() => {
    getRecordCount();
  }, [selectedTab])


  return (
    <ScrollView style={styles.outerContainer}>
      <AppHeader title={headerTitle} showLogo/>
      <View style={styles.innerContainer}>
        {/* Search License Plate Textfield */}
        <UserInteractionItem
          labelText={scanHistoryTexts.licensePlateTextField}
          iconName={propertySelectionIcon.colored}
          value={licensePlate}
          onChange={text => changeLicensePlate(text)}
          interactionType="textbox"
          haveItemHeader
          placeholder={scanHistoryTexts.licensePlatePlaceholder}
          all={scanHistoryData.list.length}
          unauthorized={scanHistoryData.list?.filter(item => (item as any)?.status == scanHistoryTexts.unregistered).length}
          valid={scanHistoryData.list?.filter(item => (item as any)?.status == scanHistoryTexts.registered).length}
        />
        {/* Select Time Period Dropdown */}
        <UserInteractionItem
          labelText={scanHistoryTexts.timePeriodLabel}
          iconName={propertySelectionIcon.colored}
          interactionType="dropdown"
          haveItemHeader
          dropdownItems={timePeriodArray}
          selectedItem={selectedTimePeriod}
          setSelectedItem={setSelectedTimePeriod}
          all={scanHistoryData.list.length}
          unauthorized={scanHistoryData.list?.filter(item => (item as any)?.status == scanHistoryTexts.unregistered).length}
          valid={scanHistoryData.list?.filter(item => (item as any)?.status == scanHistoryTexts.registered).length}
        />
        {/* Select Scan Type */}
        <UserInteractionItem
          interactionType="tabs"
          selectedTab={selectedTab}
          setSelectedTab={selectTab}
          all={scanHistoryData.list.length}
          unauthorized={scanHistoryData.list?.filter(item => (item as any)?.status == scanHistoryTexts.unregistered).length}
          valid={scanHistoryData.list?.filter(item => (item as any)?.status == scanHistoryTexts.registered).length}
        />
      </View>
      {/* Card View */}
      <FlatList
        data={scanHistoryItems}
        /* Empty List Component */ 
        ListEmptyComponent={
          <EmptyListComponent emptyText={scanHistoryTexts.emptyScanText} />
        }
        renderItem={({ item, index }) => (
          (
            !selectedTab.dataType ||
            (selectedTab.dataType && item?.status == selectedTab.dataType) 
          ) &&
          <ScanHistoryCardView item={item} statusIconName={messaging} statusIconSize={15} />
        )}
      />
      {/* Email-to-self button */}
      <CustomButton icon={propertySelectionIcon.colored} label={`${scanHistoryTexts.emailToSelf} (${emailToSelfRecordCount} ${scanHistoryTexts.record}${emailToSelfRecordCount == 1 ? "" : "s"})`} onPress={() => Alert.alert("", scanHistoryTexts.emailSentSuccessfully, [{ text: "Okay" }])} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  innerContainer: {
    padding: 10,
    backgroundColor: Colors.white,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusIcon: {
    width: 25,
    height: 25,
    borderRadius: 16,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusIconError: {
    backgroundColor: Colors.error,
  },
  statusIconText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemInfo: {
    flex: 1,
  },
  licensePlate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  separator: {
    fontWeight: 'normal',
    color: Colors.textSecondary,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTag: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTagError: {
    backgroundColor: Colors.error,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '400',
    color: Colors.white,
  },
  statusTagTextError: {
    color: Colors.white,
  },
  sourceTag: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: Colors.background,
  },
  sourceTagText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  sentToTowingTag: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
  },
  sentToTowingTagText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '500',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.border,
  },
  manualButton: {
    backgroundColor: Colors.white,
  },
  actionButtonText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  actionButtonTextDisabled: {
    color: Colors.textLight,
  },
  manualButtonText: {
    color: Colors.textPrimary,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textLight,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

export default ScanHistoryScreen;
