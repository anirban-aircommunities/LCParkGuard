import React, { useState } from "react";
import { Alert, FlatList, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, PANTONE5487, PANTONE7546 } from "../../constants/Colors";
import UserInteractionItem from "../../components/UserInteractionItem";
import { scanTexts } from "../../constants/Constants";
import CustomButton from "../../components/CustomButton";
import { messaging } from "../../components/Icons";

type TextResidentProps = {
    licensePlate?: string;
    currentVehicle?: any;
    selectedProperty?: any;
    removeSelection?: () => void;
}

const TextResident: React.FC<TextResidentProps> = (props: any) => {
    const [textResidentPhoneNumber, setTextResidentPhoneNumber] = useState(props?.selectedProperty?.towingPhone);
    const [currentLocation, setCurrentLocation] = useState("");
    const [message, setMessage] = useState("");
    // Quick Messages
    const QUICK_MESSAGES = [
        { id: 'ada', label: 'Parked in ADA' },
        { id: 'fireLane', label: 'Parked in Fire Lane' },
        { id: 'hydrant', label: 'Blocked Fire Hydrant' },
        { id: 'assignedSpot', label: 'Not in Assigned Spot' },
    ];
    // Generate Quick Messages
    const buildQuickMessage = (type: string) => {
        const location = props?.selectedProperty?.name ? ` at ${props?.selectedProperty?.name}` : '';
        const plate = props?.currentVehicle?.licensePlate?.toUpperCase();

        switch (type) {
            case 'ada':
                return setMessage(`Parking notice: Vehicle ${plate}${location} is parked in an ADA space. Please move your vehicle immediately.`);
            case 'fireLane':
                return setMessage(`Parking notice: Vehicle ${plate}${location} is parked in a fire lane. Please move your vehicle immediately.`);
            case 'hydrant':
                return setMessage(`Parking notice: Vehicle ${plate}${location} is blocking a fire hydrant. Please move your vehicle immediately.`);
            case 'assignedSpot':
                return setMessage(`Parking notice: Vehicle ${plate}${location} is not parked in its assigned spot. Please move your vehicle to the correct location.`);
            default:
                return setMessage(`Parking notice for plate ${plate}. Please contact parking enforcement.`);
        }
    }
    // Send SMS 
    const sendSms = () => {
        if (!textResidentPhoneNumber?.trim() || !currentLocation?.trim() || !message?.trim()) {
            Alert.alert(
                'Missing Information',
                'Phone number, current location and message are required.',
                [{text: "Ok"}]
            );
            return;
        }

        const digits = textResidentPhoneNumber?.replace(/\D/g, '');

        Linking.openURL(`sms:${digits}&body=${encodeURIComponent(message.trim())}`).catch(() => {
            Alert.alert("", 'Unable to open Messages', [{text: "Ok"}]);
        });
    };
    return (
        <View style={styles.container}>
            {/* Text Field */}
            <UserInteractionItem
                labelText={scanTexts.textResidentPhoneNumber}
                value={textResidentPhoneNumber}
                onChange={setTextResidentPhoneNumber}
                interactionType="textbox"
                haveItemHeader
                placeholder={scanTexts.textResidentPhoneNumberPlaceholder}
                all={undefined}
                unauthorized={undefined}
                valid={undefined}
                autoCapitalize="characters"
                returnKeyType="done"
                whiteBackground
                keyboardType="phone-pad"
            />
            {/* Current Location */}
            <UserInteractionItem
                labelText={scanTexts.currentLocation}
                value={currentLocation}
                onChange={setCurrentLocation}
                interactionType="textbox"
                haveItemHeader
                placeholder={scanTexts.currentLocationPlaceholder}
                all={undefined}
                unauthorized={undefined}
                valid={undefined}
                autoCapitalize="characters"
                returnKeyType="done"
                whiteBackground
            />
            {/* Message */}
            <UserInteractionItem
                labelText={scanTexts.message}
                value={message}
                onChange={setMessage}
                interactionType="textbox"
                haveItemHeader
                placeholder={scanTexts.messagePlaceholder}
                all={undefined}
                unauthorized={undefined}
                valid={undefined}
                autoCapitalize="characters"
                returnKeyType="done"
                whiteBackground
                multiline
            />
            {/* Quick Messages */}
            <FlatList
                data={QUICK_MESSAGES}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CustomButton
                        key={item.id}
                        onPress={() => buildQuickMessage(item?.id)}
                        buttonStyle={styles.quickMessageButton}
                        label={item.label}
                        labelStyle={styles.quickMessageButtonText}
                    />
                )}
            />
            {/* "Cancel" & "Send Text" Buttons */}
            <View style={styles.buttonContainer}>
                <CustomButton
                    label={scanTexts.cancel}
                    onPress={props?.removeSelection}
                    buttonStyle={styles.cancelButton}
                    labelStyle={{}}
                />
                <View style={{ width: 10 }} />
                <CustomButton
                    label={scanTexts.sendText}
                    icon={messaging.whiteBackground}
                    onPress={sendSms}
                    buttonStyle={styles.sendTextButton}
                    labelStyle={styles.buttonTextStyle}
                />
            </View>
        </View>
    )
}

export default TextResident;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        marginTop: 15,
        marginBottom: 20,
        borderRadius: 15,
        borderColor: Colors.white,
        shadowColor: Colors.border,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
        padding: 15
    },
    quickMessageButton: {
        flex: 1,
        margin: 2,
        backgroundColor: PANTONE5487,
        borderRadius: 8,
        padding: 5,
        shadowOpacity: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickMessageButtonText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    cancelButton: {
        flex: 0.5,
        backgroundColor: Colors.grey1,
        borderWidth: 0,
        margin: 0,
        borderRadius: 5
    },
    sendTextButton: {
        flex: 0.5,
        backgroundColor: PANTONE7546,
        borderWidth: 0,
        margin: 0,
        borderRadius: 5
    },
    buttonTextStyle: {
        color: Colors.white,
        fontSize: 15,
        borderRadius: 5
    }
})