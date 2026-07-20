import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors, PANTONE7546 } from "../../constants/Colors";
import { Text } from "react-native-gesture-handler";
import { SvgXml } from "react-native-svg";
import { downArrowIcon, locationPinIcon, messaging, propertySelectionIcon, upArrowIcon } from "../../components/Icons";
import { scanTexts } from "../../constants/Constants";
import CustomButton from "../../components/CustomButton";

type VehicleVerificationCardViewProps = {
    isRegistered?: boolean;
}

const VehicleVerificationCardView: React.FC<VehicleVerificationCardViewProps> = ({isRegistered}: any) => {
    return (
        <View style={styles.vehicleVerificationCard}>
            <View style={[styles.verificationCardTopView, { backgroundColor: isRegistered ? 'rgba(26, 179, 26, 0.2)' : 'rgba(255,0,0,0.2)' }]}>
                <SvgXml xml={locationPinIcon.white} color={isRegistered ? 'rgba(10, 149, 10, 1)' : 'rgba(255,0,0,1)'} />
                <Text style={[styles.title, !isRegistered && { marginBottom: 0 }]}>{isRegistered ? scanTexts.vehicleRegisteredTitle : scanTexts.vehicleUnegisteredTitle}</Text>
                {isRegistered && <Text style={styles.subTitle}>{scanTexts.vehicleRegisteredSubTitle}</Text>}
            </View>
            <View style={styles.actionButtons}>
                <CustomButton
                    icon={downArrowIcon.grey}
                    iconColor={'#008000'}
                    iconSize={30}
                    buttonStyle={[styles.actionButtonStyle, styles.separatorLine, isRegistered && { flex: 0.7 }]}
                />
                {isRegistered && <CustomButton
                    icon={messaging.background}
                    iconColor={'#fff'}
                    iconSize={30}
                    buttonStyle={[styles.actionButtonStyle, styles.separatorLine, styles.messagingIcon]}
                />}
                <CustomButton
                    icon={propertySelectionIcon.colored}
                    iconColor={'#ff0000'}
                    iconSize={25}
                    buttonStyle={[styles.actionButtonStyle, isRegistered && { flex: 0.7 }]}
                />
            </View>
        </View>
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
        flex: 0.3,
        backgroundColor: PANTONE7546,
        borderRadius: 10,
        paddingVertical: 10,
    }
})