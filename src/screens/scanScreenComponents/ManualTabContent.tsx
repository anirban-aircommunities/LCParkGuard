import React, { Fragment, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { addToTowingQueue } from '../../redux/slices/towingQueueSlice';
import { SvgXml } from 'react-native-svg';
import { locationPinIcon } from '../../components/Icons';
import UserInteractionItem from '../../components/UserInteractionItem';
import CustomButton from '../../components/CustomButton';
import VehicleVerificationCardView from './VehicleVerificationCardView';

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
  // const currentVehicle = useSelector((state: any) => state?.vehicle?.currentVehicle);
  const {
    properties,
    selectedProperty,
    currentVehicle,
    registeredVehicles,
    selectProperty,
    checkVehicle,
    loading,
    clearCurrentVehicle,
  } = useScanViewModel();

  const showVerificationResult = registeredVehicles?.findIndex((item: any) => (item?.licensePlate?.trim() == currentVehicle?.licensePlate)) != -1;

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
  return (
    <Fragment>
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
          iconColor={Colors.white}
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
      </View>
      {/* Vehicle Verification Card View */}
      {licensePlate.trim() != '' && <VehicleVerificationCardView
        isRegistered={showVerificationResult}
      />}
    </Fragment>
  );
};

export default ManualTabContent;

const styles = StyleSheet.create({
  vehicleCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.border,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
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
