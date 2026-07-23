import React from "react";
import { StyleSheet, View } from "react-native";
import AppHeader from "../components/AppHeader";
import { settingsTexts } from "../constants/Constants";

const Settings = () => (
    <View>
        <AppHeader title={settingsTexts.headerTitle}/>
    </View>
)

export default Settings;

const styles = StyleSheet.create({
    
})