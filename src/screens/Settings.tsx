import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AppHeader from "../components/AppHeader";
import { settingsTexts } from "../constants/Constants";
import CardView from "./settingsComponents/CardView";
import { darkMode, person, propertySelectionIcon } from "../components/Icons";
import { Colors, PANTONE7546 } from "../constants/Colors";
import { darkModeStyles } from "../components/Theme";

const Settings = () => (
    <View style={styles.outerContainer}>
        <AppHeader title={settingsTexts.headerTitle} />
        <ScrollView showsVerticalScrollIndicator={false} style={styles.innerContainer}>
            <Text
                style={[
                    styles.sectionHeaderLabel,
                    // (colors as any)?.dark && darkModeStyles.text,
                ]}
            >
                User Preferences
            </Text>
            <View style={styles.gap} />
            <CardView
                icon={person}
                iconSize={30}
                cardTitle="Update Profile"
                cardSubtitle={`You can update your profile name and the towing company email here.`}
                cardType="arrow"
                handleClick={() => undefined}
            />
            <View style={styles.gap} />
            <CardView
                icon={darkMode}
                iconSize={30}
                cardTitle="Change App Theme"
                cardSubtitle={`You can switch to dark mode here.`}
                cardType="switch"
                handleClick={() => undefined}
            />
            <View style={styles.gap} />
            <Text
                style={[
                    styles.sectionHeaderLabel,
                    // (colors as any)?.dark && darkModeStyles.text,
                ]}
            >
                {settingsTexts.support}
            </Text>
            <View style={styles.gap} />
            <CardView
                icon={propertySelectionIcon.colored}
                iconSize={30}
                cardTitle="Help and Support"
                cardType="arrow"
                handleClick={() => undefined}
            />
            <View style={styles.gap} />
            <CardView
                icon={propertySelectionIcon.colored}
                iconSize={30}
                cardTitle="Terms of Use"
                cardType="arrow"
                handleClick={() => undefined}
            />
            <View style={styles.gap} />
            <CardView
                icon={propertySelectionIcon.colored}
                iconSize={30}
                cardTitle="Privacy Policy"
                cardType="arrow"
                handleClick={() => undefined}
            />
            <View style={styles.gap} />
            <Text
                style={[
                    styles.sectionHeaderLabel,
                    // (colors as any)?.dark && darkModeStyles.text,
                ]}
            >
                Going out!
            </Text>
            <View style={styles.gap} />
            <CardView
                icon={propertySelectionIcon.colored}
                iconSize={30}
                cardTitle={settingsTexts.logoutCardTitle}
                cardType="arrow"
                handleClick={() => undefined}
            />
        </ScrollView>
    </View>
)

export default Settings;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: Colors.white
    },
    innerContainer: {
        margin: 10,
        marginVertical: 20,
    },
    gap: { height: 20 },
    sectionHeaderLabel: {
        color: PANTONE7546,
        fontSize: 18,
        fontWeight: 'bold'
    },
})