import React, { useState, useRef, useEffect, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors, PANTONE7546 } from '../constants/Colors';
import { useScanViewModel } from '../viewmodels/ScanViewModel';
import { Property } from '../models/Property';
import { useDispatch } from 'react-redux';
import { addScanHistory } from '../redux/slices/scanHistorySlice';
import { addToTowingQueue } from '../redux/slices/towingQueueSlice';
import { recognizePlate, PlateRecognizerResponse } from './plateRecognizer/plateRecognizer';
import { assets } from '../components/Assets';
import TextResidentModal from '../components/TextResidentModal';
import UserInteractionItem from '../components/UserInteractionItem';
import { keypadIcon, propertySelectionIcon, scanIcon } from '../components/Icons';
import AppHeader from '../components/AppHeader';
import { headerTitle, scanTexts } from '../constants/Constants';
import SelectedPropertyInfo from './scanScreenComponents/SelectedPropertyInfo';
import CustomButton from '../components/CustomButton';
import CameraLensComponent from './scanScreenComponents/CameraLensComponent';
import ScanTabContent from './scanScreenComponents/ScanTabContent';

// Conditionally import camera to prevent app crash if module not available
let Camera: any = null;
let useCameraDevice: any = null;

try {
  const visionCamera = require('react-native-vision-camera');
  Camera = visionCamera.Camera;
  useCameraDevice = visionCamera.useCameraDevice;
} catch (error) {
  console.warn('react-native-vision-camera not available:', error);
}

interface CameraScreenProps {
  onResult?: (result: PlateRecognizerResponse) => void;
}

