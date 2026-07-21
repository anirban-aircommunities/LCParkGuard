import React, { useState, useEffect, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors, PANTONE7546 } from '../constants/Colors';
import { useScanViewModel } from '../viewmodels/ScanViewModel';
import { useDispatch } from 'react-redux';
import { addScanHistory } from '../redux/slices/scanHistorySlice';
import { PlateRecognizerResponse } from './plateRecognizer/plateRecognizer';
import TextResidentModal from '../components/TextResidentModal';
import UserInteractionItem from '../components/UserInteractionItem';
import {
  keypadIcon,
  propertySelectionIcon,
  scanIcon,
} from '../components/Icons';
import AppHeader from '../components/AppHeader';
import { headerTitle, scanTexts } from '../constants/Constants';
import SelectedPropertyInfo from './scanScreenComponents/SelectedPropertyInfo';
import CustomButton from '../components/CustomButton';
import ScanTabContent from './scanScreenComponents/ScanTabContent';
import ManualTabContent from './scanScreenComponents/ManualTabContent';
import VehicleVerificationCardView from './scanScreenComponents/VehicleVerificationCardView';

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
  const [showVerficationView, setShowVerficationView] = useState(false);
  const [isTextResidentModalVisible, setIsTextResidentModalVisible] =
    useState(false);

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

  const showVerificationResult = licensePlate?.trim() == currentVehicle?.licensePlate && currentVehicle?.status == 'registered';

  // Track if we've already added this vehicle to scan history
  const [hasAddedToHistory, setHasAddedToHistory] = useState(false);
  const [hasSentToTowing, setHasSentToTowing] = useState(false);

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
        source: inputMethod === scanTexts.manual ? scanTexts.manual : 'camera',
      };

      dispatch(addScanHistory(scanHistoryItem));
      setHasAddedToHistory(true);
    }
  }, [
    currentVehicle,
    selectedProperty,
    dispatch,
    hasAddedToHistory,
    inputMethod,
  ]);

  // Reset hasAddedToHistory and clear vehicle when license plate changes
  useEffect(() => {
    setHasAddedToHistory(false);
    setHasSentToTowing(false);
    if (currentVehicle && currentVehicle.licensePlate !== licensePlate) {
      clearCurrentVehicle();
    }
  }, [licensePlate, currentVehicle, clearCurrentVehicle]);
  // Handle showing verification panel 
  useEffect(() => {
    if(licensePlate?.trim() && !loading) {
      setShowVerficationView(true);
    }
  }, [currentVehicle, loading]);
  // Handle hiding verification panel, depending on changing license plate
  useEffect(() => {
    setShowVerficationView(false);
  }, [licensePlate]);
  // Handle hiding verification panel, depending on switching tabs
  useEffect(() => {
    setShowVerficationView(false);
    setLicensePlate("");
  }, [inputMethod]);

  return (
    <Fragment>
      <AppHeader title={headerTitle} showLogo />
      <KeyboardAwareScrollView style={styles.container}>
        {/* Property Selection Section */}
        <UserInteractionItem
          haveItemHeader
          labelText={'Property Selection'}
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
        {selectedProperty && (
          <SelectedPropertyInfo selectedProperty={selectedProperty} />
        )}

        {/* Vehicle Check Section */}
        <View style={styles.tabContainer}>
          <CustomButton
            label={scanTexts.manualM}
            icon={
              inputMethod === scanTexts.manual
                ? keypadIcon.white
                : keypadIcon.colored
            }
            onPress={() => setInputMethod(scanTexts.manual)}
            buttonStyle={[
              styles.tab,
              inputMethod === scanTexts.manual && styles.tabActive,
              styles.tabLeft,
              { margin: 0, flex: 0.48 },
            ]}
            labelStyle={{
              color:
                inputMethod === scanTexts.manual ? Colors.white : PANTONE7546,
            }}
            iconColor={
              inputMethod === scanTexts.manual ? Colors.white : PANTONE7546
            }
          />
          <CustomButton
            label={scanTexts.scanS}
            icon={
              inputMethod === scanTexts.scan ? scanIcon.white : scanIcon.colored
            }
            onPress={() => setInputMethod(scanTexts.scan)}
            buttonStyle={[
              styles.tab,
              inputMethod === scanTexts.scan && styles.tabActive,
              styles.tabRight,
              { margin: 0, flex: 0.48 },
            ]}
            labelStyle={{
              color:
                inputMethod === scanTexts.scan ? Colors.white : PANTONE7546,
            }}
            iconColor={
              inputMethod === scanTexts.scan ? Colors.white : PANTONE7546
            }
          />
        </View>

        {inputMethod === 'scan' ? (
          <View style={styles.scanContainer}>
            <ScanTabContent
              useCameraDevice={useCameraDevice}
              Camera={Camera}
              onResult={onResult}
              parkingSpot={parkingSpot}
              isScanning={isScanning}
              isProcessing={isProcessing}
              setLicensePlate={(text) => setLicensePlate(text)}
              setIsScanning={(text) => setIsScanning(text)}
              setCapturedImage={(text) => setCapturedImage(text)}
              setIsProcessing={(text) => setIsProcessing(text)}
            />
          </View>
        ) : (
          <ManualTabContent
            licensePlate={licensePlate?.trim()}
            parkingSpot={parkingSpot}
            setLicensePlate={(text) => setLicensePlate(text)}
            setParkingSpot={(text) => setParkingSpot(text)}
            setHasAddedToHistory={(text) => setHasAddedToHistory(text)}
            setHasSentToTowing={(text) => setHasSentToTowing(text)}
            setIsScanning={(text) => setIsScanning(text)}
            setCapturedImage={(text) => setCapturedImage(text)}
            setIsProcessing={(text) => setIsProcessing(text)}
            setInputMethod={(text) => setInputMethod(text)}
            setIsTextResidentModalVisible={(text) =>
              setIsTextResidentModalVisible(text)
            }
            showVerificationResult={showVerificationResult}
          />
        )}
        {/* Vehicle Verification Card View */}
        {showVerficationView && licensePlate?.trim() && <VehicleVerificationCardView
          isRegistered={showVerificationResult}
        />}
      </KeyboardAwareScrollView>
      {/* Loading Overlay - Blocks UI while processing */}
      <Modal
        visible={isProcessing}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
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
    </Fragment>
  );
};

{
  /* <KeyboardAvoidingView
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
          {/* <View style={styles.section}>
            
          </View>

          

            
          </View>
        </ScrollView>
      </KeyboardAvoidingView> */
}

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
    alignItems: 'center',
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
