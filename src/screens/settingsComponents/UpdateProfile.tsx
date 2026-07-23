import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Colors, PANTONE7546 } from "../../constants/Colors";
import AppHeader from "../../components/AppHeader";
import UserInteractionItem from "../../components/UserInteractionItem";
import CustomButton from "../../components/CustomButton";

const UpdateProfile = () => {
    const [profileName, setProfileName] = useState("");
    const [towingEmail, setTowingEmail] = useState("");
    return (
        <View style={styles.outerContainer}>
            <AppHeader title="Update Profile" />
            <ScrollView showsVerticalScrollIndicator={false} style={styles.innerContainer}>
                {/* Profile Name Field */}
                <UserInteractionItem
                    labelText={"Profile Name"}
                    // iconName={propertySelectionIcon.colored}
                    value={profileName}
                    onChange={text => setProfileName(text)}
                    interactionType="textbox"
                    haveItemHeader
                    placeholder={"ENTER YOUR NAME"}
                    all={undefined}
                    unauthorized={undefined}
                    valid={undefined}
                />
                {/* Towing Company Email Address */}
                <UserInteractionItem
                    labelText={"Towing Company Email Address"}
                    // iconName={propertySelectionIcon.colored}
                    value={towingEmail}
                    onChange={text => setTowingEmail(text)}
                    interactionType="textbox"
                    haveItemHeader
                    placeholder={"ENTER THE TOWING COMPANY EMAIL ADDRESS"}
                    all={undefined}
                    unauthorized={undefined}
                    keyboardType="email-address"
                    valid={undefined}
                />
                <View style={styles.gap} />
                {/* Email-to-self button */}
                <CustomButton
                    // icon={"UPDATE PROFILE"}
                    label={`UPDATE PROFILE`}
                    onPress={() => undefined}
                    buttonStyle={styles.button}
                    labelStyle={styles.labelStyle}
                />
            </ScrollView>
        </View>
    )
};

export default UpdateProfile;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: Colors.white
    },
    innerContainer: {
        margin: 10,
        marginVertical: 20,
    },
    gap: { height: 10 },
    button: {
        margin: 0,
        backgroundColor: PANTONE7546
    },
    labelStyle: {
        color: Colors.white
    }
})