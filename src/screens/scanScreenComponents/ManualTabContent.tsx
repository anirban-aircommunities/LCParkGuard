import React from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, PANTONE5487 } from '../../constants/Colors';
import { useScanViewModel } from '../../viewmodels/ScanViewModel';
import { scanTexts } from '../../constants/Constants';
import { useDispatch } from 'react-redux';
import { addToTowingQueue } from '../../redux/slices/towingQueueSlice';
import { SvgXml } from 'react-native-svg';
import { locationPinIcon } from '../../components/Icons';
import UserInteractionItem from '../../components/UserInteractionItem';
import CustomButton from '../../components/CustomButton';

type ManualTabContentProps = {
  licensePlate?: string;
  parkingSpot?: string;
  setLicensePlate?: (text: any) => void;
  setParkingSpot?: (text: any) => void;
  setHasAddedToHistory?: (text: any) => void;
  setHasSentToTowing?: (text: any) => void;
  setIsScanning?: (text: any) => void;
  setCapturedImage?: (text: any) => void;
  setIsProcessing?: (text: any) => void;
  setInputMethod?: (text: any) => void;
  setIsTextResidentModalVisible?: (text: any) => void;
};

const ManualTabContent: React.FC<ManualTabContentProps> = ({
  licensePlate,
  parkingSpot,
  setLicensePlate,
  setParkingSpot,
  setHasAddedToHistory,
  setHasSentToTowing,
  setIsScanning,
  setCapturedImage,
  setIsProcessing,
  setInputMethod,
  setIsTextResidentModalVisible,
}: any) => {
  const dispatch = useDispatch();
  const {
    properties,
    selectedProperty,
    selectProperty,
    checkVehicle,
    loading,
    currentVehicle,
    clearCurrentVehicle,
  } = useScanViewModel();

  const showVerificationResult =
    !!currentVehicle &&
    licensePlate.trim().toUpperCase() ===
      currentVehicle.licensePlate.toUpperCase();

  const handleCheckAuthorization = () => {
    if (licensePlate && selectedProperty) {
      checkVehicle(licensePlate, parkingSpot || '');
    } else {
      Alert.alert(
        'Missing Information',
        'Please enter license plate and select a property.'
      );
    }
  };

  const handleClear = () => {
    // Clear all text inputs
    setLicensePlate('');
    setParkingSpot('');

    // Clear vehicle state
    clearCurrentVehicle();

    // Reset all flags
    setHasAddedToHistory(false);
    setHasSentToTowing(false);

    // Reset scan state to default
    setIsScanning(false);
    setCapturedImage(null);
    setIsProcessing(false);

    // Reset to default input method (manual tab)
    setInputMethod(scanTexts.manual);
  };

  const handleTextResident = () => {
    if (!currentVehicle) {
      return;
    }
    setIsTextResidentModalVisible(true);
  };

  const handleSendToTowingFromScan = () => {
    if (!currentVehicle || !selectedProperty) {
      return;
    }

    const towingQueueItem = {
      id: Date.now().toString(),
      licensePlate: currentVehicle.licensePlate,
      parkingSpot: currentVehicle.parkingSpot,
      propertyName: selectedProperty.name,
      address: selectedProperty.address,
      towingCompany: selectedProperty.towingCompany,
      towingPhone: selectedProperty.towingPhone,
      addedAt: new Date().toISOString(),
      status: 'pending' as const,
    };

    dispatch(addToTowingQueue(towingQueueItem));

    // Show alert that item was added
    Alert.alert('Success', 'Added in queue', [{ text: 'OK' }]);

    // Clear all data and reset to default state
    handleClear();
  };

  const renderVerificationPanel = () => {
    if (!showVerificationResult || !currentVehicle) {
      return null;
    }

    const isAuthorized = currentVehicle.status === 'registered';

    return (
      <View style={styles.verificationCard}>
        <View style={styles.verificationMessageRow}>
          <Text
            style={[
              styles.verificationStatusIcon,
              isAuthorized
                ? styles.authorizedStatusIcon
                : styles.unauthorizedStatusIcon,
            ]}
          >
            {isAuthorized ? '✓' : '✗'}
          </Text>
          <Text style={styles.verificationMessage}>
            {isAuthorized
              ? 'This vehicle is authorized for this property.'
              : "We don't recognize this license plate."}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.okButton} onPress={handleClear}>
            <Text style={styles.actionButtonIcon}>✓</Text>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
          {!isAuthorized && (
            <TouchableOpacity
              style={styles.textResidentButton}
              onPress={handleTextResident}
            >
              <Text style={styles.actionButtonIcon}>💬</Text>
              <Text style={styles.textResidentButtonText}>Text Resident</Text>
            </TouchableOpacity>
          )}
        </View>

        {!isAuthorized && (
          <TouchableOpacity
            style={styles.sendToTowingButtonFull}
            onPress={handleSendToTowingFromScan}
          >
            <Text style={styles.actionButtonIcon}>!</Text>
            <Text style={styles.sendToTowingButtonText}>
              Send to Towing Queue
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    <View style={styles.vehicleCard}>
      {/* Text Field */}
      <UserInteractionItem
        labelText={scanTexts.licensePlateTextField}
        value={licensePlate}
        onChange={setLicensePlate}
        interactionType="textbox"
        haveItemHeader  
        placeholder={scanTexts.licensePlatePlaceholder}
        all={undefined}
        unauthorized={undefined}
        valid={undefined}
        autoCapitalize="characters"
        returnKeyType="done"
        whiteBackground
      />
      {/* Check Vehicle Button */}
      <CustomButton
        icon={locationPinIcon.white}
        label={scanTexts.checkVehicle}
        onPress={handleCheckAuthorization}
        buttonStyle={[
          styles.checkVehicleButton,
          (loading || !licensePlate.trim()) &&
            styles.checkVehicleButtonDisabled,
        ]}
        labelStyle={styles.checkVehicleButtonText}
        disabled={loading || !licensePlate.trim() || showVerificationResult}
        loading={loading}
      />
      {renderVerificationPanel()}
    </View>
  );
};

export default ManualTabContent;

const styles = StyleSheet.create({
  vehicleCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  plateInput: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    letterSpacing: 1,
  },
  checkVehicleButton: {
    backgroundColor: PANTONE5487,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 0
  },
  checkVehicleButtonDisabled: {
    opacity: 0.6,
  },
  checkVehicleIcon: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  checkVehicleButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold'
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 8,
    fontWeight: '500',
  },
  verificationCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  verificationMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  verificationStatusIcon: {
    fontSize: 18,
    fontWeight: '700',
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 10,
    overflow: 'hidden',
  },
  authorizedStatusIcon: {
    color: Colors.white,
    backgroundColor: '#4CAF50',
  },
  unauthorizedStatusIcon: {
    color: Colors.white,
    backgroundColor: '#F44336',
  },
  verificationMessage: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  okButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  okButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  textResidentButton: {
    flex: 1,
    backgroundColor: Colors.tabPantone7546,
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  textResidentButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  sendToTowingButtonFull: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  sendToTowingButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtonIcon: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