const ScanScreen: React.FC<CameraScreenProps> = ({ onResult }) => {

  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [inputMethod, setInputMethod] = useState(scanTexts.manual);
  const [licensePlate, setLicensePlate] = useState('');
  const [parkingSpot, setParkingSpot] = useState('');
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [isTowingInfoExpanded, setIsTowingInfoExpanded] = useState(true);
  const [isTextResidentModalVisible, setIsTextResidentModalVisible] = useState(false);

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

  const handleCheckAuthorization = () => {
    if (licensePlate && selectedProperty) {
      checkVehicle(licensePlate, parkingSpot || '');
    } else {
      Alert.alert(
        'Missing Information',
        'Please enter license plate and select a property.',
      );
    }
  };

  // Track if we've already added this vehicle to scan history
  const [hasAddedToHistory, setHasAddedToHistory] = useState(false);
  const [hasSentToTowing, setHasSentToTowing] = useState(false);

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

  const showVerificationResult =
    !!currentVehicle &&
    licensePlate.trim().toUpperCase() === currentVehicle.licensePlate.toUpperCase();

  // Set first property as default if none selected
  useEffect(() => {
    if (properties.length > 0 && !selectedProperty) {
      selectProperty(properties[0]);
    }
  }, [properties, selectedProperty, selectProperty]);

  // Close dropdown when clicking outside (optional enhancement)
  useEffect(() => {
    if (isPropertyDropdownOpen) {
      // Close dropdown when property is selected
      // The dropdown closes in the onPress handler
    }
  }, [isPropertyDropdownOpen]);

  // Add to scan history when authorization check completes
  useEffect(() => {
    if (currentVehicle && selectedProperty && !hasAddedToHistory) {
      const scanHistoryItem = {
        id: Date.now().toString(),
        licensePlate: currentVehicle.licensePlate,
        parkingSpot: currentVehicle.parkingSpot,
        propertyName: selectedProperty.name,
        address: selectedProperty.address,
        status: currentVehicle.status,
        scannedAt: currentVehicle.scannedAt,
        source: inputMethod === scanTexts.manual ? scanTexts.manual as const : 'camera' as const,
      };

      dispatch(addScanHistory(scanHistoryItem));
      setHasAddedToHistory(true);
    }
  }, [currentVehicle, selectedProperty, dispatch, hasAddedToHistory, inputMethod]);

  // Reset hasAddedToHistory and clear vehicle when license plate changes
  useEffect(() => {
    setHasAddedToHistory(false);
    setHasSentToTowing(false);
    if (currentVehicle && currentVehicle.licensePlate !== licensePlate) {
      clearCurrentVehicle();
    }
  }, [licensePlate, currentVehicle, clearCurrentVehicle]);

  const renderCheckVehicleButton = () => {
    if (showVerificationResult) {
      return null;
    }

    return (
      <TouchableOpacity
        style={[
          styles.checkVehicleButton,
          (loading || !licensePlate.trim()) && styles.checkVehicleButtonDisabled,
        ]}
        onPress={handleCheckAuthorization}
        disabled={loading || !licensePlate.trim()}>
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <>
            <Text style={styles.checkVehicleIcon}>⌖</Text>
            <Text style={styles.checkVehicleButtonText}>Check Vehicle</Text>
          </>
        )}
      </TouchableOpacity>
    );
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
              isAuthorized ? styles.authorizedStatusIcon : styles.unauthorizedStatusIcon,
            ]}>
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
            <TouchableOpacity style={styles.textResidentButton} onPress={handleTextResident}>
              <Text style={styles.actionButtonIcon}>💬</Text>
              <Text style={styles.textResidentButtonText}>Text Resident</Text>
            </TouchableOpacity>
          )}
        </View>

        {!isAuthorized && (
          <TouchableOpacity
            style={styles.sendToTowingButtonFull}
            onPress={handleSendToTowingFromScan}>
            <Text style={styles.actionButtonIcon}>!</Text>
            <Text style={styles.sendToTowingButtonText}>Send to Towing Queue</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Fragment>
      <AppHeader title={headerTitle} showLogo/>
      <KeyboardAwareScrollView style={styles.container}>
        {/* Property Selection Section */}
        <UserInteractionItem
          haveItemHeader
          labelText={"Property Selection"}
          iconName={propertySelectionIcon.colored}
          interactionType="dropdown"
          dropdownItems={properties}
          selectedItem={selectedProperty}
          setSelectedItem={selectProperty}
          all={undefined}
          unauthorized={undefined}
          valid={undefined}
        />
        {/* Selected Property Info */}
        {selectedProperty && <SelectedPropertyInfo selectedProperty={selectedProperty}/>}

        {/* Vehicle Check Section */}
        <View style={styles.tabContainer}>
          <CustomButton
            label={scanTexts.manualM}
            icon={inputMethod === scanTexts.manual ? keypadIcon.white : keypadIcon.colored}
            onPress={() => setInputMethod(scanTexts.manual)}
            buttonStyle={[
              styles.tab,
              inputMethod === scanTexts.manual && styles.tabActive,
              styles.tabLeft,
              {margin: 0, flex: 0.48}
            ]}
            labelStyle={{color: inputMethod === scanTexts.manual ? Colors.white : PANTONE7546}}
            iconColor={inputMethod === scanTexts.manual ? Colors.white : PANTONE7546}
          />
          <CustomButton
            label={scanTexts.scanS}
            icon={inputMethod === scanTexts.scan ? scanIcon.white : scanIcon.colored}
            onPress={() => setInputMethod(scanTexts.scan)}
            buttonStyle={[
              styles.tab,
              inputMethod === scanTexts.scan && styles.tabActive,
              styles.tabRight,
              {margin: 0, flex: 0.48}
            ]}
            labelStyle={{color: inputMethod === scanTexts.scan ? Colors.white : PANTONE7546}}
            iconColor={inputMethod === scanTexts.scan ? Colors.white : PANTONE7546}
          />
        </View>
        
        {inputMethod === 'scan' && (
          <View style={styles.scanContainer}>
            {/* {!isScanning && 
              <ScanTabContent 
                useCameraDevice={useCameraDevice}
                Camera={Camera}
                onResult={onResult}
                parkingSpot={parkingSpot}
                isScanning={isScanning}
                setLicensePlate={(text) => setLicensePlate(text)}
                setIsScanning={(text) => setIsScanning(text)}
                setCapturedImage={(text) => setCapturedImage(text)}
                setIsProcessing={(text) => setIsProcessing(text)}
              />
            } */}
            {/* {!isScanning ? (
              
            ) : isScanning && device && hasPermission && Camera ? (
              <View style={styles.cameraContainer}>
                <Camera
                  ref={cameraRef}
                  style={styles.cameraView}
                  device={device}
                  isActive={isScanning}
                  photo={true}
                />
                <View style={styles.cameraControls}>
                  <TouchableOpacity
                    testID="scan-capture-button"
                    style={[
                      styles.captureButton,
                      isProcessing && styles.captureButtonDisabled,
                    ]}
                    onPress={takePicture}
                    disabled={isProcessing}>
                    <View style={styles.captureButtonInner} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.stopScanButton}
                    onPress={handleStopScan}>
                    <Text style={styles.stopScanButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                {isProcessing && (
                  <View style={styles.processingOverlay}>
                    <Text style={styles.processingText}>Processing...</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.scanArea}>
                <Text style={styles.cameraIcon}>⚠️</Text>
                <Text style={styles.scanInstruction}>
                  {!hasPermission
                    ? 'Camera permission required'
                    : 'Camera not available'}
                </Text>
              </View>
            )} */}

            <View style={styles.vehicleCard}>
              <Text style={styles.inputLabel}>License Plate Number</Text>
              <TextInput
                style={styles.plateInput}
                placeholder="ENTER PLATE NUMBER (E.G., ABC-1234)"
                placeholderTextColor={Colors.textLight}
                value={licensePlate}
                onChangeText={setLicensePlate}
                autoCapitalize="characters"
              />
              {renderCheckVehicleButton()}
            </View>

            {renderVerificationPanel()}
          </View>
        )}

        {inputMethod === 'manual' && (
          <View style={styles.vehicleCard}>
            <Text style={styles.inputLabel}>License Plate Number</Text>
            <TextInput
              style={styles.plateInput}
              placeholder="ENTER PLATE NUMBER (E.G., ABC-1234)"
              placeholderTextColor={Colors.textLight}
              value={licensePlate}
              onChangeText={setLicensePlate}
              autoCapitalize="characters"
              returnKeyType="done"
            />
            {renderCheckVehicleButton()}
            {renderVerificationPanel()}
          </View>
        )}
      </KeyboardAwareScrollView>
      
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100, // Extra padding for keyboard
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  dropdownContainer: {
    position: 'relative',
    marginBottom: 16,
    zIndex: 1000,
  },
  dropdownButton: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'left',
  },
  dropdownIcon: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.cardBackground,
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'left',
  },
  dropdownItemTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
  propertyCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 16,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabLeft: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  tabRight: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.tabPantone7546,
    borderColor: Colors.tabPantone7546,
  },
  tabIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  scanContainer: {
    marginTop: 8,
  },
  scanArea: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    padding: 32,
    alignItems: 'center',
    minHeight: 300,
    justifyContent: 'center',
  },
  cameraIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  scanInstruction: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  startScanButton: {
    backgroundColor: Colors.tabPantone7546,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
    alignItems: 'center',
  },
  startScanButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  startScanButtonDisabled: {
    opacity: 0.5,
  },
  permissionText: {
    fontSize: 12,
    color: Colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  fullScreenCameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fullScreenCamera: {
    flex: 1,
  },
  cameraContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    overflow: 'hidden',
    minHeight: 300,
    position: 'relative',
  },
  cameraView: {
    width: '100%',
    minHeight: 300,
    aspectRatio: 4 / 3,
  },
  scannedPlateContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  scannedPlateLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  plateNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannedPlateText: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginRight: 8,
  },
  authorizationIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorizedIcon: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  unauthorizedIcon: {
    fontSize: 20,
    color: '#F44336',
    fontWeight: 'bold',
  },
  authorizationStatusText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
  },
  inputWithIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
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
    backgroundColor: '#9E9E9E',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
    fontWeight: '600',
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
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default ScanScreen;
