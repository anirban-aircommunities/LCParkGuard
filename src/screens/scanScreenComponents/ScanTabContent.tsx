import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CameraLensComponent from "./CameraLensComponent";
import { Colors } from "../../constants/Colors";
import { recognizePlate } from "../plateRecognizer/plateRecognizer";

type ScanTabContentProps = {
    useCameraDevice?: any;
    Camera?: any;
    onResult?: any;
    parkingSpot?: string;
    setLicensePlate?: ((text: any) => void) | undefined;
    isScanning?: boolean;
    isProcessing?: boolean;
    setIsScanning?: ((text: any) => void) | undefined;
    setCapturedImage?: ((text: any) => void) | undefined;
    setIsProcessing?: ((text: any) => void) | undefined;
}

const ScanTabContent: React.FC<ScanTabContentProps> = ({ useCameraDevice, Camera, onResult, parkingSpot, setLicensePlate, isScanning, isProcessing, setIsScanning, setCapturedImage, setIsProcessing }) => {

    const [hasPermission, setHasPermission] = useState(false);
    const cameraRef = useRef<any>(null);
    const parkingSpotInputRef = useRef<TextInput>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const device = useCameraDevice ? useCameraDevice('back') : null;
    // Handle "Start Scan"
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
    // Render "Not Scanning" segment
    const renderNotScanningSegment = () => (
        <View style={styles.scanArea}>
            <CameraLensComponent />
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
    )
    // Rendering "Scanning" segment
    const renderScanningSegment = () => (
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
    )
    const renderNotHavingPermissionContent = () => (
        <View style={styles.scanArea}>
            <Text style={styles.cameraIcon}>⚠️</Text>
            <Text style={styles.scanInstruction}>
                {!hasPermission
                ? 'Camera permission required'
                : 'Camera not available'}
            </Text>
            </View>
    )


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

    return (
        !isScanning ? renderNotScanningSegment() :
        isScanning && device && hasPermission && Camera ? renderScanningSegment() : renderNotHavingPermissionContent()
    )
}

export default ScanTabContent;

const styles = StyleSheet.create({
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
})