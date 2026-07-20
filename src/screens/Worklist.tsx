import React, { Fragment, useState } from 'react';
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
import { Colors, PANTONE428, PANTONE664 } from '../constants/Colors';
import { useTowingQueueViewModel } from '../viewmodels/TowingQueueViewModel';
import { TowingQueueItem } from '../models/TowingQueue';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { markAsSentToTowingCompany } from '../redux/slices/scanHistorySlice';
import {
  removeFromTowingQueue,
  selectItems,
} from '../redux/slices/towingQueueSlice';
import AppFooter from '../components/AppFooter';
import UserInteractionItem from '../components/UserInteractionItem';
import {
  checkboxes,
  downArrowIcon,
  locationPinIcon,
  messaging,
  propertySelectionIcon,
} from '../components/Icons';
import * as scanHistoryData from '../demo/scanHistoryData.json';
import EmptyListComponent from '../components/EmptyListComponent';
import {
  headerTitle,
  scanHistoryTexts,
  towingQueueTexts,
} from '../constants/Constants';
import ScanHistoryCardView from '../components/ScanHistoryCardView';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../components/AppHeader';

const Worklist = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const towingQueueItems = useSelector(
    (state: any) => state?.towingQueue?.items
  );
  const towingQueueSelectedItems = useSelector(
    (state: any) => state?.towingQueue?.selectedItems
  );
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // const selectAll = () => {
  //   if (selectedItems.size === items.length) {
  //     setSelectedItems(new Set());
  //   } else {
  //     setSelectedItems(new Set(items.map((item) => item.id)));
  //   }
  // };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return `Today at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderItem = ({ item }: { item: TowingQueueItem }) => (
    <View style={styles.queueItem}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleSelection((item as any)?.id)}
      >
        <View
          style={[
            styles.checkboxInner,
            selectedItems.has((item as any)?.id) && styles.checkboxChecked,
          ]}
        >
          {selectedItems.has((item as any)?.id) && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.itemContent}>
        <Text style={styles.licensePlate}>
          {item.licensePlate} - {item.parkingSpot}
        </Text>
        <Text style={styles.propertyName}>{item.propertyName}</Text>
        <Text style={styles.timeChecked}>
          Time Checked: {formatDate((item as any)?.addedAt)}
        </Text>
      </View>
    </View>
  );

  return (
    <Fragment>
      <AppHeader title={headerTitle} showLogo />
      <ScrollView style={styles.outerContainer}>
        {/* Sub Header with Select All feature */}
        {/* <View style={styles.innerContainer}>
        <UserInteractionItem
          labelText={"Towing Queue"}
          iconName={propertySelectionIcon.colored}
          haveItemHeader
          haveItemDescription={true}
          haveButton={true}
          descText={"Please select records to send to the towing company"}
          all={undefined}
          unauthorized={undefined}
          valid={undefined}
        />
        </View> */}
        {/* Worklist Items */}
        <FlatList
          data={towingQueueItems}
          ListEmptyComponent={
            // Empty List Component
            <EmptyListComponent emptyText={scanHistoryTexts.emptyScanText} />
          }
          renderItem={({ item, index }) => (
            <ScanHistoryCardView
              checkbox={false}
              // selectItem={() => dispatch(selectItems(item))}
              iconName={
                item.isChecked ? checkboxes.checked : checkboxes.unchecked
              }
              iconSize={item.isChecked ? 20 : 25}
              item={item}
              hasBottomButtons
              statusIconName={messaging}
              statusIconSize={15}
              towButtonLabel={
                item?.texted
                  ? towingQueueTexts.requestTow
                  : towingQueueTexts.markAsTowedLabel
              }
              markAsTowed={() => {
                Alert.alert('', towingQueueTexts.markedAsTowed, [
                  {
                    text: 'Ok',
                    onPress: () => navigation.navigate('ScanHistory'),
                  },
                ]);
              }}
              markAsResolved={() => {
                Alert.alert('', towingQueueTexts.markedAsResolved, [
                  {
                    text: 'Ok',
                    onPress: () => navigation.navigate('ScanHistory'),
                  },
                ]);
              }}
            />
          )}
        />
        {/* <View style={styles.header}>
          <View>
            <Text style={styles.title}>Towing Queue</Text>
            <Text style={styles.subtitle}>
              {items.length} vehicle{items.length !== 1 ? 's' : ''} pending tow notification
            </Text>
          </View>
          {items.length > 0 && (
            <TouchableOpacity style={styles.selectAllButton} onPress={selectAll}>
              <Text style={styles.selectAllText}>
                {selectedItems.size === items.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          )}
        </View> */}

        {/* {items.length > 0 ? (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No data available</Text>
            <AppFooter variant="subtle" />
          </View>
        )} */}

        {/* {items.length > 0 && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.sendButton,
                selectedItems.size === 0 && styles.actionButtonDisabled,
              ]}
              disabled={selectedItems.size === 0}
              onPress={() => {
                // Find matching scan history items by license plate and parking spot
                const selectedQueueItems = items.filter((item) => selectedItems.has(item.id));
                const scanHistoryIdsToMark: string[] = [];

                selectedQueueItems.forEach((queueItem) => {
                  const matchingHistoryItems = scanHistoryItems.filter(
                    (historyItem) =>
                      historyItem.licensePlate.toLowerCase() === queueItem.licensePlate.toLowerCase() &&
                      historyItem.parkingSpot.toLowerCase() === queueItem.parkingSpot.toLowerCase()
                  );
                  matchingHistoryItems.forEach((item) => {
                    if (!scanHistoryIdsToMark.includes(item.id)) {
                      scanHistoryIdsToMark.push(item.id);
                    }
                  });
                });

                // Mark items as sent to towing company in scan history
                if (scanHistoryIdsToMark.length > 0) {
                  dispatch(markAsSentToTowingCompany(scanHistoryIdsToMark));
                }

                // Remove selected items from towing queue
                selectedItems.forEach((id) => {
                  dispatch(removeFromTowingQueue(id));
                });

                // Clear selection
                setSelectedItems(new Set());

                Alert.alert("Success", "Notification sent to Tow Company", [{ text: "Ok" }]);
              }}>
              <Text
                style={[
                  styles.actionButtonText,
                  selectedItems.size === 0 && styles.actionButtonTextDisabled,
                ]}>
                Send to Tow Company ({selectedItems.size})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.emailButton]}>
              <Text style={[styles.actionButtonText, styles.emailButtonText]}>
                Email to Self
              </Text>
            </TouchableOpacity>
          </View>
        )} */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  innerContainer: {
    padding: 15,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  selectAllButton: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectAllText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContent: {
    flex: 1,
  },
  licensePlate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  propertyName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  timeChecked: {
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
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: Colors.white,
  },
  sendButton: {
    // backgroundColor: Colors.background,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  emailButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.border,
    alignItems: 'center',
    // paddingHorizontal: 'auto'
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  actionButtonTextDisabled: {
    color: Colors.textLight,
  },
  emailButtonText: {
    color: Colors.textPrimary,
  },
});

export default Worklist;
