import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScanScreen from '../screens/ScanScreen';
import Worklist from '../screens/Worklist';
import ScanHistoryScreen from '../screens/ScanHistoryScreen';
import { Colors } from '../constants/Colors';
import TabBarIcon from '../components/TabBarIcon';
import AppHeader from '../components/AppHeader';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.55)',
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name="scan"
              color={color}
              size={size}
              focused={focused}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color,
                fontSize: 12,
                fontWeight: focused ? 'bold' : 'normal',
              }}
            >
              Scan
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Worklist"
        component={Worklist}
        options={{
          headerShown: false,
          headerLeft: () => <AppHeader title="" />,
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name="towing"
              color={color}
              size={size}
              focused={focused}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color,
                fontSize: 12,
                fontWeight: focused ? 'bold' : 'normal',
              }}
            >
              Worklist
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="ScanHistory"
        component={ScanHistoryScreen}
        options={{
          headerShown: false,
          headerLeft: () => <AppHeader title="" />,
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name="history"
              color={color}
              size={size}
              focused={focused}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color,
                fontSize: 12,
                fontWeight: focused ? 'bold' : 'normal',
              }}
            >
              Scan History
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: Colors.tabPantone7546,
    borderTopColor: Colors.tabPantone7546,
    borderTopWidth: 0,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabHeader: {
    backgroundColor: Colors.tabPantone7546,
  },
})