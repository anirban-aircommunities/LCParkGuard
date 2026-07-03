import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";
import UserInteractionItem from "./UserInteractionItem";
import { propertySelectionIcon } from "./Icons";
import { ScanHistoryItem } from "../models/ScanHistory";
import { SvgXml } from "react-native-svg";

type ScanHistoryCardViewProps = {
    checkbox?: boolean;
    iconName?: string;
    iconSize?: number;
    labelIconAdditionalStyle?: any;
    licensePlate?: string;
    parkingSpot?: string;
    propertyName?: string;
    address?: string;
    status?: string;
    scannedAt?: string;
    source?: string;
    sentToTowingCompany?: boolean;
}

const ScanHistoryCardView: React.FC<ScanHistoryCardViewProps> = ({ checkbox, iconName, iconSize, labelIconAdditionalStyle, licensePlate, parkingSpot, propertyName, address, status, scannedAt, source, sentToTowingCompany }: any) => (
    <View style={styles.outerContainer}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
            {checkbox &&
                <TouchableOpacity style={[styles.iconContainer, labelIconAdditionalStyle]}>
                    <SvgXml xml={iconName} height={iconSize} width={iconSize} />
                </TouchableOpacity>}
            <View style={styles.frontRow}>
                <Text style={[styles.heading, checkbox && {paddingLeft: 10}]}>{licensePlate}</Text>
                {status && <Text style={styles.scannedText}>{status}</Text>}
            </View>
        </View>
        <UserInteractionItem
            labelText={`${address} - Unit ${parkingSpot}`}
            iconName={propertySelectionIcon.colored}
            haveItemHeader
            iconSize={16}
            labelSize={13}
            labelTextAdditionalStyle={styles.subText}
            labelIconAdditionalStyle={styles.subItem}
            labelContainerAdditionalStyle={styles.subContainer}
        />
        <UserInteractionItem
            labelText={scannedAt}
            iconName={propertySelectionIcon.colored}
            haveItemHeader
            iconSize={16}
            labelSize={13}
            labelTextAdditionalStyle={styles.subText}
            labelIconAdditionalStyle={styles.subItem}
            labelContainerAdditionalStyle={styles.subContainer}
        />
        <UserInteractionItem
            labelText={`Entered by: ${propertyName}`}
            iconName={propertySelectionIcon.colored}
            haveItemHeader
            iconSize={16}
            labelSize={13}
            labelTextAdditionalStyle={styles.subText}
            labelIconAdditionalStyle={styles.subItem}
            labelContainerAdditionalStyle={styles.subContainer}
        />
    </View>
);

export default ScanHistoryCardView;

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey1,
        padding: 15,
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 15
    },
    frontRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    scannedText: {
        color: Colors.white,
        fontSize: 13,
        backgroundColor: Colors.textLight,
        padding: 5,
        borderRadius: 10
    },
    subText: { fontWeight: '300', paddingLeft: 0 },
    subItem: { padding: 0, alignItems: 'flex-start' },
    subContainer: { marginBottom: 0 },
    iconContainer: {
        borderRadius: 15,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

