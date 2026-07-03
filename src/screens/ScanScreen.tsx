import React, { useState, useRef, useEffect } from 'react';
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
import { propertySelectionIcon } from '../components/Icons';

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

  const [inputMethod, setInputMethod] = useState<'scan' | 'manual'>('manual');
  const [licensePlate, setLicensePlate] = useState('');
  const [parkingSpot, setParkingSpot] = useState('');
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [isTowingInfoExpanded, setIsTowingInfoExpanded] = useState(true);
  const [isTextResidentModalVisible, setIsTextResidentModalVisible] = useState(false);

  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef<any>(null);
  const parkingSpotInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const device = useCameraDevice ? useCameraDevice('back') : null;

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
    setInputMethod('manual');
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
        source: inputMethod === 'manual' ? 'manual' as const : 'camera' as const,
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

  const handleStartScan = () => {
    if (!hasPermission) {
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to scan license plates.',
        [{ text: 'OK' }]
      );
      return;
    }
    if (!device) {
      Alert.alert(
        'Camera Not Available',
        'No camera device found.',
        [{ text: 'OK' }]
      );
      return;
    }
    // Reset processing state when starting a new scan
    setIsProcessing(false);
    setCapturedImage(null);
    setIsScanning(true);
  };


  useEffect(() => {
    if (!Camera) {
      console.warn('Camera module not available');
      return;
    }

    // Request camera permission
    const requestPermission = async () => {
      try {
        const permission = await Camera.requestCameraPermission();
        setHasPermission(permission === 'granted');
      } catch (error) {
        console.error('Permission error:', error);
      }
    };
    requestPermission();
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePhoto({
        flash: 'off',
      });

      const imageUri = `file://${photo.path}`;
      setCapturedImage(imageUri);
      setIsScanning(false);

      // Process the image
      const result = await recognizePlate(imageUri);

      // Extract and log plate number - using multiple logging methods for visibility
      if (result.results && result.results.length > 0) {
        const plateNumber = result.results[0].plate;

        // Update license plate state
        const detectedPlateNumber = plateNumber.toUpperCase();
        setLicensePlate(detectedPlateNumber);

        // Generate dummy parking spot if not provided
        const dummyParkingSpot = parkingSpot || `A-${Math.floor(Math.random() * 200) + 1}`;

        // Update parking spot state if it was generated
        // if (!parkingSpot) {
        //   setParkingSpot(dummyParkingSpot);
        // }

        // Don't add to scan history automatically - wait for authorization check

        // Use console.warn for better visibility (shows in yellow)
        console.warn('========================================');
        console.warn('🚗 PLATE NUMBER DETECTED:', detectedPlateNumber);
        console.warn('========================================');

        // Also use console.log with clear prefix
        console.log('PLATE_NUMBER:', detectedPlateNumber);

        // Log additional details
        const details: string[] = [];
        if (result.results[0].region) {
          details.push(`Region: ${result.results[0].region.code}`);
          console.log('REGION:', result.results[0].region.code);
        }
        if (result.results[0].vehicle) {
          const vehicle = result.results[0].vehicle;
          if (vehicle.make && vehicle.make.length > 0) {
            details.push(`Make: ${vehicle.make[0].make}`);
            console.log('VEHICLE_MAKE:', vehicle.make[0].make);
          }
          if (vehicle.model && vehicle.model.length > 0) {
            details.push(`Model: ${vehicle.model[0].model}`);
            console.log('VEHICLE_MODEL:', vehicle.model[0].model);
          }
          if (vehicle.color && vehicle.color.length > 0) {
            details.push(`Color: ${vehicle.color[0].color}`);
            console.log('VEHICLE_COLOR:', vehicle.color[0].color);
          }
        }
        const confidence = Math.round(result.results[0].score * 100);
        // details.push(`Confidence: ${confidence}%`);
        console.log('CONFIDENCE:', confidence + '%');

        // Log all details together
        console.warn('Details:', details.join(', '));
        console.warn('========================================');

        // Use console.error to ensure it's visible (shows in red)
        // console.error(`[PLATE_RECOGNITION] Plate: ${detectedPlateNumber}`);

        // Log with NSLog-like format for iOS
        if (Platform.OS === 'ios') {
          console.log(`[NSLog] Plate Number: ${detectedPlateNumber}`);
        }

        // Reset processing state after successful detection
        setIsProcessing(false);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
        // Show alert with plate number - authorization check needed
        // Alert.alert(
        //   'Plate Detected',
        //   `Plate Number: ${detectedPlateNumber}\nPlease check authorization to add to scan history.`,
        //   [
        //     {
        //       text: 'OK',
        //       onPress: () => {
        //         // Scroll to bottom after OK is pressed
        //         setTimeout(() => {
        //           scrollViewRef.current?.scrollToEnd({ animated: true });
        //         }, 100);
        //       },
        //     },
        //   ],
        // );
      } else {
        // console.warn('⚠️ No plate detected in image');
        // console.error('[PLATE_RECOGNITION] No plate detected');
        Alert.alert('No Plate Found', 'Could not detect a license plate in the image. Please try again.');
        setIsProcessing(false);
        setIsScanning(true);
        return;
      }

      if (onResult) {
        onResult(result);
      }

      // Ensure processing is reset
      setIsProcessing(false);
    } catch (error: any) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', error.message || 'Failed to capture image');
      setIsProcessing(false);
      setIsScanning(true);
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    setCapturedImage(null);
    setIsProcessing(false);
  };

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
    <SafeAreaView style={styles.container}>
      {/* Loading Overlay - Blocks UI while processing */}
      <Modal
        visible={isProcessing}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}>
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.secondary} />
            <Text style={styles.loadingText}>Detecting License Plate...</Text>
            <Text style={styles.loadingSubtext}>Please wait</Text>
          </View>
        </View>
      </Modal>

      <TextResidentModal
        visible={isTextResidentModalVisible}
        onClose={() => setIsTextResidentModalVisible(false)}
        licensePlate={currentVehicle?.licensePlate ?? licensePlate}
        propertyName={selectedProperty?.name}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}>
          <View style={styles.section}>
            {/* Property Selection Section */}
            <UserInteractionItem
              haveItemHeader
              labelText={"Property Selection"}
              iconName={propertySelectionIcon.colored}
              interactionType="dropdown"
              dropdownItems={properties}
              selectedItem={selectedProperty}
              setSelectedItem={selectProperty}
            />

            {selectedProperty && (
              <View style={styles.expandablePropertyCard}>
                <View style={styles.propertyAddressRow}>
                  <Text style={styles.propertyRowIcon}>📍</Text>
                  <Text style={styles.propertyAddressText}>{selectedProperty.address}</Text>
                </View>

                <TouchableOpacity
                  style={styles.towingInfoHeader}
                  onPress={() => setIsTowingInfoExpanded(!isTowingInfoExpanded)}
                  activeOpacity={0.8}>
                  <View style={styles.towingInfoHeaderLeft}>
                    <Text style={styles.propertyRowIcon}>🚛</Text>
                    <Text style={styles.towingInfoTitle}>Towing Company Info</Text>
                  </View>
                  <Text style={styles.expandIcon}>{isTowingInfoExpanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {isTowingInfoExpanded && (
                  <View style={styles.towingInfoContent}>
                    <Text style={styles.towingInfoLine}>
                      <Text style={styles.towingInfoLabel}>Name: </Text>
                      {selectedProperty.towingCompany}
                    </Text>
                    <Text style={styles.towingInfoLine}>
                      <Text style={styles.towingInfoLabel}>Phone: </Text>
                      {selectedProperty.towingPhone}
                    </Text>
                    <Text style={styles.towingInfoLine}>
                      <Text style={styles.towingInfoLabel}>Email: </Text>
                      {selectedProperty.towingEmail || 'contact@quicktow.com'}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Vehicle Check Section */}
          <View style={styles.section}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  inputMethod === 'manual' && styles.tabActive,
                  styles.tabLeft,
                ]}
                onPress={() => setInputMethod('manual')}>
                <Image
                  source={inputMethod === 'manual' ? assets.keyboardWhite : assets.keyboard}
                  style={styles.tabIcon}
                />
                <Text
                  style={[
                    styles.tabText,
                    inputMethod === 'manual' && styles.tabTextActive,
                  ]}>
                  Manual
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  inputMethod === 'scan' && styles.tabActive,
                  styles.tabRight,
                ]}
                onPress={() => setInputMethod('scan')}>
                <Image
                  source={inputMethod === 'scan' ? assets.cameraWhite : assets.camera}
                  style={styles.tabIcon}
                />
                <Text
                  style={[
                    styles.tabText,
                    inputMethod === 'scan' && styles.tabTextActive,
                  ]}>
                  Scan
                </Text>
              </TouchableOpacity>
            </View>

            {inputMethod === 'scan' && (
              <View style={styles.scanContainer}>
                {!isScanning ? (
                  <View style={styles.scanArea}>
                    <View style={styles.cameraIconContainer}>
                      <View style={styles.frameTopLeft} />
                      <View style={styles.frameTopRight} />
                      <View style={styles.frameBottomLeft} />
                      <View style={styles.frameBottomRight} />
                      <View style={styles.cameraIconBody}>
                        <View style={styles.cameraLens}>
                          <View style={styles.cameraLensInner} />
                        </View>
                        <View style={styles.cameraFlash} />
                      </View>
                    </View>
                    <Text style={styles.scanInstruction}>
                      Position camera to scan license plate
                    </Text>
                    {!hasPermission && (
                      <Text style={styles.permissionText}>
                        Camera permission is required to scan plates
                      </Text>
                    )}
                    <TouchableOpacity
                      style={[
                        styles.startScanButton,
                        (!hasPermission || !device) && styles.startScanButtonDisabled,
                      ]}
                      onPress={handleStartScan}
                      disabled={!hasPermission || !device}>
                      <Text style={styles.startScanButtonText}>Start Scan</Text>
                    </TouchableOpacity>
                  </View>
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
                )}

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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 24,
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
  expandablePropertyCard: {
    backgroundColor: Colors.tabPantone7546,
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
  },
  propertyAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  propertyRowIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  propertyAddressText: {
    fontSize: 14,
    color: Colors.white,
    flex: 1,
  },
  towingInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  towingInfoHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  towingInfoTitle: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
  },
  expandIcon: {
    fontSize: 12,
    color: Colors.white,
    marginLeft: 8,
  },
  towingInfoContent: {
    marginTop: 8,
    paddingLeft: 24,
  },
  towingInfoLine: {
    fontSize: 14,
    color: Colors.white,
    marginBottom: 6,
  },
  towingInfoLabel: {
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
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
  cameraIconContainer: {
    width: 120,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  frameTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: PANTONE7546,
    borderTopLeftRadius: 4,
  },
  frameTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: PANTONE7546,
    borderTopRightRadius: 4,
  },
  frameBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: PANTONE7546,
    borderBottomLeftRadius: 4,
  },
  frameBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: PANTONE7546,
    borderBottomRightRadius: 4,
  },
  cameraIconBody: {
    width: 70,
    height: 50,
    backgroundColor: PANTONE7546,
    borderRadius: 6,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraLens: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PANTONE7546,
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraLensInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.white,
  },
  cameraFlash: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PANTONE7546,
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
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    borderWidth: 3,
    borderColor: Colors.secondary,
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.secondary,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  stopScanButton: {
    backgroundColor: Colors.error,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    alignItems: 'center',
  },
  stopScanButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
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
