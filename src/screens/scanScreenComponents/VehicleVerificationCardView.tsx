import React, { Fragment, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Colors, PANTONE7546 } from "../../constants/Colors";
import { Text } from "react-native-gesture-handler";
import { SvgXml } from "react-native-svg";
import { downArrowIcon, locationPinIcon, messaging, propertySelectionIcon, upArrowIcon } from "../../components/Icons";
import { scanTexts } from "../../constants/Constants";
import CustomButton from "../../components/CustomButton";
import TextResident from "./TextResident";

type VehicleVerificationCardViewProps = {
    isRegistered?: boolean;
    currentVehicle?: any;
    selectedProperty?: any;
}

const VehicleVerificationCardView: React.FC<VehicleVerificationCardViewProps> = ({ isRegistered, currentVehicle, selectedProperty }: any) => {
    const [button2Selected, setButton2Selected] = useState(false);
    const [button3Selected, setButton3Selected] = useState(false);
    let buttonFlex: number = isRegistered ? 0.33 : 0.5;
    return (
        <Fragment>
            <View style={styles.vehicleVerificationCard}>
                {/* Verification Status */}
                <View style={[styles.verificationCardTopView, { backgroundColor: isRegistered ? 'rgba(26, 179, 26, 0.2)' : 'rgba(255,0,0,0.2)' }]}>
                    <SvgXml xml={locationPinIcon.white} color={isRegistered ? 'rgba(10, 149, 10, 1)' : 'rgba(255,0,0,1)'} />
                    <Text style={[styles.title, !isRegistered && { marginBottom: 0 }]}>{isRegistered ? scanTexts.vehicleRegisteredTitle : scanTexts.vehicleUnegisteredTitle}</Text>
                    {isRegistered && <Text style={styles.subTitle}>{scanTexts.vehicleRegisteredSubTitle}</Text>}
                </View>
                <View style={styles.actionButtons}>
                    {/* Button 1 */}
                    <CustomButton
                        icon={downArrowIcon.grey}
                        iconColor={Colors.green}
                        iconSize={30}
                        buttonStyle={[styles.actionButtonStyle, !(button2Selected || button3Selected) && styles.separatorLine, { flex: buttonFlex }]}
                    />
                    {/* Button 2 */}
                    {isRegistered ? <CustomButton
                        icon={button2Selected ? messaging.whiteBackground : messaging.transparentBackground}
                        iconColor={button2Selected ? Colors.white : PANTONE7546}
                        iconSize={30}
                        onPress={() => [setButton2Selected(true), setButton3Selected(false)]}
                        buttonStyle={[styles.actionButtonStyle, styles.messagingIcon, button2Selected && styles.selectedIcon, !(button2Selected || button3Selected) && styles.separatorLine, { flex: buttonFlex }]}
                    /> : null}
                    {/* Button 3 */}
                    <CustomButton
                        icon={propertySelectionIcon.colored}
                        iconColor={!button3Selected ? Colors.red : Colors.white}
                        iconSize={30}
                        onPress={() => [setButton2Selected(false), setButton3Selected(true)]}
                        buttonStyle={[styles.actionButtonStyle, styles.messagingIcon, { flex: buttonFlex }, button3Selected && [styles.selectedIcon, {backgroundColor: Colors.red}]]}
                    />
                </View>
            </View>
            {/* "Text Resident" Feature */}
            {(button2Selected || button3Selected) &&
            <TextResident 
                currentVehicle={currentVehicle} 
                selectedProperty={selectedProperty} 
                shouldShowRequestTowView={button3Selected}
                removeSelection={() => [setButton2Selected(false), setButton3Selected(false)]}
            />}
        </Fragment>
    )
}

export default VehicleVerificationCardView;

const styles = StyleSheet.create({
    vehicleVerificationCard: {
        backgroundColor: Colors.white,
        marginTop: 15,
        marginBottom: 10,
        borderRadius: 15,
        borderColor: Colors.white,
        shadowColor: Colors.border,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    verificationCardTopView: {
        borderTopLeftRadius: 15,
        borderTopEndRadius: 15,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center'
    },
    subTitle: {
        marginTop: 5,
        fontSize: 15,
        textAlign: 'center'
    },
    actionButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5
    },
    actionButtonStyle: {
        flex: 1,
        margin: 0,
        padding: 0,
        borderWidth: 0,
        borderColor: Colors.white,
        shadowOpacity: 0,
    },
    separatorLine: { borderRightWidth: 1, borderRightColor: Colors.grey1, borderRadius: 0 },
    messagingIcon: {
        flex: 0.2,
    },
    selectedIcon: {
        backgroundColor: PANTONE7546,
        borderRadius: 10,
        padding: 10,
    }
})